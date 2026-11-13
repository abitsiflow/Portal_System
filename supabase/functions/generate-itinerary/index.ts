import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
];

const MAX_RECORDS = 15;
const GEMINI_TIMEOUT_MS = 20000;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_CHARS = 1200;
const MAX_ITINERARY_CONTEXT_CHARS = 10000;

type GeminiInteractionPart = {
  type?: string;
  text?: string;
};

type GeminiInteractionStep = {
  type?: string;
  content?: GeminiInteractionPart[];
};

type GeminiInteractionResponse = {
  steps?: GeminiInteractionStep[];
  output_text?: string;
};

type ItinerarySpot = {
  id: string | number;
  name: string;
  entrance_fee?: number | string | null;
};

type ItineraryHotel = {
  id: string | number;
  name: string;
  price_min?: number | string | null;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractDestination(
  prompt: string,
  currentItinerary: any,
): string {
  if (
    typeof currentItinerary?.destination === "string" &&
    currentItinerary.destination.trim()
  ) {
    return currentItinerary.destination.trim();
  }

  const match = prompt.match(
    /\b(?:in|to|around|near)\s+([a-zA-Z][a-zA-Z\s-]{1,40}?)(?=\s+(?:with|for|on|from|and|under|within)\b|[,.!?]|$)/i,
  );

  return match?.[1]?.trim() ?? "";
}

function cleanDestination(destination: string): string {
  return destination.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
}

function getGeminiText(data: GeminiInteractionResponse): string {
  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  const textParts: string[] = [];

  for (const step of data.steps ?? []) {
    if (step.type !== "model_output") {
      continue;
    }

    for (const part of step.content ?? []) {
      if (part.type === "text" && typeof part.text === "string") {
        textParts.push(part.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

function parseGeminiJSON(text: string): any {
  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

async function callGeminiWithRetry(
  payload: Record<string, unknown>,
  apiKey: string,
): Promise<Response> {
  const retryDelays = [1500, 3000];

  let lastError = "Gemini request failed.";

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      console.log(
        `Gemini request: model=${model}, attempt=${attempt + 1}`,
      );

      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, GEMINI_TIMEOUT_MS);

      let response: Response;

      try {
        response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            ...payload,
            model,
          }),
          signal: controller.signal,
        });
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        console.error(
          `Gemini network error using ${model}:`,
          lastError,
        );

        if (attempt < 2) {
          await sleep(retryDelays[attempt]);
          continue;
        }

        break;
      } finally {
        clearTimeout(timeoutId);
      }

      if (response.ok) {
        console.log(`Gemini request successful using ${model}`);
        return response;
      }

      const errorText = await response.text();

      lastError = `Gemini ${model} returned ${response.status}: ${errorText}`;

      console.error(lastError);

      const retryableStatuses = [
        408,
        429,
        500,
        502,
        503,
        504,
      ];

      if (!retryableStatuses.includes(response.status)) {
        throw new Error(lastError);
      }

      if (attempt < 2) {
        await sleep(retryDelays[attempt]);
      }
    }

    console.warn(
      `All attempts failed for ${model}. Trying next model.`,
    );
  }

  throw new Error(lastError);
}

function getNumericValue(value: any): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      const requestId = crypto.randomUUID().slice(0, 8);

      try {
        console.log(`[${requestId}] Function started`);

        if (req.method !== "POST") {
          return Response.json(
            { error: "Method not allowed." },
            { status: 405 },
          );
        }

        const body = await req.json();

        const prompt = typeof body.prompt === "string"
          ? body.prompt.trim()
          : "";

        const history = Array.isArray(body.history) ? body.history : [];

        const currentItinerary = body.currentItinerary ?? null;

        if (!prompt) {
          return Response.json(
            { error: "Please enter a travel-related message." },
            { status: 400 },
          );
        }

        console.log(`[${requestId}] Request body validated`);

        const apiKey = Deno.env.get("GEMINI_API_KEY");

        if (!apiKey) {
          throw new Error("GEMINI_API_KEY is not configured.");
        }

        console.log(`[${requestId}] API key found`);

        const destination = cleanDestination(
          extractDestination(prompt, currentItinerary),
        );

        console.log(
          `[${requestId}] Destination: ${destination || "Not specified"}`,
        );

        // FETCH TOURIST SPOTS

        console.log(`[${requestId}] Fetching tourist spots`);

        let spotsQuery = ctx.supabase
          .from("tourist_spots")
          .select(
            "id, name, category, description, location, city, province, entrance_fee, opening_hours, operating_days, closed_days, estimated_visit_minutes",
          )
          .eq("is_active", true)
          .limit(MAX_RECORDS);

        if (destination) {
          spotsQuery = spotsQuery.or(
            `city.ilike.%${destination}%,province.ilike.%${destination}%`,
          );
        }

        const { data: spots, error: spotsError } = await spotsQuery;

        if (spotsError) {
          console.error(
            `[${requestId}] Tourist spots query error:`,
            spotsError,
          );

          throw new Error(
            `Failed to fetch tourist spots: ${spotsError.message}`,
          );
        }

        const availableSpots = spots ?? [];

        console.log(
          `[${requestId}] Fetched spots: ${availableSpots.length}`,
        );

        // FETCH HOTELS

        console.log(`[${requestId}] Fetching hotels`);

        let hotelsQuery = ctx.supabase
          .from("hotels")
          .select(
            "id, name, category, location, city, province, star_rating, guest_rating, price_min, price_max, amenities, nearest_spot, distance_km, check_in_time, check_out_time, nearest_spot_id",
          )
          .eq("is_active", true)
          .limit(MAX_RECORDS);

        if (destination) {
          hotelsQuery = hotelsQuery.or(
            `city.ilike.%${destination}%,province.ilike.%${destination}%`,
          );
        }

        const { data: hotels, error: hotelsError } = await hotelsQuery;

        if (hotelsError) {
          console.error(
            `[${requestId}] Hotels query error:`,
            hotelsError,
          );

          throw new Error(
            `Failed to fetch hotels: ${hotelsError.message}`,
          );
        }

        const availableHotels = hotels ?? [];

        console.log(
          `[${requestId}] Fetched hotels: ${availableHotels.length}`,
        );

        // NO MATCHING DESTINATION

        if (destination && availableSpots.length === 0) {
          return Response.json({
            is_travel_related: true,
            reply:
              `I couldn't find any active tourist spots in ${destination} in our database. Please try another destination available in our records.`,
            itinerary: null,
          });
        }

        // PREPARE CONVERSATION HISTORY

        const recentHistory = history
          .slice(-MAX_HISTORY_MESSAGES)
          .map((message: any) => ({
            role: message.role === "assistant" ? "assistant" : "user",
            content: String(
              message.content ?? message.text ?? "",
            ).slice(0, MAX_HISTORY_CHARS),
          }));

        const historyContext = recentHistory
          .map(
            (message: any) =>
              `${message.role.toUpperCase()}: ${message.content}`,
          )
          .join("\n");

        let itineraryContext = "";

        if (currentItinerary) {
          itineraryContext = JSON.stringify(currentItinerary);

          if (
            itineraryContext.length >
              MAX_ITINERARY_CONTEXT_CHARS
          ) {
            itineraryContext = itineraryContext.slice(
              0,
              MAX_ITINERARY_CONTEXT_CHARS,
            );
          }
        }

        // SYSTEM INSTRUCTION

        const systemInstruction = `
You are a Philippine Travel Itinerary Assistant.

YOUR ROLE:
Help users plan trips within the Philippines using the supplied tourist spots and hotel database.

TRAVEL-RELATED QUESTIONS:
You may answer questions about:
- Philippine destinations
- Tourist attractions
- Hotels and accommodation
- Travel schedules
- Trip duration
- Travel budgets
- Entrance fees
- Itinerary creation and modification

You may also handle follow-up requests such as:
- Make it cheaper.
- Change day 2.
- Add another destination.
- Replace the hotel.
- Make the trip shorter.
- Adjust the budget.

UNRELATED QUESTIONS:
If the user asks something unrelated to Philippine travel planning, set:
"is_travel_related": false

Reply politely that you can only assist with Philippine travel planning.

DATABASE RULES:
1. Use ONLY the tourist spots and hotels supplied in the database context.
2. Never invent tourist spot names.
3. Never invent hotel names.
4. Never invent entrance fees or hotel prices.
5. Never invent hotel amenities.
6. Use the exact database IDs for tourist spots and hotels.
7. Do not use a tourist spot that is not included in the supplied records.
8. Do not use a hotel that is not included in the supplied records.
9. Respect opening hours, operating days, and closed days.
10. If a price or schedule is unknown, use null.
11. If there are no suitable hotels, set hotel to null.
12. Never claim that a hotel or activity has been booked.
13. Do not claim that a database record exists unless it is supplied in the context.

ITINERARY RULES:
1. Create a practical itinerary based on the user's requested number of days.
2. Group nearby tourist spots when possible.
3. Avoid unrealistic travel schedules.
4. Include a time for each scheduled activity.
5. Use exact tourist spot IDs.
6. Use exact database names.
7. Use database entrance fees for tourist spot costs.
8. Do not exceed the user's budget when reasonably possible.
9. If the budget is insufficient, explain this in the reply.
10. If the user is modifying an existing itinerary, preserve its existing details unless the user requests a change.
11. Do not create an itinerary unless the user requests one.
12. For ordinary travel questions, return itinerary as null.

OUTPUT FORMAT:
Return valid JSON only.
Do not use Markdown code fences.
Do not include explanations outside the JSON object.

Your response must follow this structure:

{
  "is_travel_related": true,
  "reply": "Your response to the user",
  "itinerary": null
}

When an itinerary is requested, use this structure:

{
  "is_travel_related": true,
  "reply": "A short explanation of the itinerary",
  "itinerary": {
    "title": "Trip title",
    "destination": "Destination",
    "days": 3,
    "estimated_budget": 10000,
    "budget_currency": "PHP",
    "hotel": {
      "id": 1,
      "name": "Exact hotel name from database",
      "estimated_price_per_night": 1000
    },
    "schedule": [
      {
        "day": 1,
        "title": "Day 1 title",
        "items": [
          {
            "time": "08:00 AM",
            "type": "attraction",
            "spot_id": 1,
            "name": "Exact tourist spot name",
            "description": "Short description",
            "estimated_cost": 100
          }
        ]
      }
    ],
    "budget_breakdown": {
      "accommodation": 3000,
      "food": 2000,
      "transportation": 2000,
      "entrance_fees": 1000,
      "other": 500
    }
  }
}

IMPORTANT:
- The hotel object may be null if no suitable hotel exists.
- The itinerary may be null when no itinerary is requested.
- All IDs must come from the supplied database records.
- Use null for unknown database prices.
- estimated_budget and budget_breakdown are estimates, not confirmed expenses.
- Do not output any property outside the required structure.
`;

        // PREPARE GEMINI CONTEXT

        const conversationContext = `
CONVERSATION HISTORY:
${historyContext || "No previous conversation."}

CURRENT ITINERARY:
${itineraryContext || "No existing itinerary."}

AVAILABLE TOURIST SPOTS FROM DATABASE:
${JSON.stringify(availableSpots)}

AVAILABLE HOTELS FROM DATABASE:
${JSON.stringify(availableHotels)}

CURRENT USER MESSAGE:
${prompt}

Generate your response following the system instructions.
`;

        console.log(
          `[${requestId}] Gemini context prepared. Characters: ${conversationContext.length}`,
        );

        // CALL GEMINI WITH RETRY AND FALLBACK

        console.log(`[${requestId}] Sending request to Gemini`);

        const geminiPayload = {
          input: conversationContext,
          system_instruction: systemInstruction,
          response_format: {
            type: "text",
            mime_type: "application/json",
          },
          generation_config: {
            temperature: 0.2,
          },
        };

        const geminiResponse = await callGeminiWithRetry(
          geminiPayload,
          apiKey,
        );

        console.log(
          `[${requestId}] Gemini response received. Status: ${geminiResponse.status}`,
        );

        const aiData = await geminiResponse.json() as GeminiInteractionResponse;

        const generatedText = getGeminiText(aiData);

        console.log(
          `[${requestId}] Gemini text received. Characters: ${generatedText.length}`,
        );

        if (!generatedText) {
          throw new Error("Gemini returned an empty response.");
        }

        // PARSE GEMINI JSON

        let result: any;

        try {
          result = parseGeminiJSON(generatedText);
        } catch (error) {
          console.error(
            `[${requestId}] Gemini JSON parsing failed:`,
            error,
          );

          console.error(
            `[${requestId}] Gemini raw response:`,
            generatedText,
          );

          throw new Error(
            "Gemini returned an invalid JSON response.",
          );
        }

        if (
          typeof result !== "object" ||
          result === null ||
          typeof result.is_travel_related !== "boolean" ||
          typeof result.reply !== "string"
        ) {
          throw new Error(
            "Gemini response does not follow the required structure.",
          );
        }

        // HANDLE UNRELATED QUESTIONS

        if (!result.is_travel_related) {
          return Response.json({
            is_travel_related: false,
            reply: result.reply,
            itinerary: null,
          });
        }

        // HANDLE ORDINARY TRAVEL QUESTIONS

        if (!result.itinerary) {
          return Response.json({
            is_travel_related: true,
            reply: result.reply,
            itinerary: null,
          });
        }

        // VALIDATE ITINERARY

        const itinerary = result.itinerary;

        const validHotel = availableHotels.find(
          (hotel: ItineraryHotel) =>
            String(hotel.id) === String(itinerary.hotel?.id),
        );

        const validatedHotel = validHotel
          ? {
            id: validHotel.id,
            name: validHotel.name,
            estimated_price_per_night: getNumericValue(
              validHotel.price_min,
            ),
          }
          : null;

        const validSpotIds = new Set(
          availableSpots.map(
            (spot: ItinerarySpot) => String(spot.id),
          ),
        );

        const validatedSchedule = Array.isArray(itinerary.schedule)
          ? itinerary.schedule.map((day: any) => ({
            day: day.day,
            title: day.title,
            items: Array.isArray(day.items)
              ? day.items
                .filter((item: any) =>
                  item.spot_id !== null &&
                  item.spot_id !== undefined &&
                  validSpotIds.has(String(item.spot_id))
                )
                .map((item: any) => {
                  const databaseSpot = availableSpots.find(
                    (spot: ItinerarySpot) =>
                      String(spot.id) === String(item.spot_id),
                  );

                  // TypeScript null check
                  if (!databaseSpot) {
                    throw new Error(
                      `Tourist spot ID ${item.spot_id} was not found in the database.`,
                    );
                  }

                  return {
                    time: item.time ?? null,
                    type: item.type ?? "attraction",
                    spot_id: databaseSpot.id,
                    name: databaseSpot.name,
                    description: item.description ?? "",
                    estimated_cost: getNumericValue(
                      databaseSpot.entrance_fee,
                    ),
                  };
                })
              : [],
          }))
          : [];

        const validatedItinerary = {
          title: itinerary.title ?? "Philippine Travel Itinerary",
          destination: itinerary.destination ?? destination,
          days: itinerary.days ?? validatedSchedule.length,
          estimated_budget: getNumericValue(
            itinerary.estimated_budget,
          ),
          budget_currency: "PHP",
          hotel: validatedHotel,
          schedule: validatedSchedule,
          budget_breakdown: itinerary.budget_breakdown &&
              typeof itinerary.budget_breakdown === "object"
            ? itinerary.budget_breakdown
            : {},
        };

        console.log(
          `[${requestId}] Itinerary validated successfully`,
        );

        return Response.json({
          is_travel_related: true,
          reply: result.reply,
          itinerary: validatedItinerary,
        });
      } catch (error) {
        console.error(
          `[${requestId}] Function error:`,
          error,
        );

        const errorMessage = error instanceof Error
          ? error.message
          : String(error);

        console.error(
          `[${requestId}] Error details: ${errorMessage}`,
        );

        return Response.json(
          {
            error: "The AI service could not process your request.",
          },
          { status: 502 },
        );
      }
    },
  ),
};

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?? 'Tourist Portal · Low-Fidelity' ?></title>
    <link rel="stylesheet" href="assets/css/lowfi-shared.css">
    <?php if (isset($pageCSS)): ?>
    <link rel="stylesheet" href="<?= $pageCSS ?>">
    <?php endif; ?>
</head>
<body>
    <div class="app-shell">

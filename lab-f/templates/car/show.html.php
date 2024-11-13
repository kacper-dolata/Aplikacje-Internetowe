<?php
/** @var \App\Model\Car $car */
/** @var \App\Service\Router $router */

$title = "{$car->getCarBrand()} {$car->getModel()} ({$car->getYear()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $car->getCarBrand() . ' ' . $car->getModel() ?></h1>
    <p><strong>Year:</strong> <?= $car->getYear() ?></p>
    <article>
        <strong>Description:</strong>
        <p><?= $car->getDescription(); ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('car-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('car-edit', ['id' => $car->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

<?php
/** @var $car ?\App\Model\Car */
?>

<div class="form-group">
    <label for="carBrand">Car Brand</label>
    <input type="text" id="carBrand" name="car[carBrand]" value="<?= $car ? $car->getCarBrand() : '' ?>">
</div>

<div class="form-group">
    <label for="model">Model</label>
    <input type="text" id="model" name="car[model]" value="<?= $car ? $car->getModel() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="car[year]" value="<?= $car ? $car->getYear() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="car[description]"><?= $car ? $car->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <input type="submit" value="Submit">
</div>

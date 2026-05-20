<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{

    public array $cars = [
        ['BMW X5', 'Comfortable SUV', 5205200.00, 'SUV'],
        ['BMW X3', 'Compact premium SUV', 4224700.00, 'SUV'],
        ['Audi A4', 'German sedan', 3419600.00, 'Sedan'],
        ['Audi Q5', 'Luxury crossover', 4067000.00, 'SUV'],
        ['Toyota Camry', 'Reliable sedan', 2296000.00, 'Sedan'],
        ['Toyota RAV4', 'Popular SUV', 2280000.00, 'SUV'],
        ['Honda Civic', 'Compact car', 2519400.00, 'Sedan'],
        ['Honda CR-V', 'Family SUV', 2585700.00, 'SUV'],
        ['Mercedes C200', 'Premium sedan', 3990000.00, 'Sedan'],
        ['Mercedes GLC', 'Luxury SUV', 4748000.00, 'SUV'],
        ['Volkswagen Passat', 'Business sedan', 3240000.00, 'Sedan'],
        ['Skoda Octavia', 'Practical liftback', 2723920.00, 'Liftback'],
        ['Kia Sportage', 'Modern SUV', 2423200.00, 'SUV'],
        ['Hyundai Tucson', 'Family SUV', 2800000.00, 'SUV'],
        ['Tesla Model3', 'Electric sedan', 2935880.00, 'Sedan'],
    ];

    public string $photoUrlDefault = '/storage/cars/car.jpg';

    public string $emailDefault = 'admin@laravel-nuxt.local';

    /**
     *  php artisan db:seed --class=CarSeeder
     *  @return void
     */
    public function run(): void
    {

        foreach ($this->cars as $car) {

            $carId = DB::table('cars')->insertGetId([
                'title' => $car[0],
                'description' => $car[1],
                'price' => $car[2],
                'photo_url' => $this->photoUrlDefault,
                'contacts' => $this->emailDefault,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            [$brand, $model] = explode(' ', $car[0]) + [null, null];

            $optionsArray = [
                'car_id' => $carId,
                'brand' => $brand,
                'model' => $model,
                'year' => 2020,
                'body' => $car[3],
                'mileage' => 50000,
            ];

            DB::table('car_options')->insert($optionsArray);

        }

    }

}

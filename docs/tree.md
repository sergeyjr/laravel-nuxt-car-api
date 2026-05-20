# Project Structure

```text
laravel-nuxt/
├── backend/
│   ├── app/
│   │   ├── API/
│   │   │   └── V1/
│   │   │       ├── Controllers/
│   │   │       │   ├── ApiAuthController.php
│   │   │       │   └── ApiCarController.php
│   │   │       ├── DTO/
│   │   │       │   ├── Request/
│   │   │       │   │   ├── CarCreateRequest.php
│   │   │       │   │   ├── CarOptionRequest.php
│   │   │       │   │   ├── CarPatchRequest.php
│   │   │       │   │   ├── CarUpdateRequest.php
│   │   │       │   │   └── PaginationRequest.php
│   │   │       │   └── Response/
│   │   │       │       ├── CarListResponse.php
│   │   │       │       ├── CarOptionResponse.php
│   │   │       │       └── CarResponse.php
│   │   │       ├── Exceptions/
│   │   │       │   ├── RepositoryException.php
│   │   │       │   └── ServiceException.php
│   │   │       ├── Models/
│   │   │       │   ├── CarModel.php
│   │   │       │   └── CarOptionModel.php
│   │   │       ├── Repositories/
│   │   │       │   ├── Interfaces/
│   │   │       │   │   ├── CarOptionRepositoryInterface.php
│   │   │       │   │   └── CarRepositoryInterface.php
│   │   │       │   ├── CarOptionRepository.php
│   │   │       │   └── CarRepository.php
│   │   │       ├── Services/
│   │   │       │   └── CarService.php
│   │   │       └── Support/
│   │   │           └── CarMapper.php
│   │   ├── Enums/
│   │   │   ├── DeliveryStatus.php
│   │   │   ├── OrderStatus.php
│   │   │   └── PaymentMethod.php
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CarController.php
│   │   │   │   ├── CartController.php
│   │   │   │   ├── Controller.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── FileController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   └── SiteController.php
│   │   │   └── Middleware/
│   │   │       ├── Authenticate.php
│   │   │       ├── DebugRequest.php
│   │   │       ├── EnsureApiRole.php
│   │   │       ├── FixJsonMiddleware.php
│   │   │       ├── RedirectIfAuthenticated.php
│   │   │       └── SetLocale.php
│   │   ├── Models/
│   │   │   ├── Car.php
│   │   │   ├── Cart.php
│   │   │   ├── CartItem.php
│   │   │   ├── Contact.php
│   │   │   ├── Order.php
│   │   │   ├── OrderItem.php
│   │   │   ├── Page.php
│   │   │   └── User.php
│   │   └── Providers/
│   │       └── AppServiceProvider.php
│   ├── bootstrap/
│   │   ├── cache/
│   │   │   ├── .gitignore
│   │   │   ├── packages.php
│   │   │   └── services.php
│   │   ├── app.php
│   │   └── providers.php
│   ├── config/
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cache.php
│   │   ├── cors.php
│   │   ├── database.php
│   │   ├── filesystems.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── rate_limits.php
│   │   ├── sanctum.php
│   │   ├── services.php
│   │   └── session.php
│   ├── database/
│   │   ├── factories/
│   │   │   ├── CartFactory.php
│   │   │   ├── CartItemFactory.php
│   │   │   └── UserFactory.php
│   │   ├── migrations/
│   │   │   ├── 0001_01_01_000000_create_users_table.php
│   │   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   │   ├── 2026_03_13_212150_create_cars_table.php
│   │   │   ├── 2026_03_13_212151_create_car_options_table.php
│   │   │   ├── 2026_04_02_104814_create_contacts_table.php
│   │   │   ├── 2026_04_03_141751_create_personal_access_tokens_table.php
│   │   │   ├── 2026_04_03_150641_add_role_to_users_table.php
│   │   │   ├── 2026_04_03_172052_create_pages_table.php
│   │   │   ├── 2026_04_08_130356_add_avatar_to_users_table.php
│   │   │   ├── 2026_04_25_103714_create_carts_table.php
│   │   │   ├── 2026_04_25_103733_create_cart_items_table.php
│   │   │   ├── 2026_04_25_113902_create_orders_table.php
│   │   │   └── 2026_04_25_113940_create_order_items_table.php
│   │   ├── seeders/
│   │   │   ├── CarSeeder.php
│   │   │   ├── DatabaseSeeder.php
│   │   │   └── UserSeeder.php
│   │   ├── .gitignore
│   │   └── database.sqlite
│   ├── lang/
│   │   ├── en/
│   │   │   ├── auth.php
│   │   │   ├── pagination.php
│   │   │   ├── passwords.php
│   │   │   └── validation.php
│   │   └── ru/
│   │       ├── auth.php
│   │       ├── pagination.php
│   │       ├── passwords.php
│   │       └── validation.php
│   ├── public/
│   │   ├── index.php
│   │   ├── scan.php
│   ├── routes/
│   │   ├── api.php
│   │   ├── console.php
│   │   └── web.php
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── AuthTest.php
│   │   │   ├── CarListTest.php
│   │   │   └── CarShowTest.php
│   │   ├── CreatesApplication.php
│   │   └── TestCase.php
│   ├── .env
│   ├── artisan
│   ├── composer.json
│   └── composer.lock
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── app.css
│   │   └── images/
│   │       └── cars/
│   │           └── car.jpg
│   ├── components/
│   │   ├── modals/
│   │   │   ├── CartCheckoutModal.vue
│   │   │   ├── CartClearModal.vue
│   │   │   ├── CartRemoveItemModal.vue
│   │   │   ├── DeleteAccountModal.vue
│   │   │   ├── LoginModal.vue
│   │   │   └── LogoutConfirmModal.vue
│   │   ├── Alerts.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseCheckbox.vue
│   │   ├── BaseFileInput.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseTextarea.vue
│   │   ├── Footer.vue
│   │   ├── Navbar.vue
│   │   └── Pagination.vue
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useLogout.ts
│   │   ├── useModal.ts
│   │   ├── useOrderStatus.ts
│   │   └── useProtected.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.ts
│   │   │   └── ru.ts
│   │   └── __config.ts
│   ├── layouts/
│   │   └── default.vue
│   ├── middleware/
│   │   └── auth.global.ts
│   ├── pages/
│   │   ├── catalog/
│   │   │   ├── show/
│   │   │   │   └── [id].vue
│   │   │   └── index.vue
│   │   ├── dashboard/
│   │   │   ├── car/
│   │   │   │   └── create.vue
│   │   │   ├── index.vue
│   │   │   └── profile.vue
│   │   ├── order-success/
│   │   │   └── [id].vue
│   │   ├── orders/
│   │   │   ├── show/
│   │   │   │   └── [id].vue
│   │   │   └── index.vue
│   │   ├── page/
│   │   │   └── [code].vue
│   │   ├── cart.vue
│   │   ├── contact.vue
│   │   ├── index.vue
│   │   ├── login.vue
│   │   └── register.vue
│   ├── plugins/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── bootstrap.client.ts
│   │   └── clear-alerts.client.ts.js
│   ├── public/
│   │   ├── images/
│   │   │   ├── default-avatar.png
│   │   │   └── default_car.jpg
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── services/
│   │   └── api/
│   │       ├── auth.api.ts
│   │       ├── car.api.ts
│   │       ├── cart.api.ts
│   │       ├── contact.api.ts
│   │       ├── dashboard.api.ts
│   │       ├── order.api.ts
│   │       ├── page.api.ts
│   │       └── profile.api.ts
│   ├── stores/
│   │   ├── alert.ts
│   │   ├── auth.ts
│   │   ├── car.ts
│   │   ├── cart.ts
│   │   ├── contact.ts
│   │   ├── dashboard.ts
│   │   ├── order.ts
│   │   ├── page.ts
│   │   └── profile.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── car.ts
│   │   ├── contacts.ts
│   │   ├── dashboard.ts
│   │   ├── nuxt.d.ts
│   │   ├── order.ts
│   │   └── page.ts
│   ├── utils/
│   │   ├── debug.ts
│   │   └── formatters.ts
│   ├── .gitignore
│   ├── app.vue
│   ├── error.vue
│   ├── nuxt.config.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

e:\www\laravel\backend\
│
├── .env
├── artisan
├── composer.json
├── composer.lock
│
├── bootstrap
│   ├── app.php
│   ├── providers.php
│   └── cache
│       ├── packages.php
│       └── services.php
│
├── config
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── services.php
│   └── session.php
│
├── database
│   ├── database.sqlite
│   ├── factories
│   │   ├── CartFactory.php
│   │   ├── CartItemFactory.php
│   │   └── UserFactory.php
│   │
│   ├── migrations
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_03_13_212150_create_cars_table.php
│   │   ├── 2026_03_13_212151_create_car_options_table.php
│   │   ├── 2026_04_02_104814_create_contacts_table.php
│   │   ├── 2026_04_03_141751_create_personal_access_tokens_table.php
│   │   ├── 2026_04_03_150641_add_role_to_users_table.php
│   │   ├── 2026_04_03_172052_create_pages_table.php
│   │   ├── 2026_04_08_130356_add_avatar_to_users_table.php
│   │   ├── 2026_04_25_103714_create_carts_table.php
│   │   ├── 2026_04_25_103733_create_cart_items_table.php
│   │   ├── 2026_04_25_113902_create_orders_table.php
│   │   └── 2026_04_25_113940_create_order_items_table.php
│   │
│   └── seeders
│       ├── CarSeeder.php
│       ├── DatabaseSeeder.php
│       └── UserSeeder.php
│
├── lang
│   ├── en
│   │   ├── auth.php
│   │   ├── pagination.php
│   │   ├── passwords.php
│   │   └── validation.php
│   └── ru
│       ├── auth.php
│       ├── pagination.php
│       ├── passwords.php
│       └── validation.php
│
├── public
│   ├── index.php
│   ├── storage
│
├── routes
│   ├── api.php
│   ├── web.php
│   └── console.php
│
├── app
│   │
│   ├── Enums
│   │   ├── DeliveryStatus.php
│   │   ├── OrderStatus.php
│   │   └── PaymentMethod.php
│   │
│   ├── Http
│   │   ├── Controllers
│   │   │   ├── AuthController.php
│   │   │   ├── CarController.php
│   │   │   ├── CartController.php
│   │   │   ├── Controller.php
│   │   │   ├── DashboardController.php
│   │   │   ├── FileController.php
│   │   │   ├── OrderController.php
│   │   │   ├── ProfileController.php
│   │   │   └── SiteController.php
│   │   │
│   │   └── Middleware
│   │       ├── Authenticate.php
│   │       ├── DebugRequest.php
│   │       ├── EnsureApiRole.php
│   │       ├── FixJsonMiddleware.php
│   │       └── RedirectIfAuthenticated.php
│   │
│   ├── Models
│   │   ├── Car.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   ├── Contact.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── Page.php
│   │   └── User.php
│   │
│   ├── Providers
│   │   └── AppServiceProvider.php
│   │
│   └── API
│       └── V1
│           ├── Controllers
│           │   ├── ApiAuthController.php
│           │   └── ApiCarController.php
│           │
│           ├── DTO
│           │   ├── Request
│           │   │   ├── CarCreateRequest.php
│           │   │   ├── CarOptionRequest.php
│           │   │   ├── CarPatchRequest.php
│           │   │   ├── CarUpdateRequest.php
│           │   │   └── PaginationRequest.php
│           │   │
│           │   └── Response
│           │       ├── CarListResponse.php
│           │       ├── CarOptionResponse.php
│           │       └── CarResponse.php
│           │
│           ├── Models
│           │   ├── CarModel.php
│           │   └── CarOptionModel.php
│           │
│           ├── Repositories
│           │   ├── CarRepository.php
│           │   ├── CarOptionRepository.php
│           │   └── Interfaces
│           │       ├── CarRepositoryInterface.php
│           │       └── CarOptionRepositoryInterface.php
│           │
│           ├── Services
│           │   └── CarService.php
│           │
│           ├── Support
│           │   └── CarMapper.php
│           │
│           └── Exceptions
│               ├── RepositoryException.php
│               └── ServiceException.php
│
└── storage
└── app/public (через public/storage)

e:\www\laravel\frontend\
│
├── .gitignore
├── app.vue
├── nuxt.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
│
├── assets
│   ├── css
│   │   └── app.css
│   └── images
│       └── cars
│           └── car.jpg
│
├── components
│   ├── Alerts.vue
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── BaseTextarea.vue
│   ├── Navbar.vue
│   │
│   └── modals
│       ├── AuthModal.vue
│       └── LogoutConfirmModal.vue
│
├── composables
│   ├── useApi.ts
│   ├── useAuthActions.ts
│   └── useOrderStatus.ts
│
├── layouts
│   └── default.vue
│
├── middleware
│   └── auth.global.ts
│
├── pages
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── not-found.vue
│   ├── cart.vue
│   ├── contact.vue
│   │
│   ├── cars
│   │   ├── index.vue
│   │   └── show
│   │       └── [id].vue
│   │
│   ├── orders
│   │   ├── index.vue
│   │   └── [id].vue
│   │
│   ├── order-success
│   │   └── [id].vue
│   │
│   ├── page
│   │   └── [code].vue
│   │
│   └── dashboard
│       ├── index.vue
│       ├── car
│       │   └── create.vue
│       └── profile.vue
│
├── plugins
│   ├── api.ts
│   ├── bootstrap.client.ts
│   └── clear-alerts.client.ts.js
│
├── public
│   ├── favicon.ico
│   ├── robots.txt
│   └── images
│       ├── default_car.jpg
│       └── default-avatar.png
│
├── services
│   └── api
│       ├── external
│       │   └── v1
│       │       └── car.api.ts
│       │
│       └── internal
│           ├── auth.api.ts
│           ├── car.api.ts
│           ├── cart.api.ts
│           ├── contact.api.ts
│           ├── dashboard.api.ts
│           ├── order.api.ts
│           ├── page.api.ts
│           └── profile.api.ts
│
├── stores
│   ├── alert.ts
│   ├── auth.ts
│   ├── car.ts
│   ├── cart.ts
│   ├── contact.ts
│   ├── dashboard.ts
│   ├── order.ts
│   ├── page.ts
│   └── profile.ts
│
├── types
│   ├── api.ts
│   ├── auth.ts
│   ├── car.ts
│   ├── nuxt.d.ts
│   └── runtime.d.ts
│
└── utils
└── debug.ts

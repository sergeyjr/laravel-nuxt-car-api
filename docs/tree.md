```md
# Laravel Project Structure (Clean Architecture)

├── app
│   ├── API
│   │   └── V1
│   │       ├── Controllers
│   │       │   ├── ApiAuthController.php
│   │       │   └── ApiCarController.php
│   │       │
│   │       ├── DTO
│   │       │   ├── Request
│   │       │   │   ├── CarCreateRequest.php
│   │       │   │   ├── CarOptionRequest.php
│   │       │   │   ├── CarPatchRequest.php
│   │       │   │   ├── CarUpdateRequest.php
│   │       │   │   └── PaginationRequest.php
│   │       │   │
│   │       │   └── Response
│   │       │       ├── CarListResponse.php
│   │       │       ├── CarOptionResponse.php
│   │       │       └── CarResponse.php
│   │       │
│   │       ├── Exceptions
│   │       │   ├── RepositoryException.php
│   │       │   └── ServiceException.php
│   │       │
│   │       ├── Models
│   │       │   ├── CarModel.php
│   │       │   └── CarOptionModel.php
│   │       │
│   │       ├── Repositories
│   │       │   ├── Interfaces
│   │       │   │   ├── CarRepositoryInterface.php
│   │       │   │   └── CarOptionRepositoryInterface.php
│   │       │   │
│   │       │   ├── CarRepository.php
│   │       │   └── CarOptionRepository.php
│   │       │
│   │       ├── Services
│   │       │   └── CarService.php
│   │       │
│   │       └── Support
│   │           └── CarMapper.php
│   │
│   ├── Http
│   │   ├── Controllers
│   │   │   ├── Controller.php
│   │   │   ├── AuthController.php
│   │   │   ├── CarController.php
│   │   │   ├── CartController.php
│   │   │   ├── OrderController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── FileController.php
│   │   │   ├── ProfileController.php
│   │   │   └── SiteController.php
│   │   │
│   │   └── Middleware
│   │       ├── Authenticate.php
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
│   ├── Enums
│   │   └── OrderStatus.php
│   │
│   └── Providers
│       └── AppServiceProvider.php

├── bootstrap
│   └── app.php

├── config
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── services.php
│   └── session.php

├── database
│   ├── .gitignore
│   ├── database.sqlite
│   │
│   ├── factories
│   │   ├── UserFactory.php
│   │   ├── CartFactory.php
│   │   └── CartItemFactory.php
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
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       └── CarSeeder.php

├── lang
│   └── ru
│       ├── auth.php
│       ├── pagination.php
│       ├── passwords.php
│       └── validation.php

├── public
│   └── index.php

├── resources
│   ├── css
│   │   └── app.css
│   │
│   ├── js
│   │   ├── App.vue
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── bootstrap.js
│   │   ├── main.js
│   │   │
│   │   ├── plugins
│   │   │   └── axios.js
│   │   │
│   │   ├── components
│   │   │   ├── Alerts.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── Navbar.vue
│   │   │   └── LogoutModal.vue
│   │   │
│   │   ├── composables
│   │   │   └── useAuthActions.js
│   │   │
│   │   ├── pages
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Profile.vue
│   │   │   ├── CarsIndex.vue
│   │   │   ├── CarCreate.vue
│   │   │   ├── CarShow.vue
│   │   │   ├── Cart.vue
│   │   │   ├── Contact.vue
│   │   │   ├── Page.vue
│   │   │   ├── MyOrders.vue
│   │   │   ├── OrderDetails.vue
│   │   │   ├── OrderSuccess.vue
│   │   │   └── NotFound.vue
│   │   │
│   │   ├── router
│   │   │   └── index.js
│   │   │
│   │   └── stores
│   │       ├── alertStore.js
│   │       ├── authStore.js
│   │       ├── carFormStore.js
│   │       ├── carStore.js
│   │       ├── cartStore.js
│   │       ├── contactStore.js
│   │       ├── dashboardStore.js
│   │       ├── orderStore.js
│   │       ├── pageStore.js
│   │       └── profileStore.js
│
│   └── views
│       ├── auth
│       │   ├── login.blade.php
│       │   └── register.blade.php
│       │
│       ├── cars
│       │   ├── create.blade.php
│       │   ├── index.blade.php
│       │   └── show.blade.php
│       │
│       ├── components
│       │   ├── button.blade.php
│       │   └── card.blade.php
│       │
│       ├── dashboard
│       │   ├── index.blade.php
│       │   └── profile.blade.php
│       │
│       ├── layouts
│       │   ├── app.blade.php
│       │   └── main.blade.php
│       │
│       ├── pages
│       │   ├── home.blade.php
│       │   ├── contact.blade.php
│       │   └── page.blade.php
│       │
│       └── partials
│           ├── alerts.blade.php
│           ├── footer.blade.php
│           ├── header.blade.php
│           └── navbar.blade.php

├── routes
│   ├── api.php
│   └── web.php

├── .env
├── phpunit.xml
├── README.md
└── vite.config.js
```

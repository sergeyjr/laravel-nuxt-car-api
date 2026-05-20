# Техническое описание проекта

## Общая архитектура

Проект построен по принципу разделения frontend/backend и представляет собой SPA-приложение с REST API.

Структура разделена на два независимых приложения:

* `backend/` — API и серверная бизнес-логика;
* `frontend/` — клиентское приложение.

Архитектура ориентирована на:

* масштабируемость;
* API-first подход;
* разделение ответственности;
* возможность подключения мобильных клиентов и внешних сервисов.

---

# Backend

Backend реализован на Laravel.

## Основные технологии

* PHP
* Laravel
* Laravel Sanctum
* SQLite (в dev-конфигурации)
* REST API
* Middleware
* DTO pattern
* Repository pattern
* Service layer

---

# Архитектура backend

## API Versioning

Присутствует отдельный namespace:

```text
API/V1/
```

Это позволяет:

* поддерживать версионность API;
* безопасно изменять контракты;
* развивать мобильные и внешние интеграции.

---

## Controllers

Реализованы отдельные контроллеры:

### API

* `ApiAuthController`
* `ApiCarController`

### Web

* `AuthController`
* `CarController`
* `CartController`
* `DashboardController`
* `OrderController`
* `ProfileController`
* `SiteController`

Контроллеры разделены по бизнес-доменам.

---

## DTO Layer

Используются DTO-объекты:

```text
DTO/Request/
DTO/Response/
```

Преимущества:

* строгая структура входящих данных;
* отделение transport layer от domain layer;
* централизованная валидация;
* единые API-контракты.

Примеры:

* `CarCreateRequest`
* `CarUpdateRequest`
* `CarResponse`
* `CarListResponse`

---

## Repository Pattern

Реализован слой репозиториев:

```text
Repositories/
```

Используются:

* интерфейсы;
* конкретные реализации.

Преимущества:

* абстракция доступа к данным;
* упрощение тестирования;
* возможность замены ORM/источника данных.

---

## Service Layer

Бизнес-логика вынесена в:

```text
Services/
```

Например:

* `CarService`

Это позволяет:

* разгружать контроллеры;
* переиспользовать бизнес-логику;
* упрощать поддержку проекта.

---

## Mapper Layer

Используется:

```text
Support/CarMapper.php
```

Mapper отвечает за:

* преобразование моделей;
* подготовку API-ответов;
* изоляцию структуры БД от API.

---

# Middleware

Реализован набор middleware:

* `Authenticate`
* `EnsureApiRole`
* `FixJsonMiddleware`
* `RedirectIfAuthenticated`
* `DebugRequest`

Функциональность:

* авторизация;
* разграничение ролей;
* обработка JSON-запросов;
* защита маршрутов.

---

# Authentication & Security

## Авторизация

Используется:

* Laravel Sanctum;
* API token authentication.

Поддерживаются:

* регистрация;
* login/logout;
* защищенные маршруты;
* middleware-проверки.

---

## Роли пользователей

В таблице пользователей присутствует поле роли:

```text
add_role_to_users_table
```

Используется middleware:

```text
EnsureApiRole
```

Это говорит о наличии RBAC-подхода (Role-Based Access Control).

---

# Domain Models

Основные модели:

* `User`
* `Car`
* `CarOption`
* `Cart`
* `CartItem`
* `Order`
* `OrderItem`
* `Contact`
* `Page`

---

# E-commerce функциональность

## Корзина

Реализованы сущности:

* `Cart`
* `CartItem`

Поддерживается:

* добавление товаров;
* хранение корзины;
* работа с несколькими позициями.

---

## Заказы

Реализованы:

* `Order`
* `OrderItem`

Дополнительно используются enum:

* `OrderStatus`
* `DeliveryStatus`
* `PaymentMethod`

Это обеспечивает:

* строгую типизацию состояний;
* централизованное управление бизнес-логикой заказов.

---

# Database Layer

## Migrations

Используются миграции Laravel.

Присутствуют таблицы:

* users
* cars
* car_options
* contacts
* carts
* cart_items
* orders
* order_items
* pages

---

## Seeders

Реализованы сидеры:

* `CarSeeder`
* `UserSeeder`

Используются для:

* наполнения тестовыми данными;
* dev-окружения;
* автогенерации демо-контента.

---

# Тестирование

Присутствуют Feature tests:

* `AuthTest`
* `CarListTest`
* `CarShowTest`

Это говорит о наличии:

* базового API testing;
* проверки авторизации;
* тестирования бизнес-сценариев.

---

# Frontend

Frontend построен на:

* Nuxt
* Vue.js
* TypeScript

---

# Архитектура frontend

## Pages-based routing

Используется файловая маршрутизация Nuxt:

```text
pages/
```

Маршруты генерируются автоматически.

---

## State Management

Используются stores:

```text
stores/
```

Разделены по доменам:

* auth
* car
* cart
* dashboard
* order
* profile
* page

Подход близок к domain-driven frontend architecture.

---

## API Layer

Отдельный сервисный слой:

```text
services/api/
```

Разделен на:

* internal API;
* external API.

Преимущества:

* централизованный HTTP layer;
* переиспользуемость запросов;
* изоляция frontend от API-реализации.

---

## Composables

Используются composables:

```text
composables/
```

Например:

* `useApi`
* `useAuthActions`
* `useProtected`

Это соответствует Composition API подходу Vue/Nuxt.

---

## Middleware

Frontend middleware:

```text
auth.global.ts
```

Используется для:

* защиты страниц;
* проверки авторизации;
* route guarding.

---

## Components Architecture

Выделены:

### Base components

* `BaseButton`
* `BaseInput`
* `BaseTextarea`

### UI components

* `Navbar`
* `Pagination`
* `Alerts`

### Modal components

* `AuthModal`
* `LogoutConfirmModal`

Это говорит о наличии design-system подхода.

---

# SSR / SPA

Nuxt позволяет использовать:

* SSR;
* SPA;
* hybrid rendering.

Структура проекта ориентирована на SEO-friendly frontend.

---

# Типизация

Используется TypeScript:

```text
types/
```

Типы разделены по бизнес-доменам:

* auth
* car
* dashboard
* order
* page

---

# Работа с файлами

Присутствует:

* `FileController`
* загрузка аватаров;
* storage для автомобилей.

---

# Локализация

Реализованы языковые пакеты:

* `ru`
* `en`

Backend поддерживает мультиязычные сообщения:

* auth;
* validation;
* pagination.

---

# CI/CD readiness

Структура проекта соответствует production-ready подходу:

* разделение окружений;
* конфигурационные файлы;
* middleware;
* tests;
* API versioning;
* typed frontend;
* service abstraction.

---

# Итог

Проект представляет собой production-ready fullstack платформу с:

* Laravel API backend;
* Nuxt SPA frontend;
* сервисной архитектурой;
* DTO/repository/service pattern;
* role-based access control;
* e-commerce функциональностью;
* API versioning;
* TypeScript frontend;
* state management;
* middleware-based security;
* тестированием и подготовкой к масштабированию.

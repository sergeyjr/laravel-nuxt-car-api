# Тестовый DEMO-проект

Использованные технологии:

* Laravel 13 (backend)
* Nuxt.js 4 (frontend) + Nitro (backend)
* TypeScript
* Pinia
* Vue
* SSR/SPA

Проект написан с нуля и реализует каталог автомобилей, корзину, оформление заказов, личный кабинет пользователей и административную панель управления.

> Важно:
> Данный проект является тестовым/demo проектом и создан в образовательных целях.
> Не рекомендуется использовать проект в production без дополнительного аудита безопасности, оптимизации и доработок.

---

# Главная страница

![Главная](frontend/public/images/screenshots/laravel-index.png)

---

# Каталог автомобилей

Полноценный каталог автомобилей с карточками, изображениями, характеристиками и переходом к детальной странице автомобиля.

![Каталог](frontend/public/images/screenshots/laravel-catalog.png)

---

# Панель управления

Защищенная dashboard-зона с навигацией по пользовательским разделам.

![Dashboard](frontend/public/images/screenshots/laravel-dashboard.png)

---

# Профиль пользователя

Личный кабинет пользователя:

* редактирование профиля;
* загрузка аватара;
* смена пароля;
* управление аккаунтом.

![Профиль](frontend/public/images/screenshots/laravel-dashboard-profile.png)

---

# Заказы

История оформленных заказов пользователя.

![Заказы](frontend/public/images/screenshots/laravel-orders.png)

---

# Детальная информация о заказе

Страница просмотра конкретного заказа с товарами и общей информацией.

![Информация о заказе](frontend/public/images/screenshots/laravel-order-info.png)

---

# Контакты

Контактная форма для обратной связи.

![Контакты](frontend/public/images/screenshots/laravel-contacts.png)

---

# Корзина

Поддерживается:

* добавление товаров;
* изменение количества;
* удаление товаров;
* оформление заказа;
* модальные окна подтверждения действий.

![Корзина](frontend/public/images/screenshots/laravel-cart.png)

---

# Мультиязычность

**В проекте реализована поддержка двух языков: `ru / en`.**  
Это важная часть интерфейса: пользовательская и административная части могут отображаться на русском и английском языках.

![Dashboard EN](frontend/public/images/screenshots/laravel-dashboard-en.png)

---

# Основные возможности

## Пользовательская часть

* каталог автомобилей;
* просмотр детальной информации об автомобилях;
* поддержка характеристик и опций;
* корзина и оформление заказов;
* история заказов;
* регистрация и авторизация;
* личный кабинет пользователя;
* загрузка аватара;
* контактная форма;
* динамические контентные страницы.

---

## Административная часть

* управление автомобилями;
* создание и редактирование каталога;
* управление заказами;
* управление профилем;
* разграничение ролей пользователей;
* защищенные разделы dashboard.

---

# Технологии

## Backend

Backend построен на Laravel.

Используемые подходы:

* REST API;
* API versioning (`API/V1`);
* DTO pattern;
* Repository pattern;
* Service layer;
* middleware architecture;
* role-based access control;
* Laravel Sanctum authentication.

---

## Frontend

Frontend реализован на Nuxt 4 + Vue с использованием TypeScript.

Основные особенности:

* SPA architecture;
* Composition API;
* state management;
* middleware protection;
* reusable UI components;
* API service layer;
* мультиязычность (`ru`, `en`);
* SSR-ready структура.

---

# Архитектура проекта

```text
backend/   -> Laravel API
frontend/  -> Nuxt frontend

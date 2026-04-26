# 🍕 Fuoco — Pizzeria App

React + Vite + Supabase пиццерия с полным функционалом.

## Стек
- **React 18** + **Vite 5**
- **Framer Motion** — анимации
- **Supabase** — база данных + аутентификация
- **Zustand** — состояние корзины и авторизации
- **React Router v6** — маршрутизация
- **Lucide React** — иконки

## Запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в **SQL Editor** и выполните SQL из файла `supabase/setup.sql`
3. Скопируйте `.env.example` → `.env` и заполните данные:

```bash
cp .env.example .env
```

Откройте Supabase → Settings → API и скопируйте:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public key` → `VITE_SUPABASE_ANON_KEY`

### 3. Запуск
```bash
npm run dev
```

## Функционал

- 🏠 **Главная** — hero-секция, хиты продаж, CTA-баннер
- 🍕 **Меню** — фильтрация по категориям, поиск, сортировка
- 🛒 **Корзина** — управление товарами, оформление заказа
- 📦 **Заказы** — история заказов с деталями и статусами
- 👤 **Профиль** — личный кабинет, редактирование данных
- 🔐 **Авторизация** — вход/регистрация через Supabase Auth

## Структура БД

```
products    — товары (пиццы, пасты, напитки и т.д.)
profiles    — профили пользователей (extends auth.users)
orders      — заказы
order_items — позиции заказа
```

# Expense Tracker

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?logo=tailwindcss)
![Heroicons](https://img.shields.io/badge/Heroicons-%F0%9F%92%8E-blueviolet)
![HeroUI](https://img.shields.io/badge/HeroUI-2.8.beta-blue)
![PWA](https://img.shields.io/badge/PWA-Serwist-critical?logo=pwa)
![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel)

## Overview

**Expense Tracker** is a **Progressive Web App** built with **Next.js 15** as the final project for a **Mobile Systems** course. The project focuses on key concepts in developing mobile-friendly and offline-capable applications. As a personal challenge, the author also explored the **Next.js App** with **App Router** and related modern web tools.

> [Live App (Hosted on Vercel)](https://vercel.com/)  
> *Push notifications are protected—contact the author to test this feature.*

---

## Tech Stack

### Styling
- **Tailwind CSS v4** 
- **HeroUI**(User beta version at the time of the project) for elegant UI components
- **Heroicons** for elegant icons

### Persistence
- **MongoDB Atlas** for online data storage (Users, Transactions, Push Subscriptions)
- **IndexedDB** for offline storage support

### PWA & Offline Functionality
- Powered by **Serwist**, offering:
    - Service worker integration
    - Fetch request interception
    - Offline caching
    - Push notification handling

### Framework
- Built with **Next.js 15** using **App Router**
- Limited use of **Server Actions** for initial data loading (not optimal for offline mode)

---

## Authentication

Authentication was not a core focus of this project.  
After login user receives ID from database, which is then sent with each request.  
Push subscription endpoints are manually secured via a secret stored in `.env`.

> 🔒 **Future Improvements:**
> - Integrate proper auth (e.g., `next-auth`)
> - Graceful offline handling of authentication flows

---

## 📚 What I Learned

Throughout this project, I gained valuable experience in:

- Service workers and caching strategies
- Offline development practices
- Push notifications implementation
- Building with the **Next.js App Router**
- Modern state management and client-server interactions

---

## Run Locally

### Clone the Repo
```bash
git clone https://github.com/RadziooT/ExpenseTracker.git
cd ExpenseTracker/project
```

### Configure Environment Variables
Uncomment and fill in the required values in `.env` based on `.env.sample`:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_auth_secret
WEB_PUSH_EMAIL=your_email@example.com
NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=your_vapid_public_key
WEB_PUSH_PRIVATE_KEY=your_vapid_private_key
```

### Install & Start
```bash
npm install
npm run build
npm start
```

---

## Author

Developed by Radosław Tchórzewski  
_Reach out to try push notifications functionality._
# HabitFinPer

Aplikasi manajemen kebiasaan dan keuangan pribadi berbasis Next.js dengan autentikasi Auth0.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Auth0 via `@auth0/nextjs-auth0` v4
- **Database**: MariaDB + Prisma ORM
- **UI**: Tailwind CSS v4 + shadcn/ui (Radix UI)

---

## Prasyarat

- Node.js 18+
- MariaDB / MySQL berjalan di lokal
- Akun Auth0 (gratis di [auth0.com](https://auth0.com))

---

## Setup Auth0

### 1. Buat Aplikasi di Auth0 Dashboard

1. Buka [manage.auth0.com](https://manage.auth0.com)
2. Masuk ke **Applications → Applications → Create Application**
3. Pilih tipe **Regular Web Application**
4. Beri nama aplikasi (misal: `HabitFinPer`)

### 2. Konfigurasi URL di Auth0 Dashboard

Di halaman settings aplikasi Auth0, isi field berikut:

| Field | Nilai |
|---|---|
| Allowed Callback URLs | `http://localhost:3000/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

Klik **Save Changes**.

### 3. Salin Kredensial Auth0

Dari halaman Settings aplikasi, salin:
- **Domain** (contoh: `dev-xxxxxxxx.us.auth0.com`)
- **Client ID**
- **Client Secret**

### 4. Buat File `.env.local`

Buat file `.env.local` di root project (file ini sudah ada sebagai template):

```env
AUTH0_SECRET=          # generate dengan: openssl rand -base64 32
AUTH0_DOMAIN=          # Domain dari Auth0 dashboard
AUTH0_CLIENT_ID=       # Client ID dari Auth0 dashboard
AUTH0_CLIENT_SECRET=   # Client Secret dari Auth0 dashboard
APP_BASE_URL=http://localhost:3000
```

Untuk generate `AUTH0_SECRET`, jalankan perintah berikut di terminal:

```bash
openssl rand -base64 32
```

---

## Setup Database

### 1. Konfigurasi koneksi database

Edit file `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/habitperfin"
```

Ganti `USER` dan `PASSWORD` sesuai konfigurasi MariaDB lokal kamu.

### 2. Jalankan migrasi Prisma

```bash
npx prisma migrate dev
```

---

## Menjalankan Aplikasi

### Install dependencies

```bash
npm install
```

### Jalankan development server

```bash
npm run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).

---

## Cara Kerja Autentikasi

Auth0 SDK v4 bekerja sepenuhnya lewat **middleware** — tidak ada route handler terpisah.

### Auth Routes (otomatis tersedia)

| Route | Fungsi |
|---|---|
| `GET /auth/login` | Redirect ke halaman login Auth0 |
| `GET /auth/logout` | Logout dan hapus sesi |
| `GET /auth/callback` | Callback setelah login berhasil |
| `GET /auth/profile` | Mengembalikan data user (JSON) |

### Proteksi Halaman

Halaman `/dashboard` dilindungi di dua lapisan:

1. **Middleware** (`middleware.ts`) — redirect ke `/auth/login` jika belum login, sebelum halaman dirender
2. **Server Component** (`app/dashboard/page.tsx`) — verifikasi ulang sesi di sisi server

### Struktur File Auth

```
lib/
  auth0.ts              # Auth0Client singleton
middleware.ts           # Handles auth routes + proteksi halaman
app/
  layout.tsx            # Wrap dengan <Auth0Provider> untuk client hooks
  dashboard/
    page.tsx            # Protected page (server-side session check)
```

### Mengakses Data User

**Di Server Component:**

```tsx
import { auth0 } from "@/lib/auth0";

export default async function Page() {
  const session = await auth0.getSession();
  const user = session?.user;

  return <p>Halo, {user?.name}</p>;
}
```

**Di Client Component (menggunakan hook):**

```tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;
  return <p>Halo, {user?.name}</p>;
}
```

### Tombol Login / Logout

```tsx
// Login
<a href="/auth/login">Login</a>

// Logout
<a href="/auth/logout">Logout</a>
```

---

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint |
| `npx prisma studio` | Buka Prisma Studio (GUI database) |
| `npx prisma migrate dev` | Jalankan migrasi database |

# 🧠 AI Habit Tracker

An intelligent habit tracking web app powered by **Next.js 15**, **Prisma**, **Supabase**, **NextAuth**, and **OpenAI**.  
Users can sign up, log in, and track their daily habits — with AI insights to help them stay consistent and motivated.

---

## 🚀 Features

✅ **Multi-user authentication** (via Credentials or Google using NextAuth)  
✅ **Secure database** powered by **Supabase (PostgreSQL)**  
✅ **AI habit suggestions** using the **OpenAI API**  
✅ **Modern UI** built with **Next.js App Router (TypeScript + TailwindCSS)**  
✅ **Data access with Prisma ORM**  
✅ **Deployed on Vercel**

---

## 🗂️ Project Structure




ai-habit-tracker/
│
├── frontend/ # Next.js 15 app
│ ├── app/
│ │ ├── api/
│ │ │ └── auth/
│ │ │ └── [...nextauth]/route.ts # NextAuth route
│ │ └── page.tsx # Main UI pages
│ ├── prisma/
│ │ └── schema.prisma # Prisma schema for Supabase DB
│ ├── scripts/
│ │ └── hashPasswords.js # Helper to hash user passwords
│ ├── .env.local # Frontend environment variables
│ └── package.json
│
├── backend/ # Optional backend setup (if separated)
│ ├── prisma/
│ │ └── schema.prisma
│ ├── .env
│ └── package.json
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/QuisTech/ai-habit-tracker-new.git
cd ai-habit-tracker-main/frontend

2️⃣ Install dependencies
npm install

3️⃣ Set up your .env.local

Create a .env.local file inside the frontend/ folder with the following:

OPENAI_API_KEY=your_openai_api_key

DATABASE_URL="postgresql://postgres.yourid:yourpassword@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"

JWT_SECRET=supersecretkey

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


💡 When deploying to Vercel, set the same environment variables under
Project → Settings → Environment Variables

4️⃣ Generate the Prisma client

Run this inside the frontend/ folder:

npx prisma generate


If you haven’t yet applied your Supabase schema, open Supabase SQL Editor and paste this:

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    frequency varchar(50),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT habits_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

5️⃣ Run the app
npm run dev


The app should now be running on
👉 http://localhost:3000

🧩 Authentication Flow

Users can log in using email/password or Google OAuth

Passwords are securely hashed using bcrypt

Auth sessions are handled using NextAuth (JWT strategy)

🧠 AI Habit Suggestions

The AI habit assistant uses OpenAI GPT models to:

Recommend new habits

Help users stay consistent

Generate motivational insights

To use this feature, ensure your OPENAI_API_KEY is set correctly.

🧰 Scripts
Hash Passwords (for testing)

You can generate hashed passwords manually:

cd frontend/scripts
node hashPasswords.js

🗄️ Database Management

View and edit your Supabase database directly via:

👉 https://supabase.com/dashboard

Or open Prisma Studio locally:

npx prisma studio

🌐 Deployment

The frontend is designed to deploy easily on Vercel:

Push your code to GitHub

Connect your repo on Vercel.com

Add your environment variables

Deploy 🎉

👨‍💻 Tech Stack
Tool	Purpose
Next.js 15 (App Router)	Frontend framework
TypeScript	Type-safe development
TailwindCSS	Styling
Prisma ORM	Database access
Supabase (PostgreSQL)	Cloud database
NextAuth.js	Authentication
OpenAI API	AI assistant
Vercel	Hosting and deployment
💡 Future Enhancements

AI-driven habit insights and analytics

Streak visualization charts

Smart reminders and notifications

Mobile-first progressive web app (PWA)

🧑‍💻 Author

Developed by: QuisTech

🪪 License

This project is licensed under the MIT License — free for personal and commercial use.

“Small daily habits lead to big life changes.” 🌱

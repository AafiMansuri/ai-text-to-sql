### Introduction
"AI-based Text-to-SQL" is an AI-powered conversational interface that allows users to query structured databases using natural language. Built with a modern tech stack including FastAPI, PostgreSQL, Next.js, and Tailwind CSS, the system leverages a custom LLM (Base Model: Gemma-2 27B via Ollama) to translate user queries into SQL. Clerk handles secure authentication, and role-based access allows admins to manage users and databases. "AI-based Text-to-SQL" simplifies data exploration by making database interaction as intuitive as chatting.

### Environment Variables Setup

To run this project locally, you’ll need to configure environment variables for both the frontend and backend. Below are the required variables and a brief description of each.

---

#### 📁 `frontend/.env.local`

Create a `.env.local` file in the `frontend/` directory with the following keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WEBHOOK_SECRET=
```

These variables are used to configure Clerk authentication, API routing, and webhook verification on the frontend.

---

#### 📁 `backend/.env`

Create a `.env` file in the `backend/` directory with the following keys:

```env
NEON_DB_URL=
DB_URL_USER=
DB_URL_ADMIN=
OLLAMA_MODEL=
CLERK_SECRET_KEY=
CLERK_API_URL=
```

- `NEON_DB_URL`: PostgreSQL connection string for storing and retrieving application data (e.g., users, chats, messages).
- `DB_URL_USER` and `DB_URL_ADMIN`: Role-based connection strings for user-level and admin-level DB access.
- `OLLAMA_MODEL`: The name of the custom LLM model used for natural language to SQL translation via Ollama.
- Clerk-related keys configure secure user management and backend API access.

---
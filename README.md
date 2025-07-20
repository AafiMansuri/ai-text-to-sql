# AI-Driven Text-to-SQL Query Assistant

## 📌 Project Overview

This project is a full-stack AI-powered application that allows users to query databases using natural language. It converts plain English questions into SQL queries via an LLM, executes them on a dynamically selected database, and returns results in an intuitive chat interface.

> ⚠️ **Note:** This application is designed to work with a **single consolidated view** of your database schema. Instead of providing DDLs for individual tables, you should create and supply the **DDL for a combined view** representing the schema you wish to query. This ensures optimal performance and accuracy when generating queries via LLM.


## 🚀 Features

* ✅ **Text-to-SQL Querying**: Ask questions in natural language and get accurate SQL query results.
* ✅ **Multi-Database Support**: Dynamically select databases/views during your session.
* ✅ **Admin Panel**: Add new databases or views via a simple frontend interface.
* ✅ **Role-Based Authentication**: Secure login with Clerk authentication.
* ✅ **Chat History**: Stores your query sessions and responses.
* ✅ **Local LLM Integration**: Uses Ollama LLM running locally to process queries without relying on external APIs.
* ✅ **Sample Database Included**: Comes with a prebuilt `studentdb_dump.sql` for testing.
* ✅ **Easily Configurable**: Swap out LLM, databases, or authentication by editing environment files.

## 📷 Preview (Screenshots)

**Login Page:**

<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/987018af-682a-467b-a4c3-38fb431e0831" />

---

**Chat Interface:**

<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/52f11fa9-ca32-454b-a983-0ca6e1bddd38" />

---

**Database Integration Popup (Admin Only):**

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c8d02525-a14c-4c6c-a558-464ca7580a56" />

---

**Query Interaction & Response Rendering:**

<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/1b1db77c-65fd-4114-a067-19711f6c2eef" />

---

**Admin User Management Panel:**

<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/4db3190e-595e-4b73-8031-ee6389adeeff" />




## 📂 Folder Structure (High-Level Overview)

```
root/
│
├── backend/            # FastAPI server for API endpoints and backend logic
├── frontend/           # Next.js frontend for chat interface and admin dashboard
├── ollama/             # Ollama Modelfile for local LLM setup
├── sample-database/    # SQL dump file for example database
└── README.md           # Main project documentation and setup guide
```

## Setup Prerequisites

Before running this project, ensure you have the following installed on your system:

### ✅ General Requirements

* **Git** – for cloning the repository.
* **Python 3.10+** – for the backend (FastAPI).
* **Node.js (v18+) & npm** – for the frontend (Next.js).
* **PostgreSQL** – to host your app-related data and optionally load the provided sample database.
* **Ollama** – for running the local LLM model.

### ✅ Backend Dependencies

* Python dependencies installed via:

  ```bash
  cd backend
  pip install -r requirements.txt
  ```

### ✅ Frontend Dependencies

* Node.js dependencies installed via:

  ```bash
  cd frontend
  npm install
  ```

### ✅ Clerk for Authentication System

* **Clerk** – used for user authentication. You will need to create a Clerk account (free tier available) to configure the authentication keys (setup steps are provided below).


## 🚀 Installation & Setup Instructions

Follow these steps to set up and run the project on your local machine.

### 1. Clone the Repository

```bash
git clone <repo-link>
cd <repo-name>
```

---

### 2. Backend Setup

From the project root directory:

* Navigate to backend folder
* Create and activate a Python virtual environment
* Install project dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Frontend Setup

From the project root directory:

* Navigate to frontend folder
* Install Node.js dependencies

```bash
cd frontend
npm install
```

---

### 4. Running the Project

Once both backend and frontend are set up, you can start the development servers:

* Start backend server:

  ```bash
  cd backend
  fastapi dev src
  ```

* Start frontend server (in a new terminal):

  ```bash
  cd frontend
  npm run dev
  ```

> ✅ If both servers are running correctly, you should see the backend API on `http://127.0.0.1:8000` and the frontend on `http://localhost:3000`.

---

## 🔐 Setting Up Clerk Authentication (Required)

This project uses Clerk for authentication. You must set up your own Clerk account and API keys:

### Step 1: Create Clerk Account & Project

* Go to [Clerk Dashboard](https://dashboard.clerk.com) and create a free account.
* Create a new project.

### Step 2: Configure Authentication Settings

* In your Clerk project dashboard, navigate to **User & Authentication → Email**.
* Under **Sign Up Settings**, disable all options except **Email Address**.
* Save changes.

### Step 3: Setup Webhook (For Admin User Invite Feature)

* Navigate to **Webhooks** tab and click **+ Add Endpoint**.
* Use a tunneling URL (like **ngrok**) for **Endpoint URL**:

  ```
  https://<your-ngrok-url>/register
  ```
* Under **Subscribed Events**, tick only `user.created`.
* Click **Create Endpoint**.
  <img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/68f861a1-3654-4f90-99b3-ad0f4d508448" />


> 💡 Tip: To start ngrok for frontend, you can use:
>
> ```bash
> ngrok http 3000
> ```

### Step 4: Create Admin User (Manually)

Since your local database will be empty, you need to manually create an admin user:

* Go to **Users → + Create User**.
* Fill in a valid email and create the user.
* Once created, click **Edit Metadata → Public Metadata** and add:

  ```json
  {
    "role": "Admin",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

This ensures you can log in and access the full app as an admin immediately.


## 🗝️ Environment Variables Setup

Both the frontend and backend use environment variables for sensitive credentials and configuration. Example files are provided, which you should duplicate and modify with your own values.

---

### Backend (.env)

In the `/backend` directory, create a `.env` file by copying the provided example:

```bash
cp .env.example .env
```

Example `.env.example`:

```ini
MAIN_DATABASE_URL=postgresql+asyncpg://<username>:<password>@localhost:5432/<db_name>
CLERK_SECRET_KEY=<your_clerk_secret_key>
CLERK_API_URL=https://api.clerk.com/v1
```

* `MAIN_DATABASE_URL`: Your PostgreSQL database connection URL (update username, password, db name).
* `CLERK_SECRET_KEY`: Found in Clerk Dashboard → API Keys → Backend API Keys.
* `CLERK_API_URL`: Keep as default unless your Clerk endpoint differs.

---

### Frontend (.env.local)

In the `/frontend` directory, create a `.env.local` file by copying the example:

```bash
cp .env.local.example .env.local
```

Example `.env.local.example`:

```ini
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/chat
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/chat
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_WEBHOOK_SECRET=<your_webhook_secret>
```

* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Found in Clerk Dashboard → API Keys → Frontend API Keys.
* `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL, defaults to local FastAPI server.
* `NEXT_PUBLIC_WEBHOOK_SECRET`: Found under Clerk → Webhooks → Endpoint → Secret Key (copy this after creating the webhook).
* Other Clerk-related URLs are preconfigured for routing within the app and typically don't need modification.

---

✅ Once configured, your environment variables will securely connect your app to your Clerk account, local database, and backend API.

## 🧠 Ollama Model Setup

This project uses a custom Ollama model to power natural language querying. To set it up, follow the instructions below.

### ✅ Steps to Create Ollama Model

1. **Ensure Ollama is Installed**
   If you haven’t installed Ollama, you can follow the official instructions here: [https://ollama.com/download](https://ollama.com/download).

2. **Navigate to the Project Directory**
   Go to the root directory of this project where the provided `Modelfile` is located (inside the `ollama/` folder).

3. **Create the Ollama Model**
   Open your terminal and run the following command to create the model:

   ```bash
   ollama create askdb-gemma2 -f ollama/Modelfile
   ```

   This will create a custom model named `askdb-gemma2` using the instructions provided in the `Modelfile`.

---

### 📌 Notes

* The model must be named **askdb-gemma2** because the backend is pre-configured to use this name.
* Depending on your machine and model size, the build process may take a few minutes.
* You only need to build this model once unless you modify the `Modelfile`.

---

After this, your Ollama setup will be ready to serve requests from the backend.

Great — here’s the final set of remaining README sections to complete the guide, including database setup, running the app, and a concise usage walkthrough.

---

## 🗃️ Sample Database Setup (Optional)

A sample PostgreSQL database (`studentdb`) is provided to help users test the application quickly without needing their own dataset.

### 🔧 Setup Instructions

1. **Ensure PostgreSQL is installed** and running on your system.
2. **Restore the sample database** using the provided SQL dump:

```bash
createdb studentdb
psql -U <your_db_username> -d studentdb -f backend/src/data/studentdb_dump.sql
```

> Replace `<your_db_username>` with your local PostgreSQL username.

---

## 🚀 Running the Application

Once the environment variables, Clerk, and Ollama model are set up, you can start both the backend and frontend.

### 🖥️ Start Backend

In a separate terminal:

```bash
cd backend
fastapi dev src
```

### 🌐 Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

If everything is set up correctly, the app should be live at `http://localhost:3000`.

---

## 💡 How to Use the App

1. **Sign in as Admin**
   Log in using the email address you manually registered via Clerk (with role set to "Admin" in metadata).

2. **Add a Database View (Admin Only - Sidebar Option)**

   * After logging in as Admin, you'll see an **"Add View"** option in the sidebar.
   * Click on it and fill in:

     * **Database Name**
     * **View Name**
     * **DDL of the View** *(Tip: Use a consolidated view of your schema, not individual table DDLs)*
     * **Database URL**

3. **Ask Questions**
   Use the chat interface to ask questions about the selected database in natural language. The backend will generate SQL using your custom model and return results.

4. **View Results**
   Query results are shown in a clean, tabular format below your chat messages.


# AI-Driven Text-to-SQL Query Assistant

## 📌 Project Overview

This project is a full-stack AI-powered application that allows users to query databases using natural language. It converts plain English questions into SQL queries via an LLM, executes them on a dynamically selected database, and returns results in an intuitive chat interface. It’s designed for ease of use, extensibility, and quick deployment for personal or portfolio demos.

## 🚀 Features

* ✅ **Text-to-SQL Querying**: Ask questions in natural language and get accurate SQL query results.
* ✅ **Multi-Database Support**: Dynamically select databases/views during your session.
* ✅ **Admin Panel**: Add new databases or views via a simple frontend interface.
* ✅ **Role-Based Authentication**: Secure login with Clerk authentication.
* ✅ **Chat History**: Stores your query sessions and responses.
* ✅ **Local LLM Integration**: Uses Ollama LLM running locally to process queries without relying on external APIs.
* ✅ **Sample Database Included**: Comes with a prebuilt `studentdb_dump.sql` for testing.
* ✅ **Easily Configurable**: Swap out LLM, databases, or authentication by editing environment files.

## 📂 Folder Structure (High-Level Overview)

```
root/
│
├── backend/            # FastAPI server for API endpoints and backend logic
├── frontend/           # Next.js frontend for chat interface and admin dashboard
├── ollama/             # Ollama Modelfile for local LLM setup
├── sample-database/    # SQL dump file(s) for example databases
└── README.md           # Main project documentation and setup guide
```

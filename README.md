## Firmer Intern Quest Logs System
A full-stack application for visualize API logs, built with MERN stack.

### Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: ExpressJS
- **Database**: MongoDB

---

### **Prerequisites**
- Node.js: Version 22.x
- npm: Version 10.x or higher

### **Local Setup Instructions**

**1. Clone the repository**
```
git clone https://github.com/KwnxpN/FirmerInternQuest
cd FirmerInternQuest
// or open FirmerInternQuest project folder in your IDE
```
**2. Environment Configuration (.env)**
You must set up the environment variables for both the client and the server:

- Backend: Go to ./backend, create a .env file, and add the Backend Configuration .env.

- Frontend: Go to ./frontend, create a .env file, and add the Frontend Configuration .env.

**3. Run the Backend**
```
cd ./backend
npm install
npm run dev
```
**4. Run the Frontend (New Terminal)**
```
cd ./frontend
npm install
npm run dev
```

**5. Open the Application**
Navigate to: http://localhost:5173

---

### 🌐 **Deployment Links**
The project is live and can be accessed at the following URLs:

- Frontend: https://firmer-intern-quest-logs.vercel.app/

- Backend (API): https://firmer-intern-quest-logs-server.vercel.app/

---

## Project Structure

```text
├── backend/
│   ├── config/             # Configuration files (Database, etc.)
│   ├── controllers/        # Logic for handling requests
│   ├── middlewares/        # Custom middleware functions
│   ├── models/             # Database schemas
│   ├── routes/             # API route definitions
│   ├── package-lock.json   # Locked dependency versions
│   ├── package.json        # Project metadata and scripts
│   └── server.js           # Main entry point for the backend
│
├── frontend/
│   ├── public/             # Static assets (images, icons, etc.)
│   ├── src/                # Frontend source code (React/Vite)
│   ├── components.json     # Component configuration (e.g., shadcn/ui)
│   ├── package-lock.json   # Locked dependency versions
│   ├── package.json        # Project metadata and scripts
│   ├── vercel.json         # Deployment configuration for Vercel
│   └── vite.config.ts      # Vite configuration
│
└── README.md               # Main project documentation
```
---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | User Login |
| **POST** | `/api/auth/logout` | User Logout |
| **GET** | `/api/auth/me` | Retrieve current user data for the authenticated user |
| **GET** | `/api/logs` | Get all Logs data (Supports pagination and filtering queries) |
| **GET** | `/api/users` | Retrieve all active users (Excludes records where `isDel: true`)  |

---

## "I would like to submit my internship assignment for review on the `main` branch."

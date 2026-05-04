# Ethara - Team Task Manager

Ethara is a full-stack Team Task Management Web Application designed to help teams collaborate, organize projects, and track tasks effectively. It features role-based access control, real-time status updates, and dynamic dashboards.

## Features

- **User Authentication:** Secure JWT-based signup and login.
- **Project Management:** Create projects, add/remove team members, and manage your workspace. The creator automatically becomes the Admin of the project.
- **Task Management:** Create, assign, and track tasks (To Do, In Progress, Done) with priorities and due dates.
- **Role-Based Access:** 
  - **Admins:** Can manage all aspects of the project, including adding/removing members and assigning tasks.
  - **Members:** Can view projects they are assigned to, and update the status of their assigned tasks.
- **Dashboard:** Visualize task distribution, total tasks, tasks by status, overdue tasks, and tasks per team member.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd ethara-project
```

### 2. Install dependencies
From the root directory, run:
```bash
npm install
```
This will automatically install dependencies for both the `backend` and `frontend` folders.

### 3. Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=7001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

### 4. Run the Application locally
To run both the backend and frontend in development mode, open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment to Railway

This project is configured as a monorepo, optimized for a single-service deployment on Railway.

1. **Push to GitHub:** Ensure all your code is pushed to your GitHub repository.
2. **Create Railway Project:** Go to [Railway.app](https://railway.app/), click "New Project", and select "Deploy from GitHub repo".
3. **Select Repository:** Choose your `ethara-project` repository.
4. **Environment Variables:** Before the first deployment finishes, go to the "Variables" tab in your Railway service and add:
   - `MONGODB_URI` (your live MongoDB Atlas URL)
   - `JWT_SECRET` (your secret key)
   - `NODE_ENV` = `production`
5. **Deploy:** Railway will automatically use the root `package.json` to install dependencies, build the React frontend, and start the Node server. The Node server is configured to serve the React static files in production.
6. **Generate Domain:** Go to the "Settings" tab in Railway and click "Generate Domain" to get your public, live URL!

## Demo Video
*(Add your YouTube/Loom link here!)*

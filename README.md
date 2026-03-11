# AI-Based Anomaly Detection Platform

A full-stack web platform built to detect anomalies in user data, transactions, or logs using AI/ML (Isolation Forest). The platform features a React frontend dashboard, Node.js backend, and a Python Flask microservice for Machine Learning processing.

## Features

- **Authentication System:** JWT-based user login, signup, and Role-Based Access Control (Admin/User).
- **Dashboard:** Modern, glassmorphism UI with Dark Mode. Features data visualization using Chart.js.
- **Dataset Upload:** Easily upload CSV/JSON files for instant anomaly processing.
- **AI Anomaly Detection:** Python service utilizing Scikit-Learn's Isolation Forest to detect irregular patterns in data points.
- **Admin Panel:** Comprehensive admin interface to view users, view detailed system logs, and block/delete malicious accounts.
- **Vercel Ready:** Contains `vercel.json` configurations for simple deployment.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Chart.js, React Router, Lucide-React
- **Backend:** Node.js, Express.js, Mongoose (MongoDB), JWT Auth, Multer (File parsing)
- **ML Service:** Python, Flask, Pandas, Scikit-Learn, NumPy

## Folder Structure

```
/frontend    - React Application
/backend     - Node API (Express)
/ml-service  - Python AI Engine
```

## Running Locally

### 1. Start the ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install Flask flask-cors scikit-learn pandas numpy
python app.py
```
*Runs on port 5001*

### 2. Start the Backend
```bash
cd backend
npm install
```
Create a `.env` in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-anomaly-platform
JWT_SECRET=super_secret_jwt_key_123
ML_SERVICE_URL=http://127.0.0.1:5001
```
```bash
npm start
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be accessible at `http://localhost:5173`. 
Note: Ensure you update `backendUrl` in `frontend/src/context/AuthContext.jsx` if you are deploying to the cloud.

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to GitHub and Vercel.

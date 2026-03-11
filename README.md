# AI-Based Anomaly Detection Platform

A full-stack web platform built to detect anomalies in user data, transactions, or logs using AI/ML (Isolation Forest). The platform features a React frontend dashboard, Node.js backend, and a Python Flask microservice for Machine Learning computations.

## 🚀 Features
- **Frontend**: React, Vite, Tailwind CSS, Chart.js for data visualization.
- **Backend API**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **ML Engine**: Python, Flask, Pandas, Scikit-learn (Isolation Forest Algorithm).
- **Core Capabilities**:
  - User and Admin JSON Web Token (JWT) Authentication
  - CSV Dataset Uploads for instantaneous Machine Learning analysis
  - Graphical Visualization of detected Anomaly outliers
  - Dedicated Admin Panel to monitor user activity logs and manage accounts

---

## 💻 Tech Stack Setup & Installation

### Prerequisites
Before running the system, make sure you have:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.9+)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas/database) for the database.

### 1. Database Configuration
1. Open `backend/.env`
2. Set your MongoDB connection string (Make sure to save the file!):
   `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-anomaly-platform?retryWrites=true&w=majority`
3. Optional: Change `JWT_SECRET` to a secure random string.

### 2. Install Dependencies
You must install the libraries for all three microservices. Run these commands from the root directory:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**ML-Service:**
```bash
cd ml-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

---

## 🏃‍♂️ How to Run the Application
The platform requires all 3 services running simultaneously in different terminal windows.

**Terminal 1 (Backend API - Port 5000):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend UI - Port 5173):**
```bash
cd frontend
npm run dev
```

**Terminal 3 (Python ML Service - Port 5001):**
```bash
cd ml-service
.\venv\Scripts\activate
python app.py
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Testing the ML Anomaly Detection

I have included two sample CSV files in the root folder of this project for you to test out the Machine Learning detection algorithms! 

### Sample Files
1. **`sample_normal_data.csv`**: Contains standard, uniform numerical data (ex: normal transaction amounts). The model should return **0 anomalies** detected.
2. **`sample_anomaly_data.csv`**: Contains the same data but with two massive outliers injected (Transactions for $9,500 and $12,500 with near 0 elapsed time). The machine learning model should immediately flag these rows as **Anomalies**.

### Testing Steps
1. Make sure all three servers (Frontend, Backend, ML) are running.
2. Visit `http://localhost:5173` and **Sign Up** for an account.
3. Log in to the application.
4. On the Dashboard, locate the **Upload Dataset** button.
5. Provide a dataset name (e.g., "Normal Test") and select the `sample_normal_data.csv` file from your project folder. Click Upload.
6. Observe the Chart.js visualizer populating the graph showing uniform data.
7. Repeat the process but upload `sample_anomaly_data.csv`.
8. Watch the dashboard highlight the 2 major anomalies clearly identified by the Python backend's Isolation Forest algorithm!

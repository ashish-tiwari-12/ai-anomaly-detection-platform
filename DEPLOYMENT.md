# Deploying AI Anomaly Detection Platform to Vercel and GitHub

This guide covers deploying the frontend and backend to Vercel directly from GitHub.

## 1. Push to GitHub

1. Initialize Git in the root directory (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub and link your local repo:
   ```bash
   git remote add origin https://github.com/yourusername/ai-anomaly-platform.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy Backend to Vercel

1. Go to [Vercel](https://vercel.com/) and log in with GitHub.
2. Click **Add New -> Project**.
3. Import your `ai-anomaly-platform` repository.
4. **Configure Project**:
   - Give it a name (e.g., `ai-anomaly-backend`)
   - **Root Directory**: Select the `backend` folder!
   - **Framework Preset**: Vercel should auto-detect "Node.js" based on `vercel.json` and `package.json`.
5. **Environment Variables**: Add your backend env vars here:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret phrase
   - `ML_SERVICE_URL` = (If hosting ML service on Render/Railway, paste that URL here. For now, leave empty or put dummy if running local ML)
6. Click **Deploy**.
7. Once finished, copy the backend deployed URL (e.g., `https://ai-anomaly-backend.vercel.app`).

## 3. Deploy Frontend to Vercel

1. Add a new Project in Vercel.
2. Import the *same* `ai-anomaly-platform` repository.
3. **Configure Project**:
   - Give it a name (e.g., `ai-anomaly-frontend`)
   - **Root Directory**: Select the `frontend` folder!
   - **Framework Preset**: Vite
4. **Important Step** before deploying:
   In your Vite/React code (`frontend/src/context/AuthContext.jsx` and `Dashboard.jsx`), update the `backendUrl` variable from `http://localhost:5000/api` to your new deployed Vercel Backend URL (from Step 2).
5. Click **Deploy**.

## Note on the ML Service (Python Flask)
Vercel's serverless functions are meant for lightweight scripts. Running Scikit-Learn (Isolation Forest) models on Vercel is often problematic due to size limits. 
**Recommendation**: For the `ml-service` folder, deploy it on **Render.com** or **Railway.app** which natively supports rich Python environments. Then, update the `ML_SERVICE_URL` in your Vercel Backend settings to point to your new Render/Railway URL.

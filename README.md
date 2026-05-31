# FactLens
A machine learning powered fake news detection web app that analyzes news articles and statements, returning a **Real / Fake** prediction with a confidence score.

---

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

---

## Features

* **Real / Fake Prediction:** Paste any news article or statement and get an instant ML-powered verdict.
* **Confidence Score:** Each prediction includes a percentage confidence with an animated progress bar.
* **Unknown Detection:** Flags text that contains no recognizable vocabulary from the training data.
* **Session History:** Keeps a table of recent analyses within the current session.
* **Color-Coded Results:** Green for Real, Red for Fake, Yellow for Unknown.

---

## Installation & Setup

### Prerequisites

* Node.js (v18 or higher)
* Python 3.9+
* pip

### 1. Clone the Repository

```bash
git clone https://github.com/hassaannn09/FactLens.git
cd FactLens
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

*(Backend runs on `http://127.0.0.1:8000` by default)*

> The ML model is stored as a compressed `.joblib.gz` file and **auto-unzips on first run** — no manual steps needed.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

*(Frontend runs on `http://localhost:5173` by default)*

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/predict` | Predict Real/Fake for given text |

**Request Body:**
```json
{
  "text": "Your news article or statement here"
}
```

**Response:**
```json
{
  "label": "Real",
  "confidence": 0.94
}
```

---

## Deployment (Free)

### Frontend: Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → select `FactLens`
3. Set **Root Directory** to `frontend`
4. Click **Deploy**

After deploy, add your Vercel URL to `backend/main.py` in `allow_origins`:

```python
allow_origins=[
    "http://localhost:5173",
    "https://your-app.vercel.app",  # add this
]
```

### Backend: Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service** → select `FactLens`
3. Configure:
   * **Root Directory:** `backend`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Click **Deploy**

After deploy, update `API_URL` in `frontend/src/FakeNewsDetector.jsx`:

```js
const API_URL = "https://your-render-backend.onrender.com/predict";
```

---

## Project Structure

```text
FactLens/
├── backend/
│   ├── main.py                      # FastAPI app with /predict endpoint
│   ├── models/
│   │   └── RandomForest.joblib.gz   # Compressed ML model (auto-unzips on startup)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── FakeNewsDetector.jsx      # Main UI component
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

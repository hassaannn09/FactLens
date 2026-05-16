import os
import gzip
import shutil
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Unzip model if needed ──────────────────────────────────
MODEL_PATH = "models/RandomForest.joblib"
MODEL_GZ   = "models/RandomForest.joblib.gz"

if not os.path.exists(MODEL_PATH) and os.path.exists(MODEL_GZ):
    print("Unzipping model...")
    with gzip.open(MODEL_GZ, "rb") as f_in:
        with open(MODEL_PATH, "wb") as f_out:
            shutil.copyfileobj(f_in, f_out)
    print("Model ready.")

# ── Load model ─────────────────────────────────────────────
model = joblib.load(MODEL_PATH)  # Pipeline(tfidf -> clf)

# ── App ────────────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # add your Vercel URL here after deployment:
        # "https://your-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────
class NewsItem(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "API running"}

@app.post("/predict")
def predict(news: NewsItem):
    text = (news.text or "").strip()
    if not text:
        return {"label": "Unknown", "confidence": 0.0}

    # Guard: no known words -> Unknown
    tfidf = model.named_steps.get("tfidf")
    if tfidf is not None:
        X = tfidf.transform([text])
        if X.nnz == 0:
            return {
                "label": "Unknown",
                "confidence": 0.0,
                "note": "No known vocabulary words",
            }

    pred = int(model.predict([text])[0])  # 1=Real, 0=Fake
    label = "Real" if pred == 1 else "Fake"

    confidence = 1.0
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([text])[0]
        classes = model.classes_.tolist()
        if pred in classes:
            confidence = float(probs[classes.index(pred)])

    return {"label": label, "confidence": confidence}
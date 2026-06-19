# LinkedIn Ghost Writer — Boilerplate

Minimal, working end-to-end boilerplate: type a topic, pick a tone, generate a LinkedIn post via GPT-4o.

---

## Prerequisites

- Node.js 18+
- Python 3.11+
- An OpenAI API key (entered in the UI — never stored)

---

## 1. Run the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**

---

## 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## 3. Using the App

1. Open **http://localhost:3000** in your browser
2. Paste your OpenAI API key into the API key field (it lives in React state only — never persisted or logged)
3. Select a tone pill
4. Type your post topic or brief
5. Click **Generate Post**
6. Edit the result in-place, then click **Copy to Clipboard**

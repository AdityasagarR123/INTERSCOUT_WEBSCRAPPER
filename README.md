# ⚡ InterScout — Hacker News Virality Intelligence

### **From first signal to future reach.**

InterScout is a full-stack **Hacker News intelligence and virality analysis platform** that combines machine learning, temporal feature engineering, NLP, historical data, and real-time monitoring to understand **why some stories take off while others disappear.**

Instead of looking at a post only after it becomes popular, InterScout focuses on the **early moments of a story's lifecycle**.

It analyzes signals such as:

* ⚡ Early point velocity
* 💬 Comment velocity
* 📈 Ranking movement
* 🧮 Engagement ratios
* 🕐 Posting-time patterns
* ✍️ Title structure
* 🔎 Historical title similarity
* 📊 Topic and domain trends

and turns them into actionable intelligence.

---

## 🌐 Live Demo

### 🚀 Try InterScout

**Frontend**

[Open InterScout →](https://interscout-webscrapper-fqcu.vercel.app/?utm_source=chatgpt.com)

**Backend API**

[Open API →](https://interscout-webscrappervirality-intel-api.onrender.com/?utm_source=chatgpt.com)

**Interactive API Documentation**

[Open Swagger Docs →](https://interscout-webscrappervirality-intel-api.onrender.com/docs?utm_source=chatgpt.com)

The production architecture is:

```text
┌───────────────────────────────────────┐
│              VERCEL                   │
│          React Frontend               │
└──────────────────┬────────────────────┘
                   │
                   │ HTTPS / REST API
                   ▼
┌───────────────────────────────────────┐
│              RENDER                   │
│          FastAPI Backend              │
│                                       │
│  ML Model │ Title Intel │ Monitoring  │
│  Trends   │ Data Feeds  │ Prediction  │
└──────────────────┬────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Hacker News APIs    Historical Data
```

---

# 🎯 The Problem

Hacker News has an enormous amount of information hidden inside the first few minutes of a submission.

Two stories can have almost identical point counts but completely different trajectories.

Consider:

```text
Story A

100 points
↓
Slow point growth
↓
Few new comments
↓
Rank starts falling
↓
Momentum disappears
```

versus:

```text
Story B

100 points
↓
Rapid point growth
↓
Comments accelerating
↓
Rank improving
↓
Momentum compounds
↓
Story reaches the front page
```

A simple points-based system sees:

```text
100 points vs 100 points
```

InterScout attempts to see:

```text
100 points
+
how quickly they arrived
+
how comments are behaving
+
how ranking is changing
+
how the title compares historically
+
when the story was posted
```

That difference is the foundation of the project.

---

# 🧠 Core Research Question

InterScout is built around one central question:

> **Can early engagement dynamics predict future Hacker News reach beyond what early point totals alone can tell us?**

The system therefore treats virality as a **temporal prediction problem**.

```text
                     STORY CREATED
                           │
                           ▼
                    ┌────────────┐
                    │  0 minutes │
                    └─────┬──────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Early Observations│
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
      Points          Comments           Rank
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                 Temporal Features
                          │
                          ▼
                  Machine Learning
                          │
                          ▼
                    P(Viral)
                          │
                          ▼
              Future Engagement Outcome
```

---

# ✨ What InterScout Can Do

InterScout currently has four major intelligence systems.

| System                    | What it does                                                            |
| ------------------------- | ----------------------------------------------------------------------- |
| 🔮 **Virality Predictor** | Predicts whether a story is likely to enter the high-engagement segment |
| ✍️ **Title Intelligence** | Analyzes a title before it is submitted                                 |
| 📈 **Live Story Monitor** | Tracks momentum after publication                                       |
| 🔎 **Trend Intelligence** | Finds trending topics, domains and posting patterns                     |

Together they create an end-to-end workflow:

```text
                    BEFORE POSTING
                         │
                         ▼
                  TITLE INTELLIGENCE
                         │
                         ▼
                   SUBMIT STORY
                         │
                         ▼
                    LIVE MONITOR
                         │
                         ▼
                 EARLY SIGNALS
                         │
                         ▼
                  VIRALITY MODEL
                         │
                         ▼
                 MOMENTUM TRAJECTORY
                         │
                         ▼
                HISTORICAL ANALYSIS
```

---

# 01 — 🔮 Virality Prediction

The core ML component predicts whether a Hacker News story belongs to the **top 20% of eventual engagement**.

The model uses information available during an early observation window rather than relying on the final outcome.

### Feature Set

The current model uses **12 features**.

| Feature                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `early_points`            | Points at the observation cutoff         |
| `early_comments`          | Comments at the observation cutoff       |
| `early_rank`              | Position in `/newest`                    |
| `points_velocity`         | Rate at which points are increasing      |
| `comments_velocity`       | Rate at which comments are increasing    |
| `rank_change`             | Change in ranking over time              |
| `observation_count_early` | Number of observations before cutoff     |
| `title_length`            | Number of characters                     |
| `title_word_count`        | Number of words                          |
| `title_has_question_mark` | Whether the title contains `?`           |
| `title_has_number`        | Whether the title contains a number      |
| `engagement_ratio`        | Relationship between comments and points |

---

# 🛡️ Temporal Leakage Prevention

One of the most important design decisions in InterScout is preventing **future information from entering an early prediction**.

If the model is supposed to answer:

> "Would this story look promising after 15 minutes?"

then it cannot use information from minute 20 or minute 30.

The feature pipeline therefore constructs temporal variables from **previous observations only**.

Conceptually:

```text
TIME ───────────────────────────────────────────────►

t0          t5          t10         t15         t30
│           │            │            │            │
│           │            │            │            │
└───────────┴────────────┴────────────┘
                         │
                         ▼
                  Prediction Point
                     = 15 min

Allowed information:
t0 → t5 → t10 → t15

Future information:
t30 ❌
```

Temporal calculations use backward-looking transformations such as:

```python
shift(1)
```

This prevents the model from accidentally learning from future observations.

---

# 🤖 Machine Learning Pipeline

The production model uses a scikit-learn pipeline:

```text
Raw Features
     │
     ▼
┌──────────────────────┐
│ Median Imputation    │
│ SimpleImputer        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ StandardScaler       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Logistic Regression  │
│                      │
│ C = 1.0              │
│ class_weight=balanced│
└──────────┬───────────┘
           │
           ▼
       P(Viral)
```

---

# 🏆 Why Logistic Regression?

Several approaches were evaluated, including:

* Logistic Regression
* Random Forest
* XGBoost
* Points-only baseline

Logistic Regression was selected as the production model because it provided a strong balance of:

* predictive performance
* generalization
* interpretability
* probability output
* low inference complexity

The dataset is imbalanced, with approximately **19% positive examples**.

For this reason, **Precision-Recall AUC** is particularly important.

---

# 📊 Model Performance

### 15-Minute Prediction Horizon

| Model                  | CV ROC-AUC |  CV PR-AUC | Train ROC-AUC |
| ---------------------- | ---------: | ---------: | ------------: |
| 🏆 Logistic Regression | **0.8996** | **0.8171** |        0.9255 |
| Random Forest          |     0.8986 |     0.7942 |        0.9669 |
| XGBoost                |     0.8839 |     0.8023 |        0.9479 |
| Points-only baseline   |     0.8897 |     0.7383 |             — |

### Key Result

The complete feature model achieves:

```text
PR-AUC = 0.8171
```

compared with:

```text
Points-only baseline = 0.7383
```

giving:

```text
Absolute improvement = +0.0788 PR-AUC
```

This suggests that **early dynamics contain useful information beyond raw early point totals**.

---

# ⏱️ Multi-Horizon Evaluation

The model was evaluated across multiple observation horizons.

| Horizon    | Stories | Positive Rate | Baseline PR-AUC | Full Model PR-AUC |        Gain |
| ---------- | ------: | ------------: | --------------: | ----------------: | ----------: |
| **15 min** |     469 |        18.98% |          0.7383 |        **0.8171** | **+0.0788** |
| **30 min** |     469 |        18.98% |          0.8987 |        **0.9189** | **+0.0202** |
| **60 min** |     469 |        18.98% |          0.9266 |        **0.9413** | **+0.0147** |

The 15-minute horizon is particularly important because it represents the earliest practical decision window.

---

# 🎯 Prediction Threshold

The system can use probability thresholds to convert the model output into a classification.

For example:

```text
P(Viral) < threshold
        │
        ▼
     Not Viral

P(Viral) ≥ threshold
        │
        ▼
      Viral
```

The system also supports an F1-oriented threshold for more conservative classification.

This allows downstream applications to choose between:

* higher recall
* higher precision
* balanced F1 performance

---

# 02 — ✍️ Title Intelligence

InterScout isn't only useful after a story has been submitted.

It can also be used **before publication**.

Enter a proposed Hacker News title and the title intelligence engine analyzes its characteristics.

```text
                    DRAFT TITLE
                         │
                         ▼
              ┌────────────────────┐
              │ Structural Analysis │
              └─────────┬──────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
       N-Grams       TF-IDF        Title Signals
          │             │              │
          └─────────────┼──────────────┘
                        ▼
               Historical Corpus
                        │
                        ▼
                Similar Stories
                        │
                        ▼
                  Title Report
```

---

## 🔤 N-Gram Analysis

The system extracts meaningful phrases from historical Hacker News titles.

This includes:

* unigrams
* bigrams
* trigrams
* recurring phrases

The objective is not to say:

> "Use this exact phrase."

Instead, the engine identifies **patterns that repeatedly appear in historically successful submissions**.

---

# 🔎 TF-IDF Similarity

Historical titles are converted into TF-IDF vectors.

For a new title:

```text
Draft Title
     │
     ▼
TF-IDF Vector
     │
     ▼
Cosine Similarity
     │
     ▼
Historical Titles
```

This allows InterScout to find previously submitted stories with similar wording or concepts.

The interface can then expose:

* similar titles
* similarity scores
* related phrases
* historical engagement context

---

# 📐 Structural Title Signals

The title engine also evaluates structural properties.

Examples include:

* character length
* word count
* numbers
* question marks
* colon-based structures
* `Show HN`
* bracket-style tags
* recurring patterns

These signals contribute to a **pattern-oriented title score**.

The score should be interpreted as:

> **How closely does this title resemble patterns observed in the historical corpus?**

It is **not a guarantee of virality**.

---

# 🕐 Posting-Time Intelligence

Historical submissions are grouped according to:

* UTC hour
* day of week

The system can identify periods historically associated with stronger engagement.

This provides an additional layer of context:

```text
TITLE
  +
TOPIC
  +
HISTORICAL PATTERN
  +
POSTING WINDOW
```

Again, this is observational intelligence rather than causal evidence.

---

# 03 — 📈 Live Story Monitoring

Once a story is published, InterScout can track it in real time.

The user provides a Hacker News `story_id`.

The backend retrieves information such as:

* points
* comments
* rank
* timestamp

and derives dynamic features.

```text
Story ID
   │
   ▼
Hacker News
   │
   ▼
Current State
   │
   ├── Points
   ├── Comments
   ├── Rank
   └── Timestamp
          │
          ▼
    Feature Engineering
          │
          ├── Point Velocity
          ├── Comment Velocity
          └── Rank Change
                  │
                  ▼
             ML Model
                  │
                  ▼
             P(Viral)
```

---

# 📈 Momentum Trajectory

The monitor doesn't only show a single prediction.

It can record successive observations.

Example:

```text
09:00     P(Viral) = 0.31
   │
09:05     P(Viral) = 0.42
   │
09:10     P(Viral) = 0.57
   │
09:15     P(Viral) = 0.71
```

This produces a trajectory rather than a static number.

The frontend can therefore distinguish between:

```text
↑ RISING
→ STABLE
↓ FALLING
```

This is one of the most important differences between InterScout and a simple prediction API.

---

# 04 — 🔎 Trend Intelligence

InterScout also looks beyond individual stories.

It can analyze the broader Hacker News ecosystem.

---

## 🔥 Trending Topics

Recent observations can be analyzed to identify topics and keywords gaining attention.

Signals include:

* frequency
* engagement
* recent activity
* velocity

This provides a high-level view of what the Hacker News community is currently discussing.

---

# 🌐 Domain Intelligence

The system aggregates historical performance by domain.

Conceptually:

```text
Domain
   │
   ├── Number of stories
   ├── Engagement
   ├── Peak points
   └── Historical performance
          │
          ▼
     Domain Ranking
```

This allows users to explore patterns such as which domains have historically produced highly engaged submissions.

---

# 🔎 Similar Story Research

The research workflow can search historical captures for related topics.

For example:

```text
Topic:
"vector databases"

        ↓

Historical stories
        ↓

Similar submissions
        ↓

Engagement
        ↓

Domains
        ↓

Posting times
```

This can help answer:

* Has this topic already been discussed?
* How recently?
* What similar stories performed well?
* Which domains appeared repeatedly?
* What was their engagement?

---

# 📡 Data Collection Architecture

Historical data is collected separately from live monitoring.

The collection layer uses the **Bright Data Data Collector API**.

```text
                  BRIGHT DATA
                      │
                      ▼
              Raw HN Snapshots
                      │
                      ▼
             ┌─────────────────┐
             │ Deduplication   │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Normalization   │
             └────────┬────────┘
                      │
                      ▼
             Processed Dataset
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Temporal Features         Title Corpus
          │                       │
          ▼                       ▼
     ML Training             TF-IDF Engine
```

Two primary collection streams are used:

| Collector    | Source                 |   Interval |
| ------------ | ---------------------- | ---------: |
| `newest`     | Hacker News `/newest`  | ~8 minutes |
| `front_page` | Hacker News front page |    ~1 hour |

Raw snapshots are stored separately before processing.

---

# 🧹 Data Processing

The processing layer transforms raw observations into model-ready data.

Important artifacts include:

```text
data/
│
├── raw/
│   ├── newest/
│   └── front_page/
│
└── processed/
    ├── all_observations.csv
    ├── temporal_features.csv
    └── story_id_overlap.csv
```

### `all_observations.csv`

Normalized story observations.

### `temporal_features.csv`

Model-ready temporal and content features.

### `story_id_overlap.csv`

Used to inspect overlap between collected story populations.

---

# 🏗️ Complete Architecture

```text
                         ┌──────────────────────┐
                         │     HACKER NEWS      │
                         └───────────┬──────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
          ┌──────────────────┐              ┌──────────────────┐
          │ Bright Data      │              │ HN Public APIs   │
          │ Historical Data  │              │ Live Monitoring  │
          └────────┬─────────┘              └────────┬─────────┘
                   │                                 │
                   ▼                                 │
          ┌──────────────────┐                       │
          │ Raw Snapshots    │                       │
          └────────┬─────────┘                       │
                   │                                 │
                   ▼                                 │
          ┌──────────────────┐                       │
          │ Ingestion        │                       │
          │ Pipeline         │                       │
          └────────┬─────────┘                       │
                   │                                 │
          ┌────────┴─────────┐                       │
          ▼                  ▼                       │
   ┌──────────────┐  ┌───────────────┐               │
   │ Temporal     │  │ Title Corpus  │               │
   │ Features     │  │ / TF-IDF      │               │
   └──────┬───────┘  └───────┬───────┘               │
          │                  │                        │
          ▼                  ▼                        │
   ┌──────────────┐  ┌───────────────┐               │
   │ ML Model     │  │ Title Engine  │               │
   └──────┬───────┘  └───────┬───────┘               │
          │                  │                        │
          └──────────┬───────┘                        │
                     ▼                                ▼
             ┌──────────────────────────────────────────┐
             │                 FASTAPI                  │
             │                                          │
             │ Prediction │ Title │ Monitor │ Trends   │
             └───────────────────┬──────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
                       ┌───────────────────┐
                       │  React Frontend   │
                       │      Vercel       │
                       └───────────────────┘
```

---

# 🔌 Backend API

The production backend is deployed on Render:

[InterScout API](https://interscout-webscrappervirality-intel-api.onrender.com/?utm_source=chatgpt.com)

Interactive documentation:

[Swagger / OpenAPI Docs](https://interscout-webscrappervirality-intel-api.onrender.com/docs?utm_source=chatgpt.com)

---

## Health

### `GET /health`

Used to verify that the API and model are available.

---

# 🤖 Prediction

### `POST /api/v1/predict`

Predict virality from a supplied feature vector.

### `POST /api/v1/predict/{story_id}`

Predict virality for a Hacker News story.

### `POST /api/v1/batch_predict`

Run predictions for multiple stories.

---

# ✍️ Title Intelligence

### `POST /api/v1/score_title`

Analyze a proposed title.

### `POST /api/v1/refresh_corpus`

Refresh the historical title corpus.

---

# 📈 Monitoring

### `GET /api/v1/monitor/{story_id}`

Retrieve the current story state.

### `GET /api/v1/monitor/{story_id}/history`

Retrieve monitoring history.

### `DELETE /api/v1/monitor/{story_id}/history`

Clear stored monitoring history.

---

# 📊 Trends

### `GET /api/v1/trending`

Retrieve trending topics.

Example:

```text
/api/v1/trending?hours=5&top_n=10
```

### `GET /api/v1/trending/domains`

Retrieve domain performance.

```text
/api/v1/trending/domains?top_n=15
```

### `GET /api/v1/trending/best_time`

Retrieve historical posting-time intelligence.

### `GET /api/v1/similar`

Search for similar historical stories.

```text
/api/v1/similar?topic=vector+database&hours=48
```

---

# 📡 Collection

### `POST /api/v1/collect`

Trigger a historical collection job.

This requires the appropriate Bright Data configuration.

---

# 🖥️ Frontend Architecture

The frontend is a React + TypeScript application deployed on Vercel.

[InterScout Live Application](https://interscout-webscrapper-fqcu.vercel.app/?utm_source=chatgpt.com)

Technology:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* TanStack Router
* TanStack React Query
* Recharts
* Framer Motion
* GSAP
* Lenis

---

## Frontend → Backend Flow

```text
User
 │
 ▼
React Component
 │
 ▼
React Query Hook
 │
 ▼
Typed API Client
 │
 ▼
HTTPS
 │
 ▼
Render / FastAPI
 │
 ├── ML model
 ├── Hacker News API
 ├── Title engine
 ├── Trend engine
 └── Monitoring data
 │
 ▼
JSON
 │
 ▼
React Query Cache
 │
 ▼
Charts / Metrics / Intelligence UI
```

This separation keeps the frontend focused on presentation while the backend handles:

* data retrieval
* feature engineering
* model inference
* NLP
* monitoring
* analytics

---

# 📁 Project Structure

```text
interscout/
│
├── api/
│   ├── main.py
│   ├── model.py
│   ├── schema.py
│   ├── router.py
│   ├── title_router.py
│   ├── monitor_router.py
│   └── feed_router.py
│
├── src/
│   ├── collector_sync.py
│   ├── ingest.py
│   ├── temporal_features.py
│   ├── title_intelligence.py
│   ├── live_feed.py
│   └── ...
│
├── data/
│   ├── raw/
│   │   ├── newest/
│   │   └── front_page/
│   │
│   └── processed/
│       ├── all_observations.csv
│       ├── temporal_features.csv
│       └── story_id_overlap.csv
│
├── model/
│   ├── features.json
│   ├── final_logistic_regression_15min.joblib
│   ├── coefficient_stability_summary.csv
│   └── horizon_cv_performance.csv
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── routes/
│       └── ...
│
├── notebooks/
│   └── virality_forensics_notebook_v1.ipynb
│
├── tests/
│   ├── test_api.py
│   └── test_collector_sync.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

# 🚀 Run Locally

## Requirements

```text
Python 3.14+
Node.js
npm
```

---

## 1. Clone

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd interscout
```

---

## 2. Backend

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
.\venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Environment Variables

Create:

```text
.env
```

Example:

```env
BRIGHTDATA_API_TOKEN=your_brightdata_token
VIRALITY_API_KEY=your_api_key
```

Do **not** commit `.env` to Git.

---

## 4. Start FastAPI

```bash
uvicorn api.main:app --reload --port 8000
```

API:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 5. Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Testing

Run:

```bash
pytest -v
```

The test suite covers areas including:

* API health
* prediction
* batch prediction
* threshold handling
* missing values
* title intelligence
* trend endpoints
* monitoring
* collection behavior
* retries
* rate limits
* deduplication

---

# 🔐 Environment & Security

Never commit:

```text
.env
API keys
Bright Data credentials
private tokens
production secrets
```

Use environment variables in deployment environments such as Render and Vercel.

---

# ⚠️ Limitations

InterScout is a **forecasting and intelligence system**, not a guaranteed virality oracle.

Several factors are difficult to model.

### External Events

A story may suddenly become popular because of a breaking event that was not visible in its early engagement data.

### Author Effects

Author reputation and established audiences can influence performance.

### Topic Novelty

Completely new topics may behave differently from historical data.

### Ranking Algorithm

Hacker News ranking behavior is not represented here as a complete deterministic formula.

### Observational Data

The system learns from observed behavior.

Therefore:

> **Predictive correlation should not be interpreted as causal evidence.**

### Dataset Size

The current benchmark is based on a limited historical sample.

More data will allow stronger validation across:

* time periods
* topics
* authors
* domains
* market conditions

---

# 🔬 Future Research

InterScout provides a foundation for several deeper research directions.

## Temporal Models

Future experiments could compare the current model with:

* Gradient Boosting
* XGBoost
* LightGBM
* Temporal CNNs
* LSTMs
* Transformers
* Survival models

---

## Semantic Title Understanding

The current title engine can be extended with:

```text
Sentence Embeddings
        +
Semantic Search
        +
Topic Embeddings
        +
LLM Representations
```

This would allow the system to recognize semantic similarity even when two titles use completely different words.

---

## Author-Level Features

Future versions could model:

* previous submissions
* historical author engagement
* author consistency
* author-specific audience effects

---

## Survival Analysis

Rather than predicting only:

```text
Viral / Not Viral
```

future models could estimate:

```text
P(Top 20 | t)
P(Top 10 | t)
P(Front Page | t)
Expected time to threshold
```

This would turn InterScout into a more complete **time-to-event forecasting system**.

---

## Online Learning

As new Hacker News data arrives, the model could periodically retrain and detect changes in community behavior.

This would allow InterScout to adapt to:

```text
Changing topics
Changing ranking behavior
Changing user behavior
Changing engagement patterns
```

---

# 🧠 Why InterScout?

Most analytics systems answer:

> **"What happened?"**

InterScout tries to answer:

> **"What is happening right now, why might it be happening, and what could happen next?"**

The distinction is:

```text
Traditional Analytics

      STORY
        │
        ▼
   Final Metrics
        │
        ▼
   What happened?


InterScout

      STORY
        │
        ▼
   Early Signals
        │
        ▼
    Momentum
        │
        ▼
    Prediction
        │
        ▼
 Historical Context
        │
        ▼
  What happens next?
```

---

# 🛠️ Technology Stack

### Machine Learning

* Python
* scikit-learn
* Logistic Regression
* Random Forest
* XGBoost
* TF-IDF
* Cosine Similarity

### Backend

* FastAPI
* Pydantic
* Pandas
* NumPy
* Joblib

### Data

* Hacker News
* Bright Data
* JSON snapshots
* CSV datasets

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* TanStack Router
* TanStack React Query
* Recharts
* Framer Motion
* GSAP
* Lenis

### Deployment

* **Vercel** — Frontend
* **Render** — FastAPI backend

### Testing

* Pytest

---

# 📌 Project Status

### Completed

* [x] Historical Hacker News collection
* [x] Raw snapshot pipeline
* [x] Data ingestion
* [x] Temporal feature engineering
* [x] Temporal leakage prevention
* [x] Virality classification
* [x] Model benchmarking
* [x] Production ML model
* [x] Title intelligence
* [x] TF-IDF similarity
* [x] Live story monitoring
* [x] Momentum tracking
* [x] Trending topics
* [x] Domain intelligence
* [x] Posting-time analysis
* [x] FastAPI backend
* [x] React frontend
* [x] Production deployment
* [x] Automated testing

### Next

* [ ] Larger historical dataset
* [ ] Semantic title embeddings
* [ ] Author-level features
* [ ] Topic embeddings
* [ ] Online retraining
* [ ] Model calibration
* [ ] Survival analysis
* [ ] Causal analysis
* [ ] Production observability

---

# 🌐 Deployment

InterScout is deployed as a split full-stack application.

```text
                    INTERNET
                        │
                        ▼
        ┌────────────────────────────┐
        │          VERCEL            │
        │                            │
        │     React + TypeScript     │
        │        Frontend            │
        └──────────────┬─────────────┘
                       │
                       │ HTTPS REST
                       ▼
        ┌────────────────────────────┐
        │           RENDER           │
        │                            │
        │          FastAPI           │
        │                            │
        │ ┌────────┐ ┌────────────┐ │
        │ │   ML   │ │ Title NLP  │ │
        │ └────────┘ └────────────┘ │
        │                            │
        │ ┌────────┐ ┌────────────┐ │
        │ │Monitor │ │   Trends   │ │
        │ └────────┘ └────────────┘ │
        └──────────────┬─────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Hacker News          Historical
          APIs                 Data
```

---

# ⭐ Try It

### Live Application

[Launch InterScout →](https://interscout-webscrapper-fqcu.vercel.app/?utm_source=chatgpt.com)

### Backend

[InterScout API →](https://interscout-webscrappervirality-intel-api.onrender.com/?utm_source=chatgpt.com)

### API Documentation

[Swagger Documentation →](https://interscout-webscrappervirality-intel-api.onrender.com/docs?utm_source=chatgpt.com)

---

# 📜 License

This project is licensed under the MIT License.

See [`LICENSE`](./LICENSE) for details.

---

# 🚀 Final Summary

**InterScout is a full-stack temporal intelligence platform for Hacker News.**

It combines:

```text
                    ┌──────────────────┐
                    │   DATA           │
                    │ Hacker News      │
                    │ Bright Data      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   FEATURES       │
                    │ Velocity         │
                    │ Rank Movement    │
                    │ Engagement       │
                    │ Title Signals    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   INTELLIGENCE   │
                    │ ML Prediction    │
                    │ TF-IDF           │
                    │ Trend Analysis   │
                    │ Monitoring       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    FASTAPI       │
                    │    BACKEND       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  REACT FRONTEND  │
                    │     VERCEL       │
                    └──────────────────┘
```

> **InterScout turns the first few minutes of a Hacker News story into a measurable signal — combining temporal machine learning, NLP, historical intelligence, and real-time monitoring to understand what makes content take off.**

---

### Built as an experiment in **temporal machine learning, content intelligence, and real-time prediction.**

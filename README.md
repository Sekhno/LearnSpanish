# LearnSpanish

A personal web application for learning Spanish and Catalan vocabulary. Built as a full-stack pet project with a Spring Boot backend and an Angular frontend.

---

## Features

Each topic includes three tabs:

| Tab | Description |
|-----|-------------|
| **Theory** | Reference table with 4 languages (English, Ukrainian, Spanish, Catalan) + text-to-speech |
| **Practice** | 10-question quiz — pick the correct Spanish or Catalan translation from 3 options |
| **Results** | History of the last 20 quiz attempts with score and percentage |

### Topics

| Route | Topic | Content |
|-------|-------|---------|
| `/numbers` | **Numbers** | Numbers 0–1000+ with Spanish and Catalan translations |
| `/shopping` | **Shopping** | Phrases for shops/markets + grocery vocabulary grouped by category |
| `/colors` | **Colors** | 20 colors with visual color swatches and hex codes |
| `/introduction` | **Introduction** | 21 Q&A phrases for introducing yourself, organized by category (name, origin, age, occupation, family, languages, contact) |

---

## Tech Stack

### Text-to-Speech

Audio is generated offline with **Piper TTS** and served as static WAV files:

| Language | Voice model | Quality |
|----------|------------|---------|
| Spanish (es-ES) | `es_ES-sharvard-medium` | Medium |
| Catalan (ca-ES) | `ca_ES-upc_pau-x_low` | X-Low |

Files live at `src/main/resources/static/audio/{es|ca}/{djb2(text)}.wav`.
The filename is a **DJB2 hash** of the cleaned text, computed identically in `generate-audio.py` (Python) and `SpeechService` (TypeScript) — no lookup table needed.

Playback uses the **Web Audio API** with an in-memory `AudioBuffer` cache — no browser voice installation required.

### Backend
- **Java 21** / **Spring Boot 4.1.2**
- Spring Web, Spring Security, Spring Data JPA
- **H2** database (file mode — data persists between restarts)
- Session-based auth (JSESSIONID, 30-day timeout)
- Vocabulary data stored as JSON files in `src/main/resources/data/`

### Frontend
- **Angular 22** (standalone components, **zoneless** change detection)
- **Angular Material 22** (tabs, tables, cards, chips, progress bars)
- SCSS with shared mixins (`_topic.scss`, `_quiz.scss`)
- Web Speech API for text-to-speech (Spanish `es-ES`, Catalan `ca-ES`)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Node.js | 18+ (tested with v23) |
| Angular CLI | 22+ (`npm install -g @angular/cli`) |
| Python (Homebrew) | 3.13+ (`/opt/homebrew/bin/python3`) |

---

## Getting Started

### 1. Generate TTS audio (first time only)

The app uses pre-generated WAV files for text-to-speech via [Piper TTS](https://github.com/rhasspy/piper).
The voice models and WAV files are **not** committed to git — run this once after cloning:

```bash
# Install Piper TTS Python package
/opt/homebrew/bin/pip3 install piper-tts --break-system-packages

# Download voice models (Spanish sharvard-medium + Catalan upc_pau-x_low)
mkdir -p piper/models
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx" \
     -o piper/models/es_ES-sharvard-medium.onnx
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json" \
     -o piper/models/es_ES-sharvard-medium.onnx.json
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/ca/ca_ES/upc_pau/x_low/ca_ES-upc_pau-x_low.onnx" \
     -o piper/models/ca_ES-upc_pau-x_low.onnx
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/ca/ca_ES/upc_pau/x_low/ca_ES-upc_pau-x_low.onnx.json" \
     -o piper/models/ca_ES-upc_pau-x_low.onnx.json

# Generate ~1234 WAV files (~30 MB)
/opt/homebrew/bin/python3 generate-audio.py
```

Re-run `generate-audio.py` after adding new vocabulary (it skips already-generated files).

### 2. Start the backend

```bash
./mvnw spring-boot:run
```

The API is available at `http://localhost:8080`.

A default user is created on first start:

| Username | Password |
|----------|----------|
| `administrator` | `administrator` |

### 3. Start the frontend

```bash
cd frontend
ng serve
```

Open `http://localhost:4200` in your browser.

### H2 Console (optional)

Access the embedded database browser at `http://localhost:8080/h2-console`.

- **JDBC URL:** `jdbc:h2:file:./data/learnspanish`
- **User:** `sa` / no password

---

## Project Structure

```
LearnSpanish/
├── pom.xml
├── data/
│   └── learnspanish.mv.db          # H2 file database (auto-created)
│
├── src/main/
│   ├── resources/
│   │   └── data/
│   │       ├── colors.json
│   │       ├── introduction-phrases.json
│   │       ├── shopping-items.json
│   │       └── shopping-phrases.json
│   └── java/com/example/learnspanish/
│       ├── config/                  # Security & CORS config
│       ├── controller/              # REST controllers
│       ├── dto/                     # Request/response DTOs
│       ├── model/                   # JPA entities + data records
│       ├── repository/              # Spring Data repositories
│       └── service/                 # Business logic + data loading
│
└── frontend/src/app/
    ├── colors/                      # Colors topic
    │   └── practice/
    ├── introduction/                # Introduction topic
    │   └── practice/
    ├── numbers/                     # Numbers topic
    │   └── practice/
    ├── shopping/                    # Shopping topic
    │   └── practice/
    ├── guards/                      # Auth guard
    ├── interceptors/                # HTTP interceptor (credentials + 401)
    ├── layout/                      # App shell (sidenav + toolbar)
    ├── login/
    ├── models/                      # TypeScript interfaces
    ├── services/                    # HTTP services
    └── styles/                      # Shared SCSS mixins
```

---

## API Reference

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/auth/login` | Login (`username` + `password`, form-urlencoded) |
| `GET`  | `/api/auth/me` | Current user info |
| `POST` | `/api/auth/logout` | Logout |

### Topics
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/topics` | List of all topics |

### Numbers
| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/numbers` | All number entries |
| `GET`  | `/api/quiz/numbers` | Generate a 10-question quiz |
| `POST` | `/api/quiz/numbers/submit` | Submit answers, save result |

### Shopping
| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/shopping/phrases` | Conversation phrases |
| `GET`  | `/api/shopping/items` | Grocery vocabulary |
| `GET`  | `/api/shopping/quiz?categories=` | Generate quiz (optional category filter) |
| `POST` | `/api/shopping/quiz/submit` | Submit answers, save result |

### Colors
| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/colors` | All colors (with hex codes) |
| `GET`  | `/api/colors/quiz` | Generate a 10-question quiz |
| `POST` | `/api/colors/quiz/submit` | Submit answers, save result |

### Introduction
| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/introduction/phrases` | All introduction phrases |
| `GET`  | `/api/introduction/quiz` | Generate a 10-question quiz |
| `POST` | `/api/introduction/quiz/submit` | Submit answers, save result |

### Results
| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/test-results?topicId=` | Last 20 results for a topic |

---

## License

MIT

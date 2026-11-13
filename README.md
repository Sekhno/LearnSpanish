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

---

## Getting Started

### 1. Start the backend

```bash
./mvnw spring-boot:run
```

The API is available at `http://localhost:8080`.

A default user is created on first start:

| Username | Password |
|----------|----------|
| `administrator` | `administrator` |

### 2. Start the frontend

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

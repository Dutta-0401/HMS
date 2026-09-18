# Hospital Management System

A full-stack hospital appointment booking platform with AI-powered chatbot assistance.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss)

## Features

- **Hospital & Doctor Discovery** — Browse hospitals and doctors by specialty
- **Appointment Booking** — Real-time slot availability and booking confirmation
- **Secure Payments** — PayU integration for appointment fees
- **SMS Verification** — Twilio-powered OTP authentication
- **AI Chatbot Assistant** — CityHealth Assistant for instant help
- **Responsive Design** — Mobile-first, works on all devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Spring Boot 3, Java 17 |
| Database | MongoDB Atlas |
| Auth | JWT + Twilio SMS OTP |
| Payments | PayU |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
hospital-website/
├── frontend/          # React + Vite patient-facing app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level pages
│   │   ├── services/     # API clients
│   │   └── styles/       # Tailwind + custom CSS
│   └── package.json
├── backend/           # Spring Boot REST API
│   ├── src/main/java/com/hospital/booking/
│   │   ├── controller/   # REST endpoints
│   │   ├── service/      # Business logic
│   │   ├── entity/       # Domain models
│   │   └── security/     # JWT auth
│   └── pom.xml
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Java 17+
- MongoDB Atlas account

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB credentials
./mvnw spring-boot:run
```

API runs on http://localhost:8080

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_REACT_APP_API_URL` | Backend API URL |
| `VITE_SSE_URL` | Server-Sent Events endpoint |

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing (256+ bits) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `PAYU_MERCHANT_KEY` | PayU merchant key |
| `PAYU_SALT` | PayU merchant salt |

## API Documentation

With `SWAGGER_ENABLED=true`, access Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## Deployment

### Frontend (Vercel)

Connected to GitHub — auto-deploys on push to `master`.

### Backend (Render)

1. Dashboard → New → Blueprint, select this repo (`render.yaml` at root)
2. Set secret environment variables in Render dashboard (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`)
3. Deploy (Docker build from `backend/`, health check `/actuator/health`)

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

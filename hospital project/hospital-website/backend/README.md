# Hospital Booking API - Java Backend

Spring Boot backend for the Hospital Appointment Booking System.

## Tech Stack

- **Java 21** (LTS)
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **H2 Database** (development) / **PostgreSQL** (production)
- **Lombok** for boilerplate reduction
- **OpenAPI/Swagger** for API documentation

## Prerequisites

- Java 21 or higher
- Maven 3.8+

## Quick Start

### Development Mode

```bash
# Navigate to backend directory
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The API will start at `http://localhost:5000`

### API Documentation

- Swagger UI: http://localhost:5000/swagger-ui.html
- OpenAPI JSON: http://localhost:5000/api-docs

### H2 Console (Development)

- URL: http://localhost:5000/h2-console
- JDBC URL: `jdbc:h2:mem:hospitaldb`
- Username: `sa`
- Password: (empty)

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP and get JWT |
| GET | `/api/hospitals` | List all hospitals |
| GET | `/api/hospitals/{id}` | Get hospital by ID |
| GET | `/api/hospitals/{id}/doctors` | Get doctors in hospital |
| GET | `/api/doctors/{id}` | Get doctor by ID |
| GET | `/api/doctors/{id}/slots?date=YYYY-MM-DD` | Get available slots |

### Protected Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/users/{userId}/appointments` | Get user's appointments |

## Authentication

1. Send OTP:
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999"}'
```

2. Verify OTP and get token:
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999", "otp": "123456"}'
```

3. Use token in requests:
```bash
curl http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── src/main/java/com/hospital/booking/
│   ├── config/           # Configuration classes
│   ├── controller/       # REST controllers
│   ├── dto/              # Data Transfer Objects
│   ├── entity/           # JPA entities
│   ├── exception/        # Exception handling
│   ├── repository/       # Data repositories
│   ├── security/         # JWT & Security
│   └── service/          # Business logic
├── src/main/resources/
│   ├── application.yml       # Dev configuration
│   └── application-prod.yml  # Prod configuration
└── pom.xml
```

## Building for Production

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run with production profile
java -jar target/hospital-booking-api-1.0.0.jar --spring.profiles.active=prod
```

## Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret (min 256 bits) |
| `CORS_ORIGINS` | Allowed CORS origins |

## Sample Data

The application auto-loads sample data on startup:
- 3 Hospitals
- 7 Doctors
- Various specialties

## License

MIT

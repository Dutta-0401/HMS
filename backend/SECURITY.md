# 🔒 Security Documentation

## Security Measures Implemented

### 1. Authentication & Authorization

| Feature | Implementation |
|---------|----------------|
| JWT Authentication | HMAC-SHA256 signed tokens with configurable expiration |
| OTP Verification | 6-digit cryptographically secure OTP with 5-minute expiry |
| Brute Force Protection | Account lockout after 3 failed OTP attempts (15-minute lock) |
| Secure Random | Using `java.security.SecureRandom` for OTP generation |
| Token Validation | Proper JWT signature verification and expiry checks |

### 2. Rate Limiting

- **General API**: 10 requests/minute per IP
- **Auth Endpoints**: 5 requests/minute per IP
- Automatic cleanup of expired rate limit entries
- Proper IP detection with X-Forwarded-For support

### 3. Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS filter |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer leakage |
| Content-Security-Policy | default-src 'self' | Prevents XSS and injection |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Forces HTTPS |

### 4. Input Validation

- Bean Validation (JSR-380) on all DTOs
- Phone number format validation (10 digits)
- OTP format validation (6 digits)
- Request body validation with `@Valid`

### 5. CORS Configuration

- Configurable allowed origins via environment variable
- Restricted HTTP methods
- Restricted allowed headers (only Authorization, Content-Type, X-Requested-With)
- Credentials support enabled
- Preflight caching (1 hour)

## Production Deployment Checklist

### Environment Variables (REQUIRED)

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
MONGODB_DATABASE=hospitaldb

# JWT (generate with: openssl rand -base64 64)
JWT_SECRET=<strong-256-bit-secret>
JWT_EXPIRATION=86400000

# CORS
CORS_ORIGINS=https://yourdomain.com

# Logging
LOG_LEVEL=WARN

# Swagger (disable in production)
SWAGGER_ENABLED=false
```

### Security Checklist

- [ ] **Strong JWT Secret**: Use `openssl rand -base64 64` to generate
- [ ] **HTTPS Only**: Configure TLS/SSL certificates
- [ ] **Environment Variables**: Never commit secrets to version control
- [ ] **MongoDB Atlas**:
  - [ ] Enable IP whitelisting
  - [ ] Use strong database password
  - [ ] Enable audit logging
  - [ ] Enable encryption at rest
- [ ] **Disable Debug Logging**: Set `LOG_LEVEL=WARN` or `INFO`
- [ ] **Disable Swagger**: Set `SWAGGER_ENABLED=false`
- [ ] **Update Dependencies**: Run `mvn versions:display-dependency-updates`
- [ ] **Security Scanning**: Run OWASP dependency check

### Dependency Security Scanning

Add to `pom.xml` for security scanning:

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>9.0.7</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Run: `mvn dependency-check:check`

## API Security

### Protected Endpoints (Require JWT)

- `POST /api/appointments/**` - Create/manage appointments
- `GET /api/users/**` - User profile operations

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/**` - Authentication (rate limited)
- `GET /api/hospitals/**` - Hospital listings
- `GET /api/doctors/**` - Doctor listings

## Incident Response

### If JWT Secret is Compromised

1. Immediately rotate the JWT secret in production
2. All users will need to re-authenticate
3. Review access logs for suspicious activity
4. Consider notifying affected users

### If Database Credentials are Compromised

1. Rotate MongoDB Atlas password immediately
2. Review MongoDB Atlas audit logs
3. Check for unauthorized data access
4. Update application with new credentials

## Security Contact

For security vulnerabilities, please contact: [security email]

---

*Last Updated: $(date)*
*Security Review Required: Quarterly*

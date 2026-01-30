# Twilio Verify Service Setup Guide

## What is Twilio Verify?

**Twilio Verify Service** is the official, production-grade API for OTP (One-Time Password) authentication. It's specifically designed for:

- ✅ SMS-based OTP delivery
- ✅ Built-in fraud detection and rate limiting
- ✅ Phone number validation
- ✅ Automatic retry logic
- ✅ Webhook for delivery tracking
- ✅ India DLT compliance support

**vs Basic SMS:**
- Dedicated for verification workflows (better tracking)
- Automatic retry if delivery fails
- Phone lookup validation built-in
- Production-recommended by Twilio

## Step 1: Create Twilio Account

1. Go to **https://www.twilio.com/try-twilio**
2. Sign up with email/phone
3. Verify your phone number (choose India +91)
4. **You get $15 free credit** for testing!

## Step 2: Get Your Credentials

### Get Account SID & Auth Token:

1. Go to **https://console.twilio.com**
2. On the dashboard, copy:
   - **Account SID**: AC1234...
   - **Auth Token**: 32 character token

### Create Verify Service:

1. Go to **https://console.twilio.com/develop/verify/services**
2. Click **Create Service**
3. Name it: "Hospital Booking OTP"
4. Click **Create**
5. Copy the **Service SID**: VA1234...

## Step 3: Configure Backend

Create `.env` file in backend folder:

```bash
# Twilio Verify
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_32_chars_here
TWILIO_VERIFY_SERVICE_SID=VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_COUNTRY_CODE=+91
```

## Step 4: Verify Your Phone (Trial Only)

⚠️ **For trial accounts**, you can only send OTP to verified numbers:

1. Go to **https://console.twilio.com/phone-numbers/verified**
2. Click **Verify a Number**
3. Enter your Indian phone: `+919876543210`
4. Get SMS with verification code
5. Enter the code

Now you can test OTP to your own number!

## Step 5: Test the Integration

### Start Backend:
```bash
cd backend
.\start.bat
```

### Send OTP:
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```

**Response:**
```json
{
  "ok": true,
  "message": "OTP sent successfully to your phone"
}
```

You should receive SMS: **"Your hospital booking OTP is: 123456"**

### Verify OTP:
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user123",
    "name": "User",
    "phone": "9876543210",
    "email": null
  }
}
```

## Error Handling

| Error | Meaning | Solution |
|-------|---------|----------|
| "Invalid phone number format" | Wrong format | Use 10-digit Indian number |
| "Invalid or unreachable phone number" | Twilio validation failed | Check if number is active |
| "Too many OTP requests" | Rate limited (20429) | Wait a few minutes |
| "Failed to send OTP" | Twilio API error | Check credentials, balance |

## Production Upgrade

### Trial Limitations:
- ❌ Only verified numbers work
- ❌ SMS includes "Sent from Twilio trial"
- ✅ $15 free credit
- ✅ Good for development/testing

### Production (Paid):
- ✅ Send to any number
- ✅ Professional SMS format
- ✅ Full feature support
- 💳 ~₹0.65 per SMS (~$0.0079)

**To upgrade:**
1. Go to **https://console.twilio.com/billing**
2. Add payment method
3. Minimum: $20
4. Verification removed automatically

## Twilio Verify Flow

```
User Request OTP
    ↓
Backend validates phone (10-digit Indian)
    ↓
Twilio Verify Service sends SMS
    ↓
User receives: "Your OTP is: 123456"
    ↓
User submits OTP
    ↓
Backend verifies via Twilio
    ↓
Twilio confirms: Valid ✓
    ↓
User gets JWT token
```

## Security Features Included

✅ **Brute Force Protection:**
- Account lockout after 3 failed attempts
- 15-minute lock period
- Rate limiting (5 requests/min)

✅ **OTP Security:**
- 6-digit cryptographically secure OTP
- 5-minute expiry
- Never logged (privacy)
- Phone number obfuscated in logs

✅ **Phone Validation:**
- Format checking (10-digit Indian)
- Twilio Lookup validation
- Fake number detection

## Cost Estimation

**For 1000 active users/month:**

| Operation | Cost | Count | Total |
|-----------|------|-------|-------|
| OTP Send | $0.0079 | 1000 | $7.90 |
| Phone Lookup | $0.005 | 1000 | $5.00 |
| **Monthly** | | | **~$13** |

**Per user:**
- OTP: ₹0.65 (~$0.008)
- Lookup: ₹0.42 (~$0.005)

## Troubleshooting

### SMS Not Received:

1. **Trial account?** → Only verified numbers
2. **Wrong number format?** → Use 10 digits: `9876543210`
3. **Twilio balance?** → Check at console.twilio.com/billing
4. **Phone is international?** → Add country code: `+919876543210`

### "Invalid credentials" error:

1. Go to **https://console.twilio.com** → Dashboard
2. Copy exact Account SID & Auth Token
3. Check for spaces/typos in `.env`
4. Restart backend

### "Verify Service not found":

1. Go to **https://console.twilio.com/develop/verify/services**
2. Copy exact **Service SID** (starts with VA)
3. Restart backend

## Next Steps

1. ✅ Set up Twilio account
2. ✅ Configure credentials in `.env`
3. ✅ Test with your phone number
4. ✅ Deploy to production
5. ✅ Monitor SMS delivery via Twilio dashboard
6. ✅ Set up webhooks for delivery tracking (optional)

## India-Specific Notes

For commercial SMS in India:
- ✅ Twilio handles DLT registration (for Twilio senders)
- ⚠️ May need DLT approval for custom sender IDs
- ✅ Works with +91 country code
- ✅ Supports all Indian carriers

For high volume:
- Consider **MSG91** or **TextLocal** for India-specific rates
- Twilio: $0.0079/SMS
- MSG91: ~$0.002/SMS (5x cheaper!)

---

**Questions?** Check Twilio docs: https://www.twilio.com/docs/verify

# Twilio SMS Setup Guide

## How to Get Twilio Credentials

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free trial account
3. Verify your email and phone number
4. You'll get **$15 free credit** for testing

### Step 2: Get Your Credentials
1. Login to https://console.twilio.com
2. You'll see your **Account SID** and **Auth Token** on the dashboard
3. Click "Get a Trial Number" to get a free phone number

### Step 3: Configure Environment Variables

Create a `.env` file in the backend folder:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_32_character_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
TWILIO_COUNTRY_CODE=+91
```

### Step 4: Trial Account Limitations

⚠️ **Important**: Twilio trial accounts have restrictions:

1. **Can only send SMS to verified numbers**
   - Go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Click "Add a verified phone number"
   - Enter your Indian mobile: +919876543210
   - Verify with OTP

2. **Messages include trial disclaimer**
   - "Sent from your Twilio trial account - [Your message]"
   - This goes away when you upgrade

3. **Limited to verified numbers only**
   - For testing with any number, you need to upgrade ($20 minimum)

### Step 5: Upgrade to Production (Optional)

To send SMS to any number:
1. Go to https://console.twilio.com/us1/billing
2. Add payment method
3. Upgrade account (minimum $20)
4. **Cost**: ~$0.0079 per SMS for India

### Step 6: Test the Integration

```bash
# Start backend
.\start.bat

# Test with your verified number
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# You should receive SMS on your phone!
```

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Invalid or unreachable phone number" | Number doesn't exist or is invalid | Check number format |
| "Failed to send OTP" | Twilio API issue | Check credentials, verify number |
| "Twilio not configured" | Missing credentials | Add to .env file |

## Production Checklist

- [ ] Upgrade Twilio account (remove trial restrictions)
- [ ] Set up billing alerts
- [ ] Use environment variables (never hardcode)
- [ ] Monitor SMS delivery rates
- [ ] Set up Twilio webhook for delivery status
- [ ] Consider SMS template approval for India (DLT registration)

## Indian DLT Registration (Required for Production)

For sending commercial SMS in India:
1. Register with DLT (Distributed Ledger Technology)
2. Register your sender ID
3. Get template approval for OTP messages
4. Configure in Twilio console

**Template Example:**
```
Your hospital booking OTP is {#var#}. Valid for 5 minutes. Do not share this code.
```

## Alternative SMS Providers (India-Specific)

If you need India-specific features:
- **MSG91**: https://msg91.com (₹10 for 100 SMS)
- **TextLocal**: https://www.textlocal.in
- **AWS SNS**: https://aws.amazon.com/sns

## Security Best Practices

✅ **Current Implementation:**
- Phone validation before sending
- OTP expires in 5 minutes
- Rate limiting on auth endpoints
- Account lockout after 3 failed attempts
- Secure OTP generation (SecureRandom)

## Cost Estimation

**Twilio Pricing (India):**
- SMS: $0.0079 per message (~₹0.65)
- Phone lookup: $0.005 per lookup (~₹0.42)

**Monthly estimate for 1000 users:**
- 1000 OTP sends = $7.90/month
- 1000 validations = $5/month
- **Total: ~$13/month**

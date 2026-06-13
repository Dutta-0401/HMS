import crypto from 'crypto-js'

// PayU credentials — MUST be set via environment variables.
// Never hard-code the SALT: it is a signing secret. If it leaks, attackers
// can forge payment hashes for arbitrary amounts.
const PAYU_MID = import.meta.env.VITE_PAYU_MID
const PAYU_SALT = import.meta.env.VITE_PAYU_SALT

if (!PAYU_MID || !PAYU_SALT) {
  // Fail loudly in development so misconfiguration is caught early.
  // In production the payment buttons will be disabled (see initiatePayUCheckout).
  console.error(
    '[PayU] VITE_PAYU_MID and VITE_PAYU_SALT environment variables are required. ' +
    'Payment functionality is disabled until they are set.'
  )
}
const PAYU_TEST_URL = 'https://test.payumoney.com/mweb/'
const PAYU_PROD_URL = 'https://secure.payumoney.com/mweb/'

// Use mock mode by default for development (set VITE_PAYU_MOCK=false to use real PayU)
const PAYU_MOCK_MODE = import.meta.env.VITE_PAYU_MOCK !== 'false'

// Use test URL by default
const PAYU_URL = import.meta.env.VITE_PAYU_ENV === 'production' ? PAYU_PROD_URL : PAYU_TEST_URL

/**
 * Generate PayU hash for payment authentication
 * Hash format: SHA512(salt|key|param1|param2|...)
 * PayU requires: hash = SHA512(salt + key + txnid + amount + productinfo + firstname + email)
 */
export const generatePayUHash = (txnId, amount, productInfo, firstName, email) => {
  if (!PAYU_SALT || !PAYU_MID) {
    throw new Error('Payment gateway is not configured. Contact support.')
  }
  const hashString = `${PAYU_SALT}|${PAYU_MID}|${txnId}|${amount}|${productInfo}|${firstName}|${email}`

  // Generate SHA512 hash using crypto-js
  const hash = crypto.SHA512(hashString).toString()
  return hash
}

/**
 * Initiate PayU payment checkout
 * In mock mode: Shows a test dialog and simulates payment
 * In real mode: Creates a form and submits it to PayU's hosted checkout page
 */
export const initiatePayUCheckout = (paymentDetails) => {
  if (!PAYU_MID || !PAYU_SALT) {
    throw new Error('Payment gateway is not configured. Contact support.')
  }
  const {
    txnId,
    amount,
    productInfo,
    firstName,
    email,
    phone,
    address,
    city,
    state,
    zipcode,
    country = 'India',
  } = paymentDetails

  // Generate hash
  const hash = generatePayUHash(txnId, amount, productInfo, firstName, email)

  // Mock mode: Simulate PayU checkout locally
  if (PAYU_MOCK_MODE) {
    return simulatePayUCheckout({
      txnId,
      amount,
      productInfo,
      firstName,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      country,
      hash,
    })
  }

  // Real mode: Create form and submit to PayU
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = PAYU_URL
  form.style.display = 'none'

  // Add required fields to form
  const fields = {
    key: PAYU_MID,
    txnid: txnId,
    amount: amount,
    productinfo: productInfo,
    firstname: firstName,
    email: email,
    phone: phone,
    address1: address || '',
    city: city || '',
    state: state || '',
    zipcode: zipcode || '',
    country: country,
    hash: hash,
    surl: `${window.location.origin}/book-success`, // Success redirect URL
    furl: `${window.location.origin}/book-failed`, // Failure redirect URL
    service_provider: 'payu_paisa',
  }

  // Append fields to form
  Object.keys(fields).forEach((key) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = fields[key]
    form.appendChild(input)
  })

  // Append form to body and submit
  document.body.appendChild(form)
  form.submit()
}

/**
 * Simulate PayU checkout for local development/testing
 * Shows a dialog for user to approve/reject payment
 */
const simulatePayUCheckout = (paymentDetails) => {
  const { txnId, amount, firstName, email } = paymentDetails

  // Create a simple modal for testing
  const userChoice = window.confirm(
    `🧪 PayU Mock Mode (Test)\n\nTransaction ID: ${txnId}\nAmount: ₹${amount}\nName: ${firstName}\nEmail: ${email}\n\nClick OK to simulate successful payment, or Cancel to simulate failure.`
  )

  if (userChoice) {
    // Simulate success: redirect to success page after a short delay
    setTimeout(() => {
      const successParams = new URLSearchParams({
        status: 'success',
        txnid: txnId,
        amount: amount,
        firstname: firstName,
        email: email,
        productinfo: paymentDetails.productInfo,
        hash: paymentDetails.hash,
      })
      window.location.href = `${window.location.origin}/book-success?${successParams.toString()}`
    }, 1000)
  } else {
    // Simulate failure: redirect to failure page after a short delay
    setTimeout(() => {
      const failureParams = new URLSearchParams({
        status: 'failed',
        txnid: txnId,
        amount: amount,
        firstname: firstName,
        email: email,
        error: 'Payment declined in mock mode',
      })
      window.location.href = `${window.location.origin}/book-failed?${failureParams.toString()}`
    }, 1000)
  }
}

/**
 * Payment response verification MUST happen server-side.
 * The client cannot verify a hash when the SALT lives in the same JS bundle —
 * an attacker can read the SALT and forge any response hash they like.
 *
 * Pass the raw PayU callback params to POST /api/payments/verify on your
 * backend, which holds the SALT in a secure environment variable and returns
 * { verified: true, appointmentId } or an error.
 *
 * @deprecated Do not call this function. It is a no-op kept only to avoid
 *             breaking any existing callers while the backend endpoint is wired up.
 */
export const verifyPayUResponse = (_response) => {
  console.error(
    '[PayU] verifyPayUResponse() called on the client. ' +
    'Payment verification must be performed server-side. This call is a no-op.'
  )
  return false
}

export default {
  generatePayUHash,
  initiatePayUCheckout,
  verifyPayUResponse,
  PAYU_MID,
  PAYU_URL,
}

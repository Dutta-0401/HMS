import api from './api'

/**
 * Initiate a PayU payment by asking the backend to generate the signed hash.
 *
 * The SALT never leaves the server — the browser receives a ready-to-submit set
 * of form fields with a pre-computed SHA-512 hash.  If the server is running in
 * mock mode it returns { mockMode: true } and we show a local test dialog instead.
 *
 * @param {object} opts
 * @param {string} opts.appointmentId  - Server-issued appointment ID
 * @param {string} opts.firstName      - Payer's first name
 * @param {string} opts.email          - Payer's email
 * @param {string} opts.phone          - Payer's phone (digits only)
 */
export async function initiatePayUCheckout({ appointmentId, firstName, email, phone }) {
  // Ask the backend to sign the payment. Amount is read from the DB server-side —
  // the client never supplies or touches it.
  const { data } = await api.post('/payments/initiate', {
    appointmentId,
    firstName,
    email,
    phone,
  })

  if (data.mockMode) {
    return simulateMockCheckout(data)
  }

  // Real mode: build a hidden form with the server-supplied fields and submit it.
  submitPayUForm(data)
}

/**
 * Build and auto-submit a PayU-compatible HTML form.
 *
 * surl/furl point at the BACKEND callback, not the SPA: PayU returns the
 * shopper with an HTTP POST carrying form fields, which a static host
 * (Vercel) rejects. The backend verifies the response hash and 302-redirects
 * to /book-success or /book-failed with query params. surl/furl are not part
 * of the signed hash, so adding them client-side is safe.
 */
function submitPayUForm(data) {
  const apiBase = api.defaults.baseURL || ''
  const backendBase = apiBase.replace(/\/api\/?$/, '')
  const callbackUrl = `${backendBase}/api/payments/callback`
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = data.payuUrl
  form.style.display = 'none'

  const fields = {
    key: data.key,
    txnid: data.txnid,
    amount: data.amount,
    productinfo: data.productinfo,
    firstname: data.firstname,
    email: data.email,
    phone: data.phone,
    hash: data.hash,
    surl: callbackUrl,
    furl: callbackUrl,
    service_provider: 'payu_paisa',
  }

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}

/**
 * Mock checkout used when the server returns mockMode: true.
 * Shows a browser dialog so developers can test the full booking flow
 * without real PayU credentials.
 */
function simulateMockCheckout(data) {
  const ok = window.confirm(
    `PayU Mock Mode\n\nTransaction: ${data.txnid}\nAmount: ₹${data.amount}\nName: ${data.firstname}\nEmail: ${data.email}\n\nOK = success   Cancel = failure`
  )

  const params = new URLSearchParams(
    ok
      ? { status: 'success', txnid: data.txnid, amount: data.amount,
          firstname: data.firstname, email: data.email, productinfo: data.productinfo }
      : { status: 'failed', txnid: data.txnid, amount: data.amount,
          firstname: data.firstname, email: data.email, error: 'Declined in mock mode' }
  )

  const dest = ok ? '/book-success' : '/book-failed'
  setTimeout(() => {
    window.location.href = `${window.location.origin}${dest}?${params}`
  }, 800)
}

/**
 * @deprecated Client-side hash verification is insecure — the SALT would have to
 * be in the browser bundle for this to work, defeating its purpose.
 * Verification is handled server-side by POST /api/payments/verify (to be wired up).
 */
export function verifyPayUResponse(_response) {
  console.error('[PayU] verifyPayUResponse() is a no-op. Verify payments server-side.')
  return false
}

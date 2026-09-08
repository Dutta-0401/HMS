const QUICK_REPLIES = [
  'Book an appointment',
  'Find a doctor',
  'Hospital locations',
  'Emergency services',
  'Insurance accepted',
  'View my bookings',
];

const KNOWLEDGE_BASE = {
  greeting: [
    'Hello! Welcome to CityHealth. How can I help you today?',
    'Hi there! I\'m your CityHealth assistant. What can I do for you?',
    'Welcome! Need help with appointments, doctors, or hospital info?',
  ],
  appointment: [
    'You can book appointments by browsing hospitals on our website, selecting a doctor, and choosing an available time slot. Would you like me to guide you?',
    'To book an appointment: 1) Go to Hospitals page, 2) Select a hospital, 3) Choose a doctor, 4) Pick a time slot. Need help finding a specific specialist?',
  ],
  doctor: [
    'We have doctors across 20+ specialties including Cardiology, Neurology, Orthopedics, Pediatrics, and more. You can filter by specialty on the Hospitals page.',
    'To find a doctor: Visit the Hospitals page, click on a hospital, then browse their doctors by specialty. Each doctor profile shows experience, ratings, and available slots.',
  ],
  location: [
    'CityHealth has 15+ partner hospitals across the city. You can view all locations on the Hospitals page with addresses, contact info, and directions.',
    'Our main hospitals are in Downtown, Midtown, Uptown, and the Medical District. Each location page shows the exact address and map.',
  ],
  emergency: [
    'For medical emergencies, call 108 immediately or visit the nearest ER. Our partner hospitals have 24/7 emergency departments.',
    'Emergency: Dial 108 for ambulance. Our hospitals\' ERs are open 24/7 with trauma specialists on duty.',
  ],
  insurance: [
    'We accept most major insurance providers including BlueCross, Aetna, Cigna, UnitedHealth, and Medicare/Medicaid. Coverage varies by hospital and plan.',
    'Insurance acceptance varies by hospital. Check the hospital detail page or call our billing department for specific plan verification.',
  ],
  booking: [
    'You can view your upcoming appointments in the Profile section after logging in. You\'ll also receive email/SMS confirmations.',
    'Your bookings are in Profile > My Appointments. You can reschedule or cancel up to 2 hours before your appointment.',
  ],
  default: [
    'I can help with appointments, finding doctors, hospital locations, emergency info, insurance, and your bookings. What would you like to know?',
    'Try asking about: booking appointments, finding specialists, hospital locations, emergency services, or insurance coverage.',
  ],
};

function getRandomResponse(category) {
  const responses = KNOWLEDGE_BASE[category] || KNOWLEDGE_BASE.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

function categorizeMessage(message) {
  const msg = message.toLowerCase();

  if (msg.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return 'greeting';
  }
  if (msg.match(/\b(appointment|book|schedule|slot|time)\b/)) {
    return 'appointment';
  }
  if (msg.match(/\b(doctor|physician|specialist|surgeon|cardiologist|neurologist|pediatrician|orthopedic|dermatologist|gynecologist)\b/)) {
    return 'doctor';
  }
  if (msg.match(/\b(location|address|where|hospital|branch|direction|map)\b/)) {
    return 'location';
  }
  if (msg.match(/\b(emergency|urgent|ambulance|er|trauma|108)\b/)) {
    return 'emergency';
  }
  if (msg.match(/\b(insurance|coverage|plan|provider|claim|medicare|medicaid)\b/)) {
    return 'insurance';
  }
  if (msg.match(/\b(booking|my appointment|upcoming|reschedule|cancel|view)\b/)) {
    return 'booking';
  }

  return 'default';
}

export async function getBotResponse(userMessage) {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));

  const category = categorizeMessage(userMessage);
  return getRandomResponse(category);
}

export function getQuickReplies() {
  return QUICK_REPLIES;
}

export function getWelcomeMessage() {
  return getRandomResponse('greeting');
}

// Guardrails for Fraud Detection
const fraudDetection = {
  // Flag transactions above a certain amount for review
  transactionAmountThreshold: 5000, // Amount in PHP
  // Flag transactions occurring outside of usual behavior patterns (e.g., time of day, frequency)
  behaviorPatternThreshold: {
    frequencyLimit: 3, // Number of similar transactions within 1 hour
    timeWindow: "24h", // Transaction behavior to be considered in the past 24 hours
  },
  // Track suspicious payee (new payee and high-risk locations)
  newPayeeThreshold: 1, // First-time transactions with a new payee
  suspiciousLocations: ["foreign", "high-risk"], // Locations flagged as risky (example: international transactions)
};

// Guardrails for AI-powered Alerts and Actions
const aiGuardrails = {
  // Set actions when high-risk transactions are detected
  highRiskActions: {
    pauseTransaction: true, // Pause high-risk transactions for manual review
    alertGuardian: true, // Send alerts to the guardian for approval
    alertBPI: true, // Notify BPI fraud team if no guardian response
  },

  // Define fraud detection feedback mechanism for improvement
  feedbackLoop: {
    // Capture incorrect flag cases to improve AI accuracy
    learnFromFalsePositives: true,
    learnFromFalseNegatives: true,
    minimumAccuracy: 95, // AI detection accuracy threshold for acceptance
  },

  // AI behavior adjustments (to minimize false positives)
  behaviorAdjustments: {
    learningPeriod: 30, // Period in days for learning user behavior
    personalizedAlerts: true, // Adapt alert thresholds to individual user behaviors
    minimizeInterruptions: true, // Reduce number of alerts for seniors with confirmed usage patterns
  },
};

// Guardrails for Privacy & Security
const privacyAndSecurity = {
  // Ensure no personal data leaves the app's secure environment
  dataPrivacy: {
    dataStorageLocation: "BPI secure cloud", // All user data is encrypted and stored in BPI’s secure cloud
    noExternalDataSharing: true, // No customer data ever leaves BPI’s system for AI processing
  },

  // Multi-layered authentication for high-risk actions
  authentication: {
    multiFactorAuthRequired: true, // Always require MFA for high-risk transactions
    biometricVerification: true, // Option for biometric verification for transaction confirmation
    otpVerification: true, // OTP (One-Time Password) sent for high-risk actions
  },
};

// Guardrails for Guardian System
const guardianGuardrails = {
  // Ensure that guardians are verified and accountable
  guardianVerification: {
    inBranchVerificationRequired: true, // Guardians must complete in-branch verification with valid ID
    guardianRole: "Limited", // Guardians only approve or deny high-risk transactions, no direct account changes
    realTimeAlerts: true, // Guardians are alerted immediately when a high-risk transaction is detected
  },
  // Handling situations where guardian approval is not received
  guardianFallback: {
    timeoutThreshold: 10, // Timeout in minutes for guardian approval
    fallbackAction: "blockTransaction", // Action if no approval is received within the timeout
  },
};

// Guardrails for User Experience & Accessibility
const userExperienceGuardrails = {
  // Prevent overwhelming users with too many alerts
  alertFrequencyControl: {
    maxAlertsPerDay: 3, // Limit the number of alerts per day to avoid over-notification
    customizableAlerts: true, // Allow seniors to adjust alert settings (e.g., high-priority only)
  },

  // Ensure accessibility for seniors
  accessibilityFeatures: {
    largeTextMode: true, // Enable large text mode for seniors with visual impairments
    voiceGuidance: true, // Implement voice-guided navigation in Kalasag mode
    simpleMode: true, // Switch to a simpler UI with essential banking features
  },

  // AI-driven behavioral feedback
  personalization: {
    adaptToUserPreferences: true, // AI adjusts to the user’s preferred transaction styles
    userComfortThreshold: 5, // The app learns user behavior and adjusts alerts after 5 interactions
  },
};

// Final Configuration Object
const kalasagGuardrails = {
  fraudDetection,
  aiGuardrails,
  privacyAndSecurity,
  guardianGuardrails,
  userExperienceGuardrails,
};

// Exporting guardrails configuration
module.exports = kalasagGuardrails;
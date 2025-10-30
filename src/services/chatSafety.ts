// Chat Safety & Content Moderation

const BLOCKED_PHRASES = [
  // Off-platform payment scams
  'pay off app',
  'pay outside',
  'western union',
  'moneygram',
  'cash app',
  'venmo me',
  'paypal friends',
  
  // Platform bypass attempts
  'telegram',
  'whatsapp only',
  'text me at',
  'call me at',
  'email me at',
  'dm me on',
  'add me on',
  
  // Suspicious keywords
  'nigerian prince',
  'inheritance',
  'bank transfer only',
  'wire transfer',
  'gift cards',
  'cryptocurrency',
  'bitcoin',
  
  // Urgent pressure tactics
  'act now',
  'limited time',
  'first come',
  'cash only',
  'no refunds',
];

const SUSPICIOUS_PATTERNS = [
  // Phone numbers (should use in-app WhatsApp request instead)
  /\+?\d{10,}/g,
  
  // Email addresses
  /[\w\.-]+@[\w\.-]+\.\w+/g,
  
  // URLs
  /https?:\/\/[^\s]+/g,
  
  // External platform usernames
  /@\w+/g,
];

export const checkMessageSafety = (message: string): {
  safe: boolean;
  warnings: string[];
  blocked: boolean;
} => {
  const warnings: string[] = [];
  let blocked = false;
  
  const lowerMessage = message.toLowerCase();
  
  // Check blocked phrases
  for (const phrase of BLOCKED_PHRASES) {
    if (lowerMessage.includes(phrase.toLowerCase())) {
      warnings.push(`Blocked phrase detected: "${phrase}"`);
      blocked = true;
    }
  }
  
  // Check suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(message)) {
      const matchType = pattern.source.includes('\\d') ? 'phone number' :
                       pattern.source.includes('@') ? 'contact info' :
                       pattern.source.includes('http') ? 'external link' : 'suspicious content';
      warnings.push(`Contains ${matchType}. Use in-app features instead.`);
    }
  }
  
  return {
    safe: !blocked,
    warnings,
    blocked,
  };
};

export const getSafetyMessage = (warnings: string[]): string => {
  return `⚠️ For your safety:\n\n${warnings.join('\n')}\n\nUse PawMatch's built-in features:\n• Request WhatsApp via profile\n• Schedule video calls in-app\n• Pay deposits through platform`;
};

// Auto-suggest safe alternatives
export const getSafeAlternative = (blockedPhrase: string): string => {
  const alternatives: { [key: string]: string } = {
    'whatsapp': 'Request WhatsApp number through their profile →',
    'telegram': 'Use PawMatch messaging for safety →',
    'email': 'Continue chatting here, then request contact →',
    'pay': 'Use PawMatch deposit system for protection →',
    'cash': 'Platform payments protect both buyer and seller →',
  };
  
  for (const [key, alt] of Object.entries(alternatives)) {
    if (blockedPhrase.toLowerCase().includes(key)) {
      return alt;
    }
  }
  
  return 'Please use PawMatch features for safety';
};

// Report reasons
export const REPORT_REASONS = [
  'Scam or fraud',
  'Inappropriate photos',
  'Animal welfare concern',
  'Fake listing',
  'Harassment',
  'Spam',
  'Trying to bypass platform',
  'Other',
];

// Trust score calculation
export const calculateTrustScore = (user: {
  has_verified_phone?: boolean;
  has_uploaded_papers?: boolean;
  has_vet_verification?: boolean;
  account_age_days?: number;
  successful_transactions?: number;
  reports_against?: number;
}): number => {
  let score = 50; // Base score
  
  if (user.has_verified_phone) score += 10;
  if (user.has_uploaded_papers) score += 15;
  if (user.has_vet_verification) score += 20;
  if (user.account_age_days && user.account_age_days > 30) score += 10;
  if (user.successful_transactions) score += Math.min(user.successful_transactions * 5, 30);
  if (user.reports_against) score -= user.reports_against * 10;
  
  return Math.max(0, Math.min(100, score));
};

export const getTrustBadge = (score: number): {
  label: string;
  color: string;
  icon: string;
} => {
  if (score >= 80) return { label: 'Verified Pro', color: '#34C759', icon: '✓' };
  if (score >= 60) return { label: 'Trusted', color: '#2F80ED', icon: '✓' };
  if (score >= 40) return { label: 'Member', color: '#FFC700', icon: '⭐' };
  return { label: 'New', color: '#9CA3AF', icon: '◯' };
};

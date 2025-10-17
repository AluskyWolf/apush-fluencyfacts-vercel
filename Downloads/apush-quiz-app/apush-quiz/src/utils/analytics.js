// src/utils/analytics.js
import { track } from '@vercel/analytics';

export const trackEvent = (eventName, properties = {}) => {
  try {
    track(eventName, properties);
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Quiz-specific analytics events
export const trackQuizStart = (subject, mode, unitCount, termCount) => {
  trackEvent('quiz_started', {
    subject, // 'apush', 'euro', 'world'
    mode, // 'identification', 'who', 'what', 'where', 'when', 'why'
    unitCount,
    termCount
  });
};

export const trackQuizComplete = (subject, mode, score, duration, questionCount) => {
  trackEvent('quiz_completed', {
    subject,
    mode,
    score: Math.round(score),
    duration,
    questionCount,
    scoreCategory: score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'average' : 'needs_improvement'
  });
};

export const trackQuizAbandoned = (subject, mode, questionNumber, totalQuestions) => {
  trackEvent('quiz_abandoned', {
    subject,
    mode,
    questionNumber,
    totalQuestions,
    completionRate: Math.round((questionNumber / totalQuestions) * 100)
  });
};

export const trackUnitSelection = (subject, selectedUnits, totalUnits) => {
  trackEvent('units_selected', {
    subject,
    selectedUnits: selectedUnits.length,
    totalUnits,
    selectionType: selectedUnits.length === totalUnits ? 'all' :
                   selectedUnits.length === 1 ? 'single' : 'multiple'
  });
};

export const trackQuestionAnswer = (subject, field, score, questionNumber) => {
  trackEvent('question_answered', {
    subject,
    field,
    score: Math.round(score * 100),
    questionNumber,
    scoreLevel: score >= 0.9 ? 'excellent' : score >= 0.75 ? 'very_good' :
                score >= 0.6 ? 'good' : score >= 0.4 ? 'partial' : 'poor'
  });
};

export const trackError = (errorType, errorMessage, subject = null, context = null) => {
  trackEvent('error_occurred', {
    errorType,
    errorMessage: String(errorMessage).substring(0, 100), // Limit message length
    subject,
    context
  });
};

export const trackUserEngagement = (action, subject, details = {}) => {
  trackEvent('user_engagement', {
    action, // 'retry_quiz', 'change_units', 'view_feedback', etc.
    subject,
    ...details
  });
};

// Helper to get current flag value
const getCurrentFlagValue = (flagKey) => {
  // Read from global window object where components store flag state
  switch (flagKey) {
    case 'shuffle-enabled':
      return window.__featureFlags?.[flagKey] ?? true;
    case 'flashcard-mode-enhanced':
      return window.__featureFlags?.[flagKey] ?? false;
    case 'advanced-unit-selection':
      return window.__featureFlags?.[flagKey] ?? false;
    default:
      return false;
  }
};

// Emit feature flags to DOM for Web Analytics to pick up
export const emitFeatureFlags = (flags) => {
  if (typeof window === 'undefined') return;

  let flagsElement = document.getElementById('vercel-flags');
  if (!flagsElement) {
    flagsElement = document.createElement('script');
    flagsElement.id = 'vercel-flags';
    flagsElement.type = 'application/json';
    document.head.appendChild(flagsElement);
  }

  // Convert flag array to object with values
  const flagsObj = {};
  flags.forEach(flagKey => {
    if (flagKey) {
      flagsObj[flagKey] = getCurrentFlagValue(flagKey);
    }
  });
  
  flagsElement.textContent = JSON.stringify(flagsObj);
};

export const trackWithFlags = (eventName, properties = {}, flags = []) => {
  // Emit flags to DOM first so Web Analytics can pick them up
  emitFeatureFlags(flags);

  // Track event - Web Analytics will automatically attach the flags
  track(eventName, properties);
};

// Enhanced tracking functions with flag support
export const trackQuizStartWithFlags = (subject, mode, unitCount, termCount, flags = []) => {
  trackWithFlags('quiz_start', {
    subject,
    mode,
    unit_count: unitCount,
    term_count: termCount
  }, flags);
};

export const trackQuizCompleteWithFlags = (subject, mode, score, duration, termCount, flags = []) => {
  trackWithFlags('quiz_complete', {
    subject,
    mode,
    score,
    duration,
    term_count: termCount
  }, flags);
};

export const trackUserEngagementWithFlags = (action, subject, metadata = {}, flags = []) => {
  trackWithFlags('user_engagement', {
    action,
    subject,
    ...metadata
  }, flags);
};
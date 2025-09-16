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




export const trackWithFlags = (eventName, properties = {}, flags = []) => {
  // Emit feature flags to DOM for client-side tracking
  if (typeof window !== 'undefined') {
    const flagsElement = document.getElementById('vercel-flags');
    if (flagsElement) {
      const currentFlags = JSON.parse(flagsElement.textContent || '{}');
      flags.forEach(flagKey => {
        // You'd get the actual flag value here
        currentFlags[flagKey] = getCurrentFlagValue(flagKey);
      });
      flagsElement.textContent = JSON.stringify(currentFlags);
    } else {
      // Create the flags element if it doesn't exist
      const newFlagsElement = document.createElement('script');
      newFlagsElement.id = 'vercel-flags';
      newFlagsElement.type = 'application/json';
      const flagsObj = {};
      flags.forEach(flagKey => {
        flagsObj[flagKey] = getCurrentFlagValue(flagKey);
      });
      newFlagsElement.textContent = JSON.stringify(flagsObj);
      document.head.appendChild(newFlagsElement);
    }
  }

  // Track with flags
  track(eventName, properties, { flags });
};

// Helper to get current flag value
const getCurrentFlagValue = (flagKey) => {
  // This would integrate with your feature flag provider
  // For now, we'll check localStorage or use defaults
  switch (flagKey) {
    case 'shuffle-enabled':
      return localStorage.getItem('shuffle-enabled') === 'true';
    case 'flashcard-mode-enhanced':
      return localStorage.getItem('flashcard-mode-enhanced') === 'true';
    case 'advanced-unit-selection':
      return localStorage.getItem('advanced-unit-selection') === 'true';
    default:
      return false;
  }
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

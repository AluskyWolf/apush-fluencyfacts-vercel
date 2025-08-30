// src/pages/euroTerms.js

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Check, X, Crown
} from 'lucide-react';
import termsData from '../data/euroTerms.js';
// Import the new analytics functions
import { trackQuizStart, trackQuizComplete, trackQuizAbandoned, trackUnitSelection, trackQuestionAnswer, trackError, trackUserEngagement } from '../utils/analytics';

// All the same helper functions as APUSH (reusing the same scoring logic)
const calculateStringSimilarity = (str1, str2) => {
  if (str1 === str2) return 1;
  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;
  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len2][len1]) / maxLen;
};

const defaultCompare = (a = '', b = '') => {
  const aNorm = a.trim().toLowerCase();
  const bNorm = b.trim().toLowerCase();
  if (!aNorm || !bNorm) return 0;
  if (aNorm === bNorm) return 1;
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) return 0.85;
  return calculateStringSimilarity(aNorm, bNorm);
};

const extractKeywords = (term = {}) => {
  if (Array.isArray(term.keywords) && term.keywords.length) return term.keywords;
  const text = `${term.term || ''} ${term.who || ''} ${term.what || ''} ${term.where || ''} ${term.when || ''} ${term.why || ''}`.toLowerCase();
  const words = text.split(/\W+/).filter(w => w.length > 3);
  return Array.from(new Set(words)).slice(0, 10);
};

const normalizeAnswer = (text) => {
  return text.toLowerCase().trim()
    // Normalize common date abbreviations
    .replace(/\bbce?\b/g, 'bc')
    .replace(/\bce\b/g, 'ad')
    .replace(/\bad\b/g, 'ad')
    // Normalize time references
    .replace(/\btoday\b/g, 'present')
    .replace(/\bnow\b/g, 'present')
    .replace(/\bcurrent\b/g, 'present')
    .replace(/\bpresent day\b/g, 'present')
    // European History specific normalizations
    .replace(/\bmiddle ages\b/g, 'medieval period')
    .replace(/\bdark ages\b/g, 'medieval period')
    .replace(/\brenaissance\b/g, 'renaissance period')
    .replace(/\breformation\b/g, 'reformation period')
    .replace(/\bcounter-reformation\b/g, 'counter reformation')
    .replace(/\benlightenment\b/g, 'enlightenment period')
    .replace(/\bindustrial revolution\b/g, 'industrial period')
    .replace(/\bfrench revolution\b/g, 'french revolutionary period')
    .replace(/\bnapoleonic era\b/g, 'napoleonic period')
    // Geographic normalizations
    .replace(/\bholy roman empire\b/g, 'hre')
    .replace(/\bbyzantine empire\b/g, 'byzantium')
    .replace(/\bottoman empire\b/g, 'ottoman')
    .replace(/\bhabsburg\b/g, 'habsburg dynasty')
    .replace(/\bbourbons\b/g, 'bourbon dynasty')
    // Remove extra spacing
    .replace(/\s+/g, ' ')
    .trim();
};

const isNonAnswer = (text) => {
  const cleaned = text.toLowerCase().trim();
  
  if (!cleaned || cleaned.length === 0) return true;
  
  const nonAnswers = [
    'idk', "i don't know", 'dont know', "don't know", 'dk', 'dunno',
    'i dunno', 'no idea', 'not sure', '???', '?', 'unknown', 'n/a', 'na',
    'nothing', 'none', 'blank', 'empty', 'skip', 'pass', 'help', 'uhh',
    'umm', 'uh', 'um', 'err', 'erm', 'hmm', 'hm'
  ];
  
  if (nonAnswers.includes(cleaned)) return true;
  if (cleaned.length === 1 && !/^[a-z]$/i.test(cleaned)) return true;
  if (/^[^\w\s]*$/.test(cleaned)) return true;
  if (/^(.)\1{2,}$/.test(cleaned)) return true;
  
  return false;
};

const meetsMinimumRequirements = (userAnswer, field, correctAnswer) => {
  const cleaned = userAnswer.toLowerCase().trim();
  const correctLength = String(correctAnswer).length;
  
  if (cleaned.length < 2) return false;
  
  switch (field) {
    case 'who':
      if (cleaned.length < 3) return false;
      if (cleaned.length === 1) return false;
      break;
    case 'what':
      if (cleaned.length < 4) return false;
      break;
    case 'where':
      if (cleaned.length < 3) return false;
      if (cleaned.length === 1) return false;
      break;
    case 'when':
      if (cleaned.length < 2) return false;
      if (/^\d$/.test(cleaned)) return false;
      break;
    case 'why':
      if (cleaned.length < 8) return false;
      break;
    default:
      if (cleaned.length < 3) return false;
  }
  
  if (correctLength > 30 && cleaned.length < 8) return false;
  if (correctLength > 50 && cleaned.length < 12) return false;
  if (!/[a-zA-Z]/.test(cleaned)) return false;
  
  return true;
};

const calculateSimilarityScore = (userAnswer, correctAnswer, keywords = [], field = null) => {
  if (!userAnswer || !correctAnswer) return 0;
  
  const userOriginal = String(userAnswer).trim();
  const userNormalized = normalizeAnswer(userOriginal);
  const correctNormalized = normalizeAnswer(String(correctAnswer));
  
  if (isNonAnswer(userOriginal)) return 0;
  
  if (!meetsMinimumRequirements(userOriginal, field, correctAnswer)) {
    const hasRelevantWord = keywords.some(keyword => 
      userNormalized.includes(keyword.toLowerCase())
    );
    return hasRelevantWord ? 0.1 : 0;
  }
  
  if (userNormalized === correctNormalized) return 1;
  
  const conceptualSimilarity = defaultCompare(userNormalized, correctNormalized);
  if (conceptualSimilarity >= 0.85) return Math.min(1, conceptualSimilarity + 0.1);
  
  const userTerms = userNormalized.split(/[,;&\-]+/).map(term => term.trim()).filter(term => term.length > 0);
  const correctTerms = correctNormalized.split(/[,;&\-]+/).map(term => term.trim()).filter(term => term.length > 0);
  
  const userWords = userNormalized.split(/\W+/).filter(word => word.length > 2);
  const correctWords = correctNormalized.split(/\W+/).filter(word => word.length > 2);
  
  if (correctTerms.length === 0 && correctWords.length === 0) return 0;
  
  let termScore = 0;
  if (correctTerms.length > 0) {
    let matchedCorrectTerms = 0;
    let totalTermSimilarity = 0;
    
    correctTerms.forEach(correctTerm => {
      let bestMatchScore = 0;
      userTerms.forEach(userTerm => {
        const similarity = defaultCompare(userTerm, correctTerm);
        bestMatchScore = Math.max(bestMatchScore, similarity);
      });
      
      if (bestMatchScore >= 0.6) {
        matchedCorrectTerms++;
        totalTermSimilarity += bestMatchScore;
      }
    });
    
    if (matchedCorrectTerms > 0) {
      const avgTermSimilarity = totalTermSimilarity / matchedCorrectTerms;
      termScore = (matchedCorrectTerms / correctTerms.length) * avgTermSimilarity;
    }
  }
  
  let wordScore = 0;
  if (correctWords.length > 0) {
    let matchedWords = 0;
    let totalWordSimilarity = 0;
    
    correctWords.forEach(correctWord => {
      let bestWordMatch = 0;
      userWords.forEach(userWord => {
        const similarity = defaultCompare(userWord, correctWord);
        bestWordMatch = Math.max(bestWordMatch, similarity);
      });
      
      if (bestWordMatch >= 0.7) {
        matchedWords++;
        totalWordSimilarity += bestWordMatch;
      }
    });
    
    if (matchedWords > 0) {
      const avgWordSimilarity = totalWordSimilarity / matchedWords;
      wordScore = (matchedWords / correctWords.length) * avgWordSimilarity * 0.8;
    }
  }
  
  let finalScore = Math.max(termScore, wordScore, conceptualSimilarity);
  
  // Enhanced date matching for European history
  if (field === 'when') {
    const userHasDate = /\d+.*?(?:bc|bce|ad|ce|present|today)|\d{4}|\d+s|century/i.test(userOriginal);
    const correctHasDate = /\d+.*?(?:bc|bce|ad|ce|present|today)|\d{4}|\d+s|century/i.test(String(correctAnswer));
    
    if (userHasDate && correctHasDate) {
      const userDates = userOriginal.toLowerCase().match(/\d+|bc|bce|ad|ce|present|today|century/g) || [];
      const correctDates = String(correctAnswer).toLowerCase().match(/\d+|bc|bce|ad|ce|present|today|century/g) || [];
      
      const normalizeDate = (date) => date.replace(/bce?/g, 'bc').replace(/today/g, 'present');
      const userDatesNorm = userDates.map(normalizeDate);
      const correctDatesNorm = correctDates.map(normalizeDate);
      
      let dateMatches = 0;
      userDatesNorm.forEach(userDate => {
        if (correctDatesNorm.includes(userDate)) {
          dateMatches++;
        }
      });
      
      if (dateMatches >= 1 && correctDatesNorm.length >= 1) {
        const dateScore = 0.8 + (dateMatches / Math.max(correctDatesNorm.length, userDatesNorm.length)) * 0.2;
        finalScore = Math.max(finalScore, dateScore);
      }
    }
  }
  
  // European History specific adjustments
  if (field === 'who') {
    const hasProperNoun = /\b[A-Z][a-z]+/.test(userOriginal);
    if (hasProperNoun && finalScore > 0.3) {
      finalScore = Math.min(1, finalScore + 0.1);
    }
    
    // Reward specificity for European figures, dynasties, etc.
    const specificGroups = ['habsburg', 'bourbon', 'tudor', 'stuart', 'valois', 'hohenzollern', 'romanov', 'medici', 'fugger'];
    const userHasSpecificGroup = specificGroups.some(group => 
      userNormalized.includes(group)
    );
    const correctHasGeneral = /dynasty|house|family|nobility|royalty|monarchy/i.test(String(correctAnswer));
    
    if (userHasSpecificGroup && correctHasGeneral && finalScore >= 0.4) {
      finalScore = Math.min(1, finalScore + 0.2);
    }
  }
  
  if (field === 'where') {
    const locationWords = ['france', 'england', 'spain', 'italy', 'germany', 'austria', 'russia', 'netherlands', 'poland', 'hungary', 'ottoman', 'europe', 'continent'];
    const hasLocation = locationWords.some(word => userNormalized.includes(word));
    if (hasLocation && finalScore > 0.3) {
      finalScore = Math.min(1, finalScore + 0.1);
    }
  }
  
  let keywordBonus = 0;
  keywords.forEach(keyword => {
    const k = String(keyword).toLowerCase().trim();
    if (k && k.length > 3) {
      if (userNormalized.includes(k) && correctNormalized.includes(k)) {
        keywordBonus += 0.03;
      }
    }
  });
  
  const lengthRatio = userOriginal.length / String(correctAnswer).length;
  let lengthPenalty = 0;
  
  if (lengthRatio < 0.2 && finalScore > 0.5) {
    lengthPenalty = Math.min(0.3, (0.2 - lengthRatio) * 1.5);
  }
  
  finalScore = Math.max(0, Math.min(1, finalScore + keywordBonus - lengthPenalty));
  
  if (userOriginal.length <= 3 && finalScore > 0.7) {
    finalScore = Math.min(0.7, finalScore);
  }
  
  return finalScore;
};

const getScoreLevel = (fraction, userAnswer = '', field = null) => {
  const userLength = String(userAnswer).trim().length;
  
  if (fraction === 0 && userLength <= 3) {
    return { 
      level: 'no answer', 
      color: '#991B1B', 
      bgColor: '#FEE2E2', 
      icon: <XCircle className="w-5 h-5" />,
      message: 'Please provide a meaningful answer.' 
    };
  }
  
  if (fraction >= 0.9) {
    return { 
      level: 'excellent', 
      color: '#10B981', 
      bgColor: '#D1FAE5', 
      icon: <CheckCircle className="w-5 h-5" />,
      message: 'Outstanding! You demonstrated comprehensive understanding.'
    };
  }
  
  if (fraction >= 0.75) {
    return { 
      level: 'very good', 
      color: '#059669', 
      bgColor: '#D1FAE5', 
      icon: <CheckCircle className="w-5 h-5" />,
      message: 'Very good! You captured the key concepts well.'
    };
  }
  
  if (fraction >= 0.6) {
    return { 
      level: 'good', 
      color: '#3B82F6', 
      bgColor: '#DBEAFE', 
      icon: <AlertCircle className="w-5 h-5" />,
      message: 'Good work! You got the main idea with some details.'
    };
  }
  
  if (fraction >= 0.4) {
    return { 
      level: 'partial', 
      color: '#F59E0B', 
      bgColor: '#FEF3C7', 
      icon: <AlertCircle className="w-5 h-5" />,
      message: 'Partially correct. You have some understanding but need more detail.'
    };
  }
  
  if (fraction >= 0.2) {
    return { 
      level: 'needs improvement', 
      color: '#DC2626', 
      bgColor: '#FEE2E2', 
      icon: <XCircle className="w-5 h-5" />,
      message: 'Your answer shows limited understanding. Please review this topic.'
    };
  }
  
  return { 
    level: 'incorrect', 
    color: '#991B1B', 
    bgColor: '#FEE2E2', 
    icon: <XCircle className="w-5 h-5" />,
    message: 'Incorrect. Please study this topic more thoroughly.'
  };
};

const loadTermsFromFile = async () => {
  try {
    if (!termsData) throw new Error('European History terms data not found.');
    const terms = Array.isArray(termsData) ? termsData : termsData.default || termsData.terms || [];
    if (!Array.isArray(terms) || terms.length === 0) throw new Error('European History terms data must be a non-empty array');
    return terms.map((term, index) => ({
      id: term.id || index + 1,
      unit: term.unit || 1,
      term: term.term || 'Unknown Term',
      who: term.who || '',
      what: term.what || '',
      where: term.where || '',
      when: term.when || '',
      why: term.why || '',
      keywords: extractKeywords(term)
    }));
  } catch (err) {
    console.error('Error loading European History terms:', err);
    return [];
  }
};

// To correctly handle the quiz completion event, we extract the results page into its own component.
// This allows us to use the useEffect hook safely.
const QuizResults = ({ subject, mode, questionScores, filtered, startTime, endTime, resetQuiz, startQuiz, getUnitSelectionDescription }) => {
  const totalQuestions = filtered.length;
  const totalPossibleScore = totalQuestions * (mode === 'identification' ? 5 : 1);
  const totalScore = Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
  const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;

  // Track quiz completion once when the component mounts
  useEffect(() => {
    trackQuizComplete(subject, mode, percentage, duration, totalQuestions);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-violet-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{duration}s</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
          <p className="text-gray-600 mb-2">You scored {totalScore.toFixed(1)} out of {totalPossibleScore} points</p>
          <p className="text-sm text-gray-500 mb-6">From {getUnitSelectionDescription()}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                trackUserEngagement('take_another_quiz', subject);
                resetQuiz();
              }} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <RotateCcw className="w-5 h-5 mr-2" />Take Another Quiz
            </button>
            <button 
              onClick={() => {
                trackUserEngagement('retry_same_quiz', subject, { mode, previousScore: percentage });
                startQuiz(mode);
              }} 
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Retry Same Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EUROTerms = () => {
  const [EUROTerms, setEUROTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState(new Set());
  const [previousFilteredLength, setPreviousFilteredLength] = useState(0);
  const [quizMode, setQuizMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionScores, setQuestionScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const terms = await loadTermsFromFile();
        setEUROTerms(terms);
        const allUnits = new Set(terms.map(term => term.unit));
        setSelectedUnits(allUnits);
      } catch (err) {
        // Track data loading errors
        trackError('data_load_error', err.message, 'euro', 'loadTermsFromFile');
        setError('Failed to load European History terms.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getFilteredTerms = () => {
    if (selectedUnits.size === 0) return [];
    return EUROTerms.filter(term => selectedUnits.has(term.unit));
  };
  
  const getAvailableUnits = () => [...new Set(EUROTerms.map(term => term.unit))].sort((a, b) => a - b);

  useEffect(() => {
    const filtered = getFilteredTerms();
    const currentFilteredLength = filtered.length;
    
    if (currentFilteredLength > 0 && previewIndex >= currentFilteredLength) {
      const lastPageIndex = Math.floor(Math.max(0, currentFilteredLength - 1) / 4) * 4;
      setPreviewIndex(lastPageIndex);
    }
    
    setPreviousFilteredLength(currentFilteredLength);
  }, [selectedUnits, EUROTerms]);

  const toggleUnit = (unit) => {
    setSelectedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unit)) {
        newSet.delete(unit);
      } else {
        newSet.add(unit);
      }
      
      // Track unit selection changes
      const availableUnits = getAvailableUnits();
      trackUnitSelection('euro', Array.from(newSet), availableUnits.length);
      
      return newSet;
    });
  };

  const selectAllUnits = () => {
    const allUnits = new Set(getAvailableUnits());
    setSelectedUnits(allUnits);
  };

  const clearAllUnits = () => {
    setSelectedUnits(new Set());
  };

  const startQuiz = (mode) => {
    const filtered = getFilteredTerms();
    if (filtered.length === 0) return;

    // Track quiz start event
    trackQuizStart('euro', mode, selectedUnits.size, filtered.length);

    setQuizMode(mode);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuestionScores({});
    setShowFeedback(false);
    setShowResult(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handleAnswer = (field, answer) => {
    const key = `${currentQuestion}-${field}`;
    setUserAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const submitAnswer = () => {
    const filtered = getFilteredTerms();
    const currentTerm = filtered[currentQuestion];
    const scores = {};
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    
    fields.forEach(field => {
      const key = `${currentQuestion}-${field}`;
      const userAnswer = userAnswers[key] || '';
      const correctAnswer = currentTerm[field] || '';
      const score = calculateSimilarityScore(userAnswer, correctAnswer, currentTerm.keywords, field);
      scores[key] = score;

      // Track individual question answers
      trackQuestionAnswer('euro', field, score, currentQuestion + 1);
    });

    setQuestionScores(prev => ({ ...prev, ...scores }));
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    const filtered = getFilteredTerms();
    if (currentQuestion < filtered.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setEndTime(Date.now());
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    // Track quiz abandonment if a quiz was in progress
    if (quizMode && !showResult) {
      const filtered = getFilteredTerms();
      trackQuizAbandoned('euro', quizMode, currentQuestion + 1, filtered.length);
    }

    setQuizMode(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuestionScores({});
    setShowFeedback(false);
    setShowResult(false);
    setStartTime(null);
    setEndTime(null);
    setPreviewIndex(0);
  };

  const modeStyles = {
    who: { gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", text: "text-blue-100", subtext: "text-blue-200" },
    what: { gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", text: "text-green-100", subtext: "text-green-200" },
    where: { gradient: "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700", text: "text-yellow-100", subtext: "text-yellow-200" },
    when: { gradient: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700", text: "text-red-100", subtext: "text-red-200" },
    why: { gradient: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700", text: "text-indigo-100", subtext: "text-indigo-200" }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
      <div className="text-xl font-medium text-gray-600">Loading European History Terms...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
      <div className="text-xl font-medium text-red-600">{error}</div>
    </div>
  );

  const availableUnits = getAvailableUnits();
  const filtered = getFilteredTerms();
  const currentTerm = filtered[currentQuestion];

  const getUnitSelectionDescription = () => {
    if (selectedUnits.size === 0) return 'No units selected';
    if (selectedUnits.size === availableUnits.length) return 'All units';
    const sortedUnits = Array.from(selectedUnits).sort((a, b) => a - b);
    if (sortedUnits.length <= 3) {
      return `Unit${sortedUnits.length > 1 ? 's' : ''} ${sortedUnits.join(', ')}`;
    }
    return `${sortedUnits.length} units selected`;
  };

  // Use the new Results component
  if (showResult) {
    return (
      <QuizResults
        subject="euro"
        mode={quizMode}
        questionScores={questionScores}
        filtered={filtered}
        startTime={startTime}
        endTime={endTime}
        resetQuiz={resetQuiz}
        startQuiz={startQuiz}
        getUnitSelectionDescription={getUnitSelectionDescription}
      />
    );
  }

  // Quiz interface
  if (quizMode && currentTerm) {
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    const progress = ((currentQuestion + 1) / filtered.length) * 100;

    return (
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" />Back to Menu
              </button>
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {filtered.length}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-purple-50 p-4 rounded-lg">{currentTerm.term}</h2>

            <div className="space-y-4">
              {fields.map(field => {
                const key = `${currentQuestion}-${field}`;
                const userAnswer = userAnswers[key] || '';
                const score = questionScores[key];
                const fieldLabels = { who: 'Who', what: 'What', where: 'Where', when: 'When', why: 'Why/Significance' };
                const scoreLevel = showFeedback ? getScoreLevel(score, userAnswer, field) : null;
                
                return (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{fieldLabels[field]}:</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => handleAnswer(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                      disabled={showFeedback}
                    />
                    {showFeedback && scoreLevel && (
                      <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: scoreLevel.bgColor }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Your Score:</span>
                          <div className="flex items-center">
                            {scoreLevel.icon}
                            <span className="ml-2 font-medium" style={{ color: scoreLevel.color }}>
                              {Math.round(score * 100)}% ({scoreLevel.level})
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Correct Answer:</strong> {currentTerm[field]}
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {scoreLevel.message}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-6">
              <div></div>
              {!showFeedback ? (
                <button onClick={submitAnswer} disabled={fields.every(field => !userAnswers[`${currentQuestion}-${field}`])} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Submit Answer
                </button>
              ) : (
                <button onClick={nextQuestion} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                  {currentQuestion < filtered.length - 1 ? 'Next Question' : 'View Results'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main menu
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">AP European History Terms Quiz</h1>
          </div>
          <p className="text-gray-600 text-lg">Master your AP European History terms with interactive quizzes</p>
        </div>

        {/* Unit selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Select Units</h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllUnits}
                className="text-sm px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                All
              </button>
              <button
                onClick={clearAllUnits}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
            {availableUnits.map(unit => {
              const isSelected = selectedUnits.has(unit);
              const unitTermCount = EUROTerms.filter(term => term.unit === unit).length;
              
              return (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div>Unit {unit}</div>
                  <div className={`text-xs ${isSelected ? 'text-purple-200' : 'text-gray-500'}`}>
                    {unitTermCount} terms
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {getUnitSelectionDescription()} • {filtered.length} total terms
              </span>
            </div>
          </div>
        </div>

        {/* Quiz modes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Quiz Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => startQuiz('identification')}
              disabled={filtered.length === 0}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-6 h-6 mr-2" />
                <span className="text-xl">Full Identification</span>
              </div>
              <div className="text-purple-100 text-sm">Answer all 5 W's for each term</div>
            </button>

            {Object.entries(modeStyles).map(([mode, styles]) => (
              <button
                key={mode}
                onClick={() => startQuiz(mode)}
                disabled={filtered.length === 0}
                className={`bg-gradient-to-r ${styles.gradient} disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100`}
              >
                <div className="text-xl mb-2">
                  {mode === 'who' && '👤'} 
                  {mode === 'what' && '📖'} 
                  {mode === 'where' && '🏰'} 
                  {mode === 'when' && '📅'} 
                  {mode === 'why' && '💡'} 
                  {' '}{mode.charAt(0).toUpperCase() + mode.slice(1)} Only
                </div>
                <div className={`${styles.subtext} text-sm`}>
                  Focus on {mode === 'why' ? 'significance' : mode} questions only
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              No terms available for the selected units. Please select at least one unit.
            </div>
          )}
        </div>

        {/* Preview Cards */}
        {filtered.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Cards</h2>
            <p className="text-gray-600 mb-4">Browse through the European History terms from your selected units:</p>
            
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setPreviewIndex(Math.max(0, previewIndex - 4))}
                disabled={previewIndex === 0}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Showing {previewIndex + 1}-{Math.min(previewIndex + 4, filtered.length)} of {filtered.length}
                </span>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.ceil(filtered.length / 4) }).map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      onClick={() => setPreviewIndex(pageIndex * 4)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(previewIndex / 4) === pageIndex 
                          ? 'bg-purple-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setPreviewIndex(Math.min(filtered.length - 4, previewIndex + 4))}
                disabled={previewIndex + 4 >= filtered.length}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.slice(previewIndex, previewIndex + 4).map((term, index) => (
                <div key={term.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-purple-600">{term.term}</h3>
                    {term.unit && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Unit {term.unit}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {term.who && (
                      <div>
                        <span className="font-medium text-blue-700">Who:</span>
                        <span className="text-gray-700 ml-1">{term.who.length > 60 ? `${term.who.substring(0, 60)}...` : term.who}</span>
                      </div>
                    )}
                    {term.what && (
                      <div>
                        <span className="font-medium text-green-700">What:</span>
                        <span className="text-gray-700 ml-1">{term.what.length > 60 ? `${term.what.substring(0, 60)}...` : term.what}</span>
                      </div>
                    )}
                    {term.where && (
                      <div>
                        <span className="font-medium text-yellow-700">Where:</span>
                        <span className="text-gray-700 ml-1">{term.where.length > 60 ? `${term.where.substring(0, 60)}...` : term.where}</span>
                      </div>
                    )}
                    {term.when && (
                      <div>
                        <span className="font-medium text-red-700">When:</span>
                        <span className="text-gray-700 ml-1">{term.when.length > 60 ? `${term.when.substring(0, 60)}...` : term.when}</span>
                      </div>
                    )}
                    {term.why && (
                      <div>
                        <span className="font-medium text-indigo-700">Why:</span>
                        <span className="text-gray-700 ml-1">{term.why.length > 60 ? `${term.why.substring(0, 60)}...` : term.why}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Jump to Random Cards */}
            <div className="mt-4 text-center">
              <button 
                onClick={() => setPreviewIndex(Math.floor(Math.random() * Math.max(1, filtered.length - 3)) / 4 * 4)}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Show Random Cards
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 inline mr-1" />
          Ready to quiz {filtered.length} European History terms from {getUnitSelectionDescription().toLowerCase()}
        </div>
      </div>
    </div>
  );
};

export default EUROTerms;
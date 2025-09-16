// src/pages/euroTerms.js

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Check, X, Crown, Shuffle
} from 'lucide-react';
import termsData from '../data/euroTerms.js';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
// Updated analytics imports
import {
  trackWithFlags,
  trackQuizStartWithFlags,
  trackQuizAbandoned,
  trackQuestionAnswer,
  trackError,
  trackUserEngagementWithFlags,
  trackUnitSelection
} from '../utils/analytics';

// String Similarity Helper Functions
const extractKeywords = (term = {}) => {
  if (Array.isArray(term.keywords) && term.keywords.length) return term.keywords;
  const text = `${term.term || ''} ${term.who || ''} ${term.what || ''} ${term.where || ''} ${term.when || ''} ${term.why || ''}`.toLowerCase();
  const words = text.split(/\W+/).filter(w => w.length > 3);
  return Array.from(new Set(words)).slice(0, 10);
};

//Shuffle Array
const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const loadTermsFromFile = async () => {
  try {
    if (!termsData) throw new Error('Terms data not found.');
    const terms = Array.isArray(termsData) ? termsData : termsData.default || termsData.terms || [];
    if (!Array.isArray(terms) || terms.length === 0) throw new Error('Terms data must be a non-empty array');
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
    console.error('Error loading terms:', err);
    return [];
  }
};

// Individual Flashcard Component
const Flashcard = ({ term, mode, isFlipped, onFlip }) => {
  const getFlashcardContent = () => {
    if (!isFlipped) {
      // Show the question side
      if (mode === 'all') {
        return (
          <div className="space-y-2 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">{term.term}</div>
            <div className="text-lg text-gray-600">What do you know about this term?</div>
            <div className="text-sm text-gray-500 mt-4">Click to reveal all information</div>
          </div>
        );
      } else {
        const fieldLabels = { 
          who: 'Who', 
          what: 'What', 
          where: 'Where', 
          when: 'When', 
          why: 'Why/Significance' 
        };
        return (
          <div className="text-center">
            <div className="text-xl text-gray-600 mb-4">{fieldLabels[mode]}?</div>
            <div className="text-3xl font-bold text-gray-800 mb-4">{term.term}</div>
            <div className="text-sm text-gray-500">Click to reveal the answer</div>
          </div>
        );
      }
    } else {
      // Show the answer side
      if (mode === 'all') {
        return (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-indigo-600 text-center mb-4">
              {term.term}
            </div>
            {term.who && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="font-bold text-blue-700">Who:</span>
                <span className="text-gray-700 ml-2">{term.who}</span>
              </div>
            )}
            {term.what && (
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="font-bold text-green-700">What:</span>
                <span className="text-gray-700 ml-2">{term.what}</span>
              </div>
            )}
            {term.where && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <span className="font-bold text-yellow-700">Where:</span>
                <span className="text-gray-700 ml-2">{term.where}</span>
              </div>
            )}
            {term.when && (
              <div className="bg-red-50 p-3 rounded-lg">
                <span className="font-bold text-red-700">When:</span>
                <span className="text-gray-700 ml-2">{term.when}</span>
              </div>
            )}
            {term.why && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <span className="font-bold text-indigo-700">Why:</span>
                <span className="text-gray-700 ml-2">{term.why}</span>
              </div>
            )}
          </div>
        );
      } else {
        const fieldValue = term[mode];
        const fieldLabels = { 
          who: 'Who', 
          what: 'What', 
          where: 'Where', 
          when: 'When', 
          why: 'Why/Significance' 
        };
        const fieldColors = {
          who: 'text-blue-700 bg-blue-50',
          what: 'text-green-700 bg-green-50', 
          where: 'text-yellow-700 bg-yellow-50',
          when: 'text-red-700 bg-red-50',
          why: 'text-indigo-700 bg-indigo-50'
        };
        
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-6">{term.term}</div>
            <div className={`p-4 rounded-lg ${fieldColors[mode]}`}>
              <div className="text-lg font-bold mb-2">{fieldLabels[mode]}:</div>
              <div className="text-lg text-gray-800">{fieldValue || 'No information available'}</div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div 
      onClick={onFlip}
      className="min-h-[300px] bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center justify-center"
    >
      <div className="w-full">
        {getFlashcardContent()}
      </div>
    </div>
  );
};

// Main Flashcard Mode Component
const FlashcardMode = ({ 
  filtered, 
  flashcardMode, 
  currentFlashcard, 
  setCurrentFlashcard, 
  isFlipped, 
  setIsFlipped, 
  setEndTime,      // Add this prop
  setShowResult,   // Add this prop
  onBack 
}) => {
  const currentTerm = filtered[currentFlashcard];
  const progress = ((currentFlashcard + 1) / filtered.length) * 100;
 
  const nextCard = () => {
    if (currentFlashcard < filtered.length - 1) {
      setCurrentFlashcard(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Complete flashcards
      setEndTime(Date.now());
      setShowResult(true);
    }
  };
  
  const prevCard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(prev => prev - 1);
      setIsFlipped(false);
    }
  };
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (!currentTerm) return null;

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={onBack} 
              className="text-gray-600 hover:text-gray-800 flex items-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />Back to Menu
            </button>
            <span className="text-sm text-gray-500">
              Card {currentFlashcard + 1} of {filtered.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Flashcard */}
          <div className="mb-6">
            <Flashcard 
              term={currentTerm}
              mode={flashcardMode}
              isFlipped={isFlipped}
              onFlip={flipCard}
            />
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-500 text-sm mb-6">
            {!isFlipped ? 'Click the card to reveal the answer' : 'Click the card to flip back'}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button 
              onClick={prevCard}
              disabled={currentFlashcard === 0}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              {flashcardMode === 'all' ? 'All Fields' : flashcardMode.charAt(0).toUpperCase() + flashcardMode.slice(1)} Mode
            </div>
            
            <button 
              onClick={nextCard}
              className="flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
            >
              {currentFlashcard < filtered.length - 1 ? 'Next' : 'Finish'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Flashcard Menu Buttons Component
const FlashcardMenuButtons = ({ startFlashcards, filtered }) => {
  const modeStyles = {
    who: { gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", text: "text-blue-100", subtext: "text-blue-200" },
    what: { gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", text: "text-green-100", subtext: "text-green-200" },
    where: { gradient: "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700", text: "text-yellow-100", subtext: "text-yellow-200" },
    when: { gradient: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700", text: "text-red-100", subtext: "text-red-200" },
    why: { gradient: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700", text: "text-indigo-100", subtext: "text-indigo-200" }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
        🃏 Flashcards
        <span className="ml-2 text-sm text-gray-500">(Click cards to flip and reveal answers)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button 
          onClick={() => startFlashcards('all')} 
          disabled={filtered.length === 0} 
          className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          <div className="text-lg mb-1">📚 All Fields</div>
          <div className="text-slate-100 text-sm">See complete term info</div>
        </button>
        {Object.entries(modeStyles).map(([mode, styles]) => (
          <button 
            key={mode} 
            onClick={() => startFlashcards(mode)} 
            disabled={filtered.length === 0} 
            className={`bg-gradient-to-r ${styles.gradient} disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100`}
          >
            <div className="text-lg mb-1">
              {mode === 'who' && '👤'} {mode === 'what' && '📖'} {mode === 'where' && '📍'} {mode === 'when' && '📅'} {mode === 'why' && '💡'} 
              {' '}{mode.charAt(0).toUpperCase() + mode.slice(1)}
            </div>
            <div className={`${styles.subtext} text-sm`}>
              Study {mode === 'why' ? 'significance' : mode} only
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { Flashcard, FlashcardMode, FlashcardMenuButtons };

const QuizResults = ({ 
  subject, 
  mode, 
  filtered, 
  startTime, 
  endTime, 
  resetQuiz, 
  startQuiz, 
  startFlashcards,  // Add this prop
  getUnitSelectionDescription 
}) => {
  const totalQuestions = filtered.length;
  const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;
  
  // Check if this was a flashcard mode
  const isFlashcardMode = mode && mode.startsWith('flashcard-');
  const actualMode = isFlashcardMode ? mode.replace('flashcard-', '') : mode;

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {isFlashcardMode ? 'Flashcards Complete!' : 'Quiz Complete!'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">
                {isFlashcardMode ? 'Terms Studied' : 'Questions Completed'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{duration}s</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            You {isFlashcardMode ? 'studied' : 'completed'} {totalQuestions} {isFlashcardMode ? 'terms' : 'questions'}
          </p>
          <p className="text-sm text-gray-500 mb-6">From {getUnitSelectionDescription()}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                trackUserEngagementWithFlags('take_another_quiz', subject);
                resetQuiz();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <RotateCcw className="w-5 h-5 mr-2" />
              {isFlashcardMode ? 'Study More Terms' : 'Take Another Quiz'}
            </button>
            <button 
              onClick={() => {
                trackUserEngagementWithFlags('retry_same_quiz', subject, { mode });
                if (isFlashcardMode) {
                  startFlashcards(actualMode);
                } else {
                  startQuiz(actualMode);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              {isFlashcardMode ? 'Retry Same Flashcards' : 'Retry Same Quiz'}
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
  const [currentQuestion, setCurrentQuestion] = useState(0); // ADD THIS LINE - Missing state variable
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionScores, setQuestionScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [flashcardMode, setFlashcardMode] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(true); // NEW STATE FOR SHUFFLE TOGGLE

  // Emit shuffle-enabled flag to Vercel Analytics
  useEffect(() => {
    const flags = { 'shuffle-enabled': isShuffleEnabled };
    let flagsElement = document.getElementById('vercel-flags');
    if (!flagsElement) {
      flagsElement = document.createElement('script');
      flagsElement.id = 'vercel-flags';
      flagsElement.type = 'application/json';
      document.head.appendChild(flagsElement);
    }
    flagsElement.textContent = JSON.stringify(flags);
  }, [isShuffleEnabled]);

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

  const toggleShuffle = () => {
    const newState = !isShuffleEnabled;
    setIsShuffleEnabled(newState);
    trackWithFlags(
      'feature_flag_toggle',
      {
        flag_name: 'shuffle-enabled',
        new_value: newState,
        old_value: isShuffleEnabled
      },
      [newState ? 'shuffle-enabled' : null].filter(Boolean)
    );
  };

  // UPDATED FUNCTION: Only shuffle if enabled
  const prepareTermsForStudy = (filtered) => {
    return isShuffleEnabled ? shuffleArray(filtered) : [...filtered];
  };

  const startQuiz = (mode) => {
    const filtered = getFilteredTerms();
    if (filtered.length === 0) return;
    
    const orderedTerms = prepareTermsForStudy(filtered);
    setShuffledTerms(orderedTerms);
    
    const activeFlags = [isShuffleEnabled ? 'shuffle-enabled' : null].filter(Boolean);
    trackQuizStartWithFlags('euro', mode, selectedUnits.size, orderedTerms.length, activeFlags);
    setQuizMode(mode);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowFeedback(false);
    setShowResult(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const startFlashcards = (mode) => {
    const filtered = getFilteredTerms();
    if (filtered.length === 0) return;
    
    const orderedTerms = prepareTermsForStudy(filtered);
    setShuffledTerms(orderedTerms);
    
    const activeFlags = [isShuffleEnabled ? 'shuffle-enabled' : null].filter(Boolean);
    trackQuizStartWithFlags('euro', `flashcard-${mode}`, selectedUnits.size, orderedTerms.length, activeFlags);
    setFlashcardMode(mode);
    setCurrentFlashcard(0);
    setIsFlipped(false);
  };

  const handleAnswer = (field, answer) => {
    const key = `${currentQuestion}-${field}`;
    setUserAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const submitAnswer = () => {
    const currentTerm = shuffledTerms[currentQuestion];
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    
    fields.forEach(field => {
      trackQuestionAnswer('euro', field, null, currentQuestion + 1);
    });

    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledTerms.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setEndTime(Date.now());
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    if (quizMode && !showResult) {
      const termsToUse = shuffledTerms.length > 0 ? shuffledTerms : getFilteredTerms();
      trackQuizAbandoned('euro', quizMode, currentQuestion + 1, termsToUse.length);
    }
    if (flashcardMode) {
      const termsToUse = shuffledTerms.length > 0 ? shuffledTerms : getFilteredTerms();
      trackQuizAbandoned('euro', `flashcard-${flashcardMode}`, currentFlashcard + 1, termsToUse.length);
    }
    setQuizMode(null);
    setFlashcardMode(null);
    setShuffledTerms([]); // Clear shuffled terms
    setCurrentQuestion(0);
    setCurrentFlashcard(0);
    setIsFlipped(false);
    setUserAnswers({});
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
        mode={quizMode || `flashcard-${flashcardMode}`}
        filtered={shuffledTerms.length > 0 ? shuffledTerms : filtered}
        startTime={startTime}
        endTime={endTime}
        resetQuiz={resetQuiz}
        startQuiz={startQuiz}
        startFlashcards={startFlashcards}  // Add this line
        getUnitSelectionDescription={getUnitSelectionDescription}
      />
    );
  }

  if (flashcardMode) {
    return (
      <FlashcardMode
        filtered={shuffledTerms.length > 0 ? shuffledTerms : filtered}
        flashcardMode={flashcardMode}
        currentFlashcard={currentFlashcard}
        setCurrentFlashcard={setCurrentFlashcard}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        setEndTime={setEndTime}  // Add this
        setShowResult={setShowResult}  // Add this
        onBack={resetQuiz}
      />
    );
  }
  // Quiz interface
  if (quizMode && shuffledTerms.length > 0) {
    const currentTerm = shuffledTerms[currentQuestion];
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    const progress = ((currentQuestion + 1) / shuffledTerms.length) * 100;
  
    return (
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Keep existing header and progress bar */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" />Back to Menu
              </button>
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {shuffledTerms.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-indigo-50 p-4 rounded-lg">{currentTerm.term}</h2>
            
            <div className="space-y-4">
              {fields.map(field => {
                const key = `${currentQuestion}-${field}`;
                const userAnswer = userAnswers[key] || '';
                const fieldLabels = { who: 'Who', what: 'What', where: 'Where', when: 'When', why: 'Why/Significance' };
                
                return (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{fieldLabels[field]}:</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => handleAnswer(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                      disabled={showFeedback}
                    />
                    {/* SIMPLIFIED feedback - just show correct answer */}
                    {showFeedback && (
                      <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-sm text-gray-700">
                          <strong>Correct Answer:</strong> {currentTerm[field]}
                        </div>
                        {userAnswer.trim() && (
                          <div className="text-sm text-gray-600 mt-1">
                            <strong>Your Answer:</strong> {userAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Keep existing navigation buttons */}
            <div className="flex justify-between mt-6">
              <div></div>
              {!showFeedback ? (
                <button onClick={submitAnswer} disabled={fields.every(field => !userAnswers[`${currentQuestion}-${field}`])} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Submit Answer
                </button>
              ) : (
                <button onClick={nextQuestion} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                  {currentQuestion < shuffledTerms.length - 1 ? 'Next Question' : 'Complete Quiz'}
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
          <p className="text-gray-600 text-lg">Master your AP European History terms with quizzes and Flashcards</p>
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

       {/* Study Modes */}
<div className="bg-white rounded-lg shadow-lg p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Study Mode</h2>
    <div className="flex items-center space-x-3">
      <Shuffle className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">Shuffle</span>
      <button
        onClick={toggleShuffle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isShuffleEnabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isShuffleEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  </div>

  
    {/* Flashcards Section */}
  <div className="mb-8">
    <FlashcardMenuButtons 
      startFlashcards={startFlashcards} 
      filtered={filtered} 
    />
  </div>

  {/* Quiz Section */}
  <div>
    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
      ✏️ Practice Quiz
      <span className="ml-2 text-sm text-gray-500">(Test your knowledge with written answers)</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        onClick={() => startQuiz('identification')}
        disabled={filtered.length === 0}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
      >
        <div className="flex items-center justify-center mb-2">
          🎯
          <span className="text-xl ml-2">Full Identification</span>
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
          <div className="text-xl mb-2 flex items-center justify-center">
            {mode === 'who' && '👤'} 
            {mode === 'what' && '📖'} 
            {mode === 'where' && '📍'} 
            {mode === 'when' && '📅'} 
            {mode === 'why' && '💡'} 
            <span className="ml-2">{mode.charAt(0).toUpperCase() + mode.slice(1)} Quiz</span>
          </div>
          <div className={`${styles.subtext} text-sm`}>
            Quiz {mode === 'why' ? 'significance' : mode} questions only
          </div>
        </button>
      ))}
    </div>
  </div>
  {/* Warning when no terms available */}
  {filtered.length === 0 && (
    <div className="text-center text-gray-500 mt-6">
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
                          <span className="text-gray-700 ml-1">{term.who}</span>
                        </div>
                      )}
                      {term.what && (
                        <div>
                          <span className="font-medium text-green-700">What:</span>
                          <span className="text-gray-700 ml-1">{term.what}</span>
                        </div>
                      )}
                      {term.where && (
                        <div>
                          <span className="font-medium text-yellow-700">Where:</span>
                          <span className="text-gray-700 ml-1">{term.where}</span>
                        </div>
                      )}
                      {term.when && (
                        <div>
                          <span className="font-medium text-red-700">When:</span>
                          <span className="text-gray-700 ml-1">{term.when}</span>
                        </div>
                      )}
                      {term.why && (
                        <div>
                          <span className="font-medium text-indigo-700">Why:</span>
                          <span className="text-gray-700 ml-1">{term.why}</span>
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
          {isShuffleEnabled ? ' (shuffled)' : ' (original order)'}
        </div>
       </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default EUROTerms;
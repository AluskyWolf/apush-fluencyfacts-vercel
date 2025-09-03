import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { trackQuizStart, trackQuizComplete, trackQuizAbandoned, trackUnitSelection, trackQuestionAnswer, trackError, trackUserEngagement } from '../utils/analytics';

import termsData from '../data/apushTerms.js';

// String Similarity Helper Functions
const extractKeywords = (term = {}) => {
  if (Array.isArray(term.keywords) && term.keywords.length) return term.keywords;
  const text = `${term.term || ''} ${term.who || ''} ${term.what || ''} ${term.where || ''} ${term.when || ''} ${term.why || ''}`.toLowerCase();
  const words = text.split(/\W+/).filter(w => w.length > 3);
  return Array.from(new Set(words)).slice(0, 10);
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

const QuizResults = ({ subject, mode, filtered, startTime, endTime, resetQuiz, startQuiz, getUnitSelectionDescription }) => {
  const totalQuestions = filtered.length;
  const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;

  useEffect(() => {
    // Remove scoring parameters from analytics
    trackQuizComplete(subject, mode, null, duration, totalQuestions);
  }, []);

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions Completed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{duration}s</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
          <p className="text-gray-600 mb-2">You completed {totalQuestions} questions</p>
          <p className="text-sm text-gray-500 mb-6">From {getUnitSelectionDescription()}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                trackUserEngagement('take_another_quiz', subject);
                resetQuiz();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <RotateCcw className="w-5 h-5 mr-2" />Take Another Quiz
            </button>
            <button 
              onClick={() => {
                trackUserEngagement('retry_same_quiz', subject, { mode });
                startQuiz(mode);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Retry Same Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const APUSHTerms = () => {
  const [apushTerms, setApushTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState(new Set());
  const [previousFilteredLength, setPreviousFilteredLength] = useState(0);
  const [quizMode, setQuizMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const terms = await loadTermsFromFile();
        setApushTerms(terms);
        const allUnits = new Set(terms.map(term => term.unit));
        setSelectedUnits(allUnits);
      } catch (err) {
        trackError('data_load_error', err.message, 'apush', 'loadTermsFromFile');
        setError('Failed to load APUSH terms.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getFilteredTerms = () => {
    if (selectedUnits.size === 0) return [];
    return apushTerms.filter(term => selectedUnits.has(term.unit));
  };
  
  const getAvailableUnits = () => [...new Set(apushTerms.map(term => term.unit))].sort((a, b) => a - b);

  useEffect(() => {
    const filtered = getFilteredTerms();
    const currentFilteredLength = filtered.length;
    if (currentFilteredLength > 0 && previewIndex >= currentFilteredLength) {
      const lastPageIndex = Math.floor(Math.max(0, currentFilteredLength - 1) / 4) * 4;
      setPreviewIndex(lastPageIndex);
    }
    setPreviousFilteredLength(currentFilteredLength);
  }, [selectedUnits, apushTerms]);

  const toggleUnit = (unit) => {
    setSelectedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unit)) {
        newSet.delete(unit);
      } else {
        newSet.add(unit);
      }
      const availableUnits = getAvailableUnits();
      trackUnitSelection('apush', Array.from(newSet), availableUnits.length);
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
    trackQuizStart('apush', mode, selectedUnits.size, filtered.length);
    setQuizMode(mode);
    setCurrentQuestion(0);
    setUserAnswers({});
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
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    fields.forEach(field => {
      trackQuestionAnswer('apush', field, null, currentQuestion + 1);
    });
    
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
    if (quizMode && !showResult) {
      const filtered = getFilteredTerms();
      trackQuizAbandoned('apush', quizMode, currentQuestion + 1, filtered.length);
    }
    setQuizMode(null);
    setCurrentQuestion(0);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-xl font-medium text-gray-600">Loading APUSH Terms...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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

  if (showResult) {
    return (
      <QuizResults
        subject="apush"
        mode={quizMode}
        filtered={filtered}
        startTime={startTime}
        endTime={endTime}
        resetQuiz={resetQuiz}
        startQuiz={startQuiz}
        getUnitSelectionDescription={getUnitSelectionDescription}
      />
    );
  }

  if (quizMode && currentTerm) {
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    const progress = ((currentQuestion + 1) / filtered.length) * 100;
    
    return (
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Keep existing header and progress bar */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" />Back to Menu
              </button>
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {filtered.length}</span>
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
                  {currentQuestion < filtered.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">APUSH Terms Quiz</h1>
            </div>
            <p className="text-gray-600 text-lg">Master your AP US History terms with interactive quizzes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Select Units</h2>
              <div className="flex gap-2">
                <button onClick={selectAllUnits} className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors flex items-center">
                  <Check className="w-4 h-4 mr-1" /> All
                </button>
                <button onClick={clearAllUnits} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center">
                  <X className="w-4 h-4 mr-1" /> Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
              {availableUnits.map(unit => {
                const isSelected = selectedUnits.has(unit);
                const unitTermCount = apushTerms.filter(term => term.unit === unit).length;
                return (
                  <button key={unit} onClick={() => toggleUnit(unit)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <div>Unit {unit}</div>
                    <div className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
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
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Quiz Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button onClick={() => startQuiz('identification')} disabled={filtered.length === 0} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100">
                <div className="text-xl mb-2">🎯 Full Identification</div>
                <div className="text-purple-100 text-sm">Answer all 5 W's for each term</div>
              </button>
              {Object.entries(modeStyles).map(([mode, styles]) => (
                <button key={mode} onClick={() => startQuiz(mode)} disabled={filtered.length === 0} className={`bg-gradient-to-r ${styles.gradient} disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100`}>
                  <div className="text-xl mb-2">
                    {mode === 'who' && '👤'} {mode === 'what' && '📖'} {mode === 'where' && '📍'} {mode === 'when' && '📅'} {mode === 'why' && '💡'} 
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

          {filtered.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Cards</h2>
              <p className="text-gray-600 mb-4">Browse through the APUSH terms from your selected units:</p>
              
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
                            ? 'bg-indigo-600' 
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
                      <h3 className="font-bold text-lg text-indigo-600">{term.term}</h3>
                      {term.unit && (
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
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
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setPreviewIndex(Math.floor(Math.random() * Math.max(1, filtered.length - 3)) / 4 * 4)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  🎲 Show Random Cards
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 inline mr-1" />
            Ready to quiz {filtered.length} APUSH terms from {getUnitSelectionDescription().toLowerCase()}
          </div>
        </div>
      </div>
      <Analytics />
    </>
  );
};

export default APUSHTerms;
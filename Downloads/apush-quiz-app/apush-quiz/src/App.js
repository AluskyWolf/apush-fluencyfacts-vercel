import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

import termsData from './terms.js';

// --------------------
// String Similarity Helper
// --------------------
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

const calculateSimilarityScore = (userAnswer, correctAnswer, keywords = []) => {
  if (!userAnswer || !correctAnswer) return 0;
  const userLower = String(userAnswer).toLowerCase().trim();
  const correctLower = String(correctAnswer).toLowerCase().trim();
  
  // If exact match (ignoring case), return perfect score
  if (userLower === correctLower) return 1;
  
  // Split both answers into individual terms/phrases
  const userTerms = userLower.split(/[,;]+/).map(term => term.trim()).filter(term => term.length > 0);
  const correctTerms = correctLower.split(/[,;]+/).map(term => term.trim()).filter(term => term.length > 0);
  
  // Calculate token-based similarity
  let tokenScore = 0;
  let matchedTerms = 0;
  
  userTerms.forEach(userTerm => {
    let bestMatch = 0;
    correctTerms.forEach(correctTerm => {
      const similarity = defaultCompare(userTerm, correctTerm);
      bestMatch = Math.max(bestMatch, similarity);
    });
    // Consider it a match if similarity is above 0.6
    if (bestMatch > 0.6) {
      matchedTerms++;
      tokenScore += bestMatch;
    }
  });
  
  // Calculate percentage of terms matched
  const termCoverage = correctTerms.length > 0 ? matchedTerms / correctTerms.length : 0;
  const avgTokenScore = matchedTerms > 0 ? tokenScore / matchedTerms : 0;
  
  // Combine term coverage with average token similarity
  let finalScore = (termCoverage * 0.7) + (avgTokenScore * 0.3);
  
  // Add keyword bonus for additional context
  let keywordBonus = 0;
  keywords.forEach(keyword => {
    const k = String(keyword).toLowerCase();
    if (k && k.length > 3 && userLower.includes(k) && correctLower.includes(k)) {
      keywordBonus += 0.05;
    }
  });
  
  // Also check for partial string inclusion as backup
  const inclusionScore = Math.max(
    userLower.includes(correctLower) ? 0.9 : 0,
    correctLower.includes(userLower) ? 0.8 : 0
  );
  
  // Take the best of token-based score, inclusion score, or original similarity
  const originalSimilarity = defaultCompare(userLower, correctLower);
  finalScore = Math.max(finalScore, inclusionScore, originalSimilarity);
  
  return Math.min(1, finalScore + keywordBonus);
};

const getScoreLevel = (fraction) => {
  if (fraction >= 0.8) return { level: 'excellent', color: '#10B981', bgColor: '#D1FAE5', icon: <CheckCircle className="w-5 h-5" /> };
  if (fraction >= 0.6) return { level: 'good', color: '#3B82F6', bgColor: '#DBEAFE', icon: <AlertCircle className="w-5 h-5" /> };
  if (fraction >= 0.4) return { level: 'partial', color: '#F59E0B', bgColor: '#FEF3C7', icon: <AlertCircle className="w-5 h-5" /> };
  return { level: 'needs work', color: '#EF4444', bgColor: '#FEE2E2', icon: <XCircle className="w-5 h-5" /> };
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

const App = () => {
  const [apushTerms, setApushTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUnit, setCurrentUnit] = useState('all');
  const [quizMode, setQuizMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionScores, setQuestionScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const terms = await loadTermsFromFile();
        setApushTerms(terms);
      } catch (err) {
        setError('Failed to load terms.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getFilteredTerms = () => currentUnit === 'all' ? apushTerms : apushTerms.filter(term => term.unit === parseInt(currentUnit));
  const getAvailableUnits = () => [...new Set(apushTerms.map(term => term.unit))].sort((a, b) => a - b);

  const startQuiz = (mode) => {
    const filtered = getFilteredTerms();
    if (filtered.length === 0) return;
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
      const score = calculateSimilarityScore(userAnswer, correctAnswer, currentTerm.keywords);
      scores[key] = score;
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
    setQuizMode(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuestionScores({});
    setShowFeedback(false);
    setShowResult(false);
    setStartTime(null);
    setEndTime(null);
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
      <div className="text-xl font-medium text-gray-600">Loading...</div>
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

  // Results page
  if (showResult) {
    const totalQuestions = filtered.length;
    const totalPossibleScore = totalQuestions * (quizMode === 'identification' ? 5 : 1);
    const totalScore = Object.values(questionScores).reduce((sum, score) => sum + score, 0);
    const percentage = Math.round((totalScore / totalPossibleScore) * 100);
    const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Complete! 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{duration}s</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">You scored {totalScore.toFixed(1)} out of {totalPossibleScore} points</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={resetQuiz} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <RotateCcw className="w-5 h-5 mr-2" />Take Another Quiz
              </button>
              <button onClick={() => startQuiz(quizMode)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Retry Same Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  if (quizMode && currentTerm) {
    const fields = quizMode === 'identification' ? ['who', 'what', 'where', 'when', 'why'] : [quizMode];
    const progress = ((currentQuestion + 1) / filtered.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" />Back to Menu
              </button>
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {filtered.length}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-indigo-50 p-4 rounded-lg">{currentTerm.term}</h2>

            {/* Answer fields */}
            <div className="space-y-4">
              {fields.map(field => {
                const key = `${currentQuestion}-${field}`;
                const userAnswer = userAnswers[key] || '';
                const score = questionScores[key];
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
                    {showFeedback && (
                      <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: getScoreLevel(score).bgColor }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Your Score:</span>
                          <div className="flex items-center">
                            {getScoreLevel(score).icon}
                            <span className="ml-2 font-medium" style={{ color: getScoreLevel(score).color }}>
                              {Math.round(score * 100)}% ({getScoreLevel(score).level})
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700"><strong>Correct Answer:</strong> {currentTerm[field]}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between mt-6">
              <div></div>
              {!showFeedback ? (
                <button onClick={submitAnswer} disabled={fields.every(field => !userAnswers[`${currentQuestion}-${field}`])} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">APUSH Terms Quiz</h1>
          </div>
          <p className="text-gray-600 text-lg">Master your AP US History terms with interactive quizzes</p>
        </div>

        {/* Unit selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Unit</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentUnit('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentUnit === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Units ({apushTerms.length} terms)
            </button>
            {availableUnits.map(unit => (
              <button
                key={unit}
                onClick={() => setCurrentUnit(unit.toString())}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentUnit === unit.toString()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unit {unit} ({apushTerms.filter(term => term.unit === unit).length} terms)
              </button>
            ))}
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
              <div className="text-xl mb-2">🎯 Full Identification</div>
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
                  {mode === 'where' && '📍'} 
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
              No terms available for the selected unit. Please select a different unit.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 inline mr-1" />
          Ready to quiz {filtered.length} terms from {currentUnit === 'all' ? 'all units' : `Unit ${currentUnit}`}
        </div>
      </div>
    </div>
  );
};

export default App;
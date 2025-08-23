// App.js
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

// Import your terms data - make sure the path is correct
import termsData from './terms.js'; // or './data/terms.js' depending on your structure

// --------------------
// String Similarity Helper (fallback if library not available)
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
        matrix[j - 1][i] + 1,     // deletion
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len2][len1]) / maxLen;
};

// --------------------
// Helpers
// --------------------
const defaultCompare = (a = '', b = '') => {
  const aNorm = a.trim().toLowerCase();
  const bNorm = b.trim().toLowerCase();
  if (!aNorm || !bNorm) return 0;
  if (aNorm === bNorm) return 1;
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) return 0.85;
  
  // Use our string similarity function
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
  const userLower = String(userAnswer).toLowerCase();
  const correctLower = String(correctAnswer).toLowerCase();

  // Base similarity score
  let similarity = defaultCompare(userLower, correctLower);

  // Keyword bonus
  let keywordBonus = 0;
  keywords.forEach(keyword => {
    const k = String(keyword).toLowerCase();
    if (k && userLower.includes(k) && correctLower.includes(k)) {
      keywordBonus += 0.08;
    }
  });

  // Concept synonyms for better matching
  const conceptSynonyms = {
    economic: ['economy', 'financial', 'money', 'trade', 'commerce', 'business', 'market'],
    political: ['government', 'politics', 'power', 'authority', 'state', 'federal'],
    social: ['society', 'people', 'community', 'culture', 'social', 'class'],
    revolutionary: ['revolution', 'revolt', 'rebellion', 'uprising', 'war', 'independence'],
    colonial: ['colony', 'colonist', 'settlement', 'colonial', 'colonies'],
    religious: ['religion', 'church', 'christian', 'faith', 'god', 'spiritual'],
    slavery: ['slave', 'enslaved', 'plantation', 'cotton', 'south', 'abolitionist'],
    industrial: ['industry', 'factory', 'manufacturing', 'technology', 'railroad'],
  };

  let conceptBonus = 0;
  Object.entries(conceptSynonyms).forEach(([concept, synonyms]) => {
    const userHas = synonyms.some(s => userLower.includes(s));
    const correctHas = synonyms.some(s => correctLower.includes(s)) || correctLower.includes(concept);
    if (userHas && correctHas) conceptBonus += 0.04;
  });

  return Math.min(1, similarity + keywordBonus + conceptBonus);
};

const getScoreLevel = (fraction) => {
  if (fraction >= 0.8) return { 
    level: 'excellent', 
    color: '#10B981', 
    bgColor: '#D1FAE5',
    icon: <CheckCircle className="w-5 h-5" /> 
  };
  if (fraction >= 0.6) return { 
    level: 'good', 
    color: '#3B82F6', 
    bgColor: '#DBEAFE',
    icon: <AlertCircle className="w-5 h-5" /> 
  };
  if (fraction >= 0.4) return { 
    level: 'partial', 
    color: '#F59E0B', 
    bgColor: '#FEF3C7',
    icon: <AlertCircle className="w-5 h-5" /> 
  };
  return { 
    level: 'needs work', 
    color: '#EF4444', 
    bgColor: '#FEE2E2',
    icon: <XCircle className="w-5 h-5" /> 
  };
};

// --------------------
// Terms Loader with Error Handling
// --------------------
const loadTermsFromFile = async () => {
  try {
    // Check if termsData is available
    if (!termsData) {
      throw new Error('Terms data not found. Make sure terms.js is properly exported.');
    }

    // Handle both default and named exports
    const terms = Array.isArray(termsData) ? termsData : 
                  termsData.default ? termsData.default :
                  termsData.terms ? termsData.terms : [];

    if (!Array.isArray(terms) || terms.length === 0) {
      throw new Error('Terms data must be a non-empty array');
    }

    // Process and validate terms
    return terms.map((term, index) => {
      const processedTerm = {
        id: term.id || index + 1,
        unit: term.unit || 1,
        term: term.term || 'Unknown Term',
        who: term.who || '',
        what: term.what || '',
        where: term.where || '',
        when: term.when || '',
        why: term.why || '',
        keywords: extractKeywords(term)
      };
      return processedTerm;
    });

  } catch (err) {
    console.error('Error loading terms:', err);
    
    // Fallback terms for development/testing
    return [
      {
        id: 1,
        unit: 1,
        term: 'Columbian Exchange',
        who: 'European settlers & Native Americans',
        what: 'Transfer of plants, animals, diseases, and people between Old & New Worlds.',
        where: 'Atlantic world',
        when: 'After 1492',
        why: 'Transformed diets, economies, populations (Native depopulation via disease), and global trade.',
        keywords: ['exchange', 'columbus', 'disease', 'plants', 'animals', 'trade']
      },
      {
        id: 2,
        unit: 1,
        term: 'Encomienda System',
        who: 'Spanish colonizers and Native Americans',
        what: 'Labor system granting colonists control over Native American labor and tribute',
        where: 'Spanish colonies in the Americas',
        when: '1500s-1600s',
        why: 'Provided labor for Spanish colonial economy while attempting to convert natives to Christianity',
        keywords: ['spanish', 'labor', 'natives', 'tribute', 'colonial']
      }
    ];
  }
};

// --------------------
// Main App Component
// --------------------
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
    let mounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const terms = await loadTermsFromFile();
        
        if (!mounted) return;
        
        setApushTerms(terms);
        console.log(`Loaded ${terms.length} APUSH terms`);
        
      } catch (err) {
        console.error('Failed to load terms:', err);
        if (mounted) {
          setError('Failed to load terms data. Please check your terms.js file.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  const getFilteredTerms = () => {
    if (currentUnit === 'all') return apushTerms;
    return apushTerms.filter(term => term.unit === parseInt(currentUnit));
  };

  const getAvailableUnits = () => {
    const units = [...new Set(apushTerms.map(term => term.unit))].sort((a, b) => a - b);
    return units;
  };

  const startQuiz = (mode) => {
    const filtered = getFilteredTerms();
    if (filtered.length === 0) {
      alert('No terms available for the selected unit.');
      return;
    }
    
    // Shuffle terms for variety
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setApushTerms(prev => {
      const otherTerms = prev.filter(term => !shuffled.find(s => s.id === term.id));
      return [...shuffled, ...otherTerms];
    });
    
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
    setUserAnswers(prev => ({
      ...prev,
      [key]: answer
    }));
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading APUSH terms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Terms</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filtered = getFilteredTerms();
  const currentTerm = filtered[currentQuestion];
  const availableUnits = getAvailableUnits();

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
            
            <p className="text-gray-600 mb-6">
              You scored {totalScore.toFixed(1)} out of {totalPossibleScore} points
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Take Another Quiz
              </button>
              <button
                onClick={() => startQuiz(quizMode)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
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
              <button
                onClick={resetQuiz}
                className="text-gray-600 hover:text-gray-800 flex items-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Menu
              </button>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {filtered.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-indigo-50 p-4 rounded-lg">
              {currentTerm.term}
            </h2>

            {/* Answer fields */}
            <div className="space-y-4">
              {fields.map(field => {
                const key = `${currentQuestion}-${field}`;
                const userAnswer = userAnswers[key] || '';
                const score = questionScores[key];
                const fieldLabels = {
                  who: 'Who',
                  what: 'What',
                  where: 'Where', 
                  when: 'When',
                  why: 'Why/Significance'
                };

                return (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {fieldLabels[field]}:
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => handleAnswer(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                      disabled={showFeedback}
                    />
                    
                    {showFeedback && (
                      <div className="mt-2 p-3 rounded-lg" style={{backgroundColor: getScoreLevel(score).bgColor}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Your Score:</span>
                          <div className="flex items-center">
                            {getScoreLevel(score).icon}
                            <span className="ml-2 font-medium" style={{color: getScoreLevel(score).color}}>
                              {Math.round(score * 100)}% ({getScoreLevel(score).level})
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Correct Answer:</strong> {currentTerm[field]}
                        </div>
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
                <button
                  onClick={submitAnswer}
                  disabled={fields.every(field => !userAnswers[`${currentQuestion}-${field}`])}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">APUSH Terms Quiz</h1>
          </div>
          <p className="text-gray-600">Master your AP US History terms with interactive quizzes</p>
          <div className="text-sm text-gray-500 mt-2">
            {apushTerms.length} terms loaded across {availableUnits.length} units
          </div>
        </div>

        {/* Unit Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Unit</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentUnit('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentUnit === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Units ({apushTerms.length} terms)
            </button>
            {availableUnits.map(unit => {
              const unitTerms = apushTerms.filter(term => term.unit === unit);
              return (
                <button
                  key={unit}
                  onClick={() => setCurrentUnit(unit.toString())}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentUnit === unit.toString() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Unit {unit} ({unitTerms.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Mode Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Quiz Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Identification */}
            <button
              onClick={() => startQuiz('identification')}
              className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={filtered.length === 0}
            >
              <div className="text-xl font-semibold mb-2">🎯 Full ID</div>
              <div className="text-purple-100 text-sm mb-2">Complete identification</div>
              <div className="text-xs text-purple-200">Who, What, Where, When, Why</div>
              <div className="text-xs text-purple-200 mt-1">({filtered.length} terms)</div>
            </button>

            {/* Individual modes */}
            {[
              { mode: 'who', label: '👥 Who', color: 'blue' },
              { mode: 'what', label: '📝 What', color: 'green' },
              { mode: 'where', label: '📍 Where', color: 'yellow' },
              { mode: 'when', label: '⏰ When', color: 'red' },
              { mode: 'why', label: '🔍 Why', color: 'indigo' }
            ].map(({ mode, label, color }) => (
              <button
                key={mode}
                onClick={() => startQuiz(mode)}
                className={`p-6 bg-gradient-to-br from-${color}-500 to-${color}-600 text-white rounded-lg hover:from-${color}-600 hover:to-${color}-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={filtered.length === 0}
              >
                <div className="text-xl font-semibold mb-2">{label}</div>
                <div className={`text-${color}-100 text-sm mb-2`}>Focus on {mode}</div>
                <div className={`text-xs text-${color}-200`}>({filtered.length} terms)</div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">No terms available for the selected unit. Please choose a different unit.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
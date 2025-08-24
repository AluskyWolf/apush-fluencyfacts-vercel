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
  const userLower = String(userAnswer).toLowerCase();
  const correctLower = String(correctAnswer).toLowerCase();
  let similarity = defaultCompare(userLower, correctLower);
  let keywordBonus = 0;
  keywords.forEach(keyword => {
    const k = String(keyword).toLowerCase();
    if (k && userLower.includes(k) && correctLower.includes(k)) keywordBonus += 0.08;
  });
  return Math.min(1, similarity + keywordBonus);
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
  };

  // Mode styles mapping
  const modeStyles = {
    who: { gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", text: "text-blue-100", subtext: "text-blue-200" },
    what: { gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", text: "text-green-100", subtext: "text-green-200" },
    where: { gradient: "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700", text: "text-yellow-100", subtext: "text-yellow-200" },
    when: { gradient: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700", text: "text-red-100", subtext: "text-red-200" },
    why: { gradient: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700", text: "text-indigo-100", subtext: "text-indigo-200" }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filtered = getFilteredTerms();
  const availableUnits = getAvailableUnits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">APUSH Terms Quiz</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Choose Quiz Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => startQuiz('identification')}
              className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <div className="text-xl font-semibold mb-2">🎯 Full ID</div>
              <div className="text-purple-100 text-sm mb-2">Complete identification</div>
              <div className="text-xs text-purple-200">Who, What, Where, When, Why</div>
              <div className="text-xs text-purple-200 mt-1">({filtered.length} terms)</div>
            </button>

            {[{ mode: 'who', label: '👥 Who' }, { mode: 'what', label: '📝 What' }, { mode: 'where', label: '📍 Where' }, { mode: 'when', label: '⏰ When' }, { mode: 'why', label: '🔍 Why' }].map(({ mode, label }) => {
              const { gradient, text, subtext } = modeStyles[mode];
              return (
                <button
                  key={mode}
                  onClick={() => startQuiz(mode)}
                  className={`p-6 bg-gradient-to-br ${gradient} text-white rounded-lg transition-all transform hover:scale-105`}
                >
                  <div className="text-xl font-semibold mb-2">{label}</div>
                  <div className={`${text} text-sm mb-2`}>Focus on {mode}</div>
                  <div className={`${subtext} text-xs`}>({filtered.length} terms)</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

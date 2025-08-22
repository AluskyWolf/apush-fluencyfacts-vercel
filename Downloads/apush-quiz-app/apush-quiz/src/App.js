import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Users, Target, RefreshCw } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const [currentUnit, setCurrentUnit] = useState('all');
  const [quizMode, setQuizMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // APUSH Terms Data
  const apushTerms = [
    // Unit 1
    { id: 1, unit: 1, term: "Maize", who: "Aztecs, Maya SW Tribes", what: "Corn along with beans & squash became known as the 3 Sisters & were crucial to NAI development as it allowed for food surpluses.", where: "Mexico, American Southwest", when: "6000 BCE - Today", why: "Transformed nomadic hunting bands to settled agricultural villages b/c of less emphasis needed on hunting/gathering; increase in health + population" },
    { id: 2, unit: 1, term: "Columbian Exchange", who: "European Settlers & Native Americans", what: "Exchange of goods between Europe & New World. Ex: Corn, potatoes, livestock.", where: "Europe, New World", when: "1492-1500s", why: "Disease was an unintended consequence that wiped out natives. Animals changed native way of life. Led to demand for slaves: cash crops like sugar." },
    { id: 3, unit: 1, term: "Encomienda System", who: "Native Americans, Spanish, Las Casas", what: "Spanish system where settlers were given authority over Indian land, gold & forced labor from natives", where: "Spanish colonies", when: "1512-1542", why: "Led to enslavement, exploitation & killing of NAI. Sepulveda/Las Casas debates lead to shift to African labor and the passing of The New Laws." },
    
    // Unit 2
    { id: 4, unit: 2, term: "Pueblo Revolt", who: "Pueblo Indians, Popé, Spanish", what: "Rebelled against Spanish overlords, killing 400 & drove out 2k settlers. Took 12 years for the Spanish to reconquer the area.", where: "American SW", when: "1680", why: "Most effective instance of NAI resistance to colonization. Rejected Catholicism & killed priests, return to traditional religious practices." },
    { id: 5, unit: 2, term: "Virginia Company", who: "London investors, explorers", what: "Joint stock company formed to establish Jamestown colony.", where: "Jamestown", when: "1607", why: "1st successful British settlement in NA. As a corporation, empowered to govern themselves, established precedent of self gov't." },
    { id: 6, unit: 2, term: "Frame of Gov't", who: "William Penn", what: "Written constitution for PA that supported religious tolerance, fair trade with NAI", where: "Pennsylvania", when: "1682", why: "Laws established in accordance with Penn's Quaker beliefs. Reflected Enlight beliefs. Relig freedom, civil rights, self gov't. Impact on future state focus on civil liberties." },
    { id: 7, unit: 2, term: "City Upon a Hill", who: "John Winthrop, Puritans", what: "Speech given on boat Arbella. Colony would be a city on a hill watched by the world", where: "Boston, Mass", when: "1630", why: "Model of Christian charity for Puritans, start of American exceptionalism. Mentions by future presidents: JFK, Reagan. Centrality of religion." },
    { id: 8, unit: 2, term: "Ann Hutchinson", who: "Roger Williams, John Cotton", what: "Puritan banished from Mass Bay Colony for heresy in 1637. She preached the idea that God communicated directly to individuals instead of through the church elders. Real issue was gender roles not religious heresy.", where: "Mass Bay", when: "1637", why: "Challenged colonial gender roles and Church authority. Led to foundation of more tolerant colonies like Rhode Island (founded with Roger Williams). Ideas contributed to foundational beliefs in Constitution of separation of Church and State." },
    { id: 9, unit: 2, term: "King Phillip's War", who: "British, NAI led by Metacom", what: "War over land encroachment by British colonists", where: "New England", when: "1675-1676", why: "Destroys power of the tribes. Continual disputes will be over land. Most destructive war in US History in regard to population." },
    { id: 10, unit: 2, term: "Navigation Acts", who: "Parliament, colonies, merchants", what: "Defined colonies as suppliers of raw materials & markets for GB. No foreign merchants could trade in colonies. Only GB ships for colonial goods.", where: "British colonies", when: "1651", why: "Mercantilism. Enumerated goods (sugar, rum, tobacco, rice) must be shipped to GB for re export. Salutary Neglect. Benefits England & colonies economically. Leads to resentment when enforced." },
    { id: 11, unit: 2, term: "Covenant Chain", who: "Iroquois Confederacy", what: "Alliance & trade agreement that gave Iroquois tribal supremacy & NY favorable trading terms", where: "New York", when: "1677", why: "Established advantage for both: iroquois over other tribes, NY over other colonies. Shows agency of NAI using European powers for their own ends." },
    { id: 12, unit: 2, term: "Enlightenment", who: "Locke, Montesquieu, Rousseau, etc", what: "Intellectual movement thinkers tried to apply principles of reason & methods of science to all of society", where: "Europe, spread to colonies", when: "1600s-1700s", why: "Widespread ideas that were separate from religion. Influenced American political leaders & documents: Dec of I, Constitution, Bill of Rights. Basis of Republicanism & Amer Rev." },
    { id: 13, unit: 2, term: "Great Awakening", who: "George Whitefield, John Edwards, young ppl", what: "Religious movement that emphasized emotional aspects of religion", where: "Northern colonies, spread south", when: "1730s-1760s", why: "Opposite the spread of Enligh ideas. 1st national movement. Questioning authority, slaves first intro to Christianity" },

    // Unit 3
    { id: 14, unit: 3, term: "Salutary Neglect", who: "British, Colonists", what: "British Policy under which trade regulations for the colonies were laxly enforced and imperial supervision of internal colonial affairs was loose as long as the colonies remained loyal to the British and contributed to its economic profitability.", where: "North American colonies", when: "1700-1763", why: "Salutary neglect contributed involuntarily to the increasing autonomy of colonial legal and legislative institutions, which ultimately led to American independence." },
    { id: 15, unit: 3, term: "Plan of Union", who: "Ben Franklin, NAI, Albany Congress Reps", what: "BF attempted to pass plan of intercolonial cooperation about defense, plan that was initially favored but shot down b/c fears of loss of power for colonial assemblies", where: "Albany, NY", when: "1754", why: "Showed diverse interests + sectionalism, not unified. Impact of French & Indian War" },
    { id: 16, unit: 3, term: "French & Indian War", who: "Colonists, NAI, France, GB", what: "Conflict over ohio river valley, resulted in loss of French power in NA. French ally with Huron; GB w/ Iroquois. French outmatched by British + colonials.", where: "Ohio River Valley", when: "1754-1763", why: "Expulsion of French from Nor. Am., Some colonial unity (Albany Plan). Increase in british debt leading to change in relationship b/w colonies. NAI lose option play the powers off each other. Colonial leaders emerge." },
    { id: 17, unit: 3, term: "Pontiac's Rebellion", who: "Pontiac, Gen. Thomas Gage", what: "Ottowa Chief, Pontiac, led an uprising in the wake of the French + Indian War to oppose British expansion into W. Ohio Valley. Led to the Proclamation of 1763. Fort Pitt: use of smallpox blankets against NAI forces.", where: "Great Lakes Region, Michigan", when: "1763", why: "Showcases the difference in NAI relations b/w English vs French. Loss of agency. Demonstrated viability of NAI alliances in struggle against European expansion & contributed to deteriorating relations b/w GB + colonies. Leads to formation of vigilante groups (Paxton Boys)" },
    { id: 18, unit: 3, term: "Stamp Act", who: "Parliament, Sons of Liberty, Colonists", what: "Taxes stamped, legal documents, impacts majority of colonists unless previous taxes.", where: "Colonies, GB, Boston", when: "1765", why: "To raise revenue + pay off debt accumulated for F+ I war, americans use non-importation to hurt Brittain, act repealed in 1766 along w/ passing of Declaratory act, tensions, taxation without representation" },
    { id: 19, unit: 3, term: "Sons, Daughters of Liberty", who: "American Colonists", what: "Sons used threats, protests, and acts of violence to intimidate those loyal to the British crown, and make their grievances clear to the British. They helped organize and carry out the Boston Tea Party. Daughters bolstered the cause by staging boycotts, producing homemade versions of products affected by non-importation.", where: "American Colonies", when: "1765-1776", why: "Sons and Daughters of Liberty were influential in orchestrating effective resistance movements against British rule in colonial America on the eve of the Revolution, primarily against what they perceived as unfair taxation and financial limitations imposed upon them." },
    { id: 20, unit: 3, term: "Coercive Acts", who: "Parliament Colonists", what: "Series of acts that unneces strain on colonists, like quartering act, admin of justice act, etc.", where: "Colonies", when: "1774", why: "To punish colonies especially Boston after Tea Party, confirms fears that GB wants to destroy American Liberty" },
    { id: 21, unit: 3, term: "Republican Motherhood", who: "Upper class women, Abigail Adams", what: "Idea that women are the educators of the next generation, must live according to certain rules and ideals", where: "US", when: "1770-1830s", why: "Assigned gender roles, mothers had a civic duty in society, separate spheres, men = public, women = private" },
    { id: 22, unit: 3, term: "Articles of Confederation", who: "Delegates at Cont. Congress", what: "Set of laws utilized during & directly after the Rev. Fear of top heavy federal gov't led to a confederal system, very little power vested in fed gov't; more power to states.", where: "Colonies, US", when: "1777-1789", why: "Created a natl gov't but was largely unstable due to confederal system. Inability to enforce laws + tax was major issue. Led to Shay's Rebellion, call to rewrite Articles. Effective: NW Ordinance." },
    { id: 23, unit: 3, term: "NW Ordinance of 1787", who: "Congress", what: "Legislation outlining gov't in NW territory including how to enter union, outlawing slavery, paired with Land Ord. of 1785", where: "Territory NW of Ohio", when: "1787", why: "One key success of A of C, gave equal standing to new states; process for adding new states." },
    { id: 24, unit: 3, term: "Shays' Rebellion", who: "Daniel Shays, indebted farmers", what: "Armed march by indebted farmers to courthouse to shut down debtors prisons. Put down by state militia. Pardons by gov't. Disconnect between agrarian, commercial interests similar to Bacon's Rebellion.", where: "Mass.", when: "1787", why: "Country in depression due to inflation, induced by over printing of money, showed inability of gov't formed by A o C to deal with crises, lead to constitutional convention to create a more robust set of laws." },
  ];

  const units = [
    { id: 'all', name: 'All Units', description: 'Study all terms' },
    { id: 1, name: 'Unit 1', description: 'Pre-Columbian to 1607' },
    { id: 2, name: 'Unit 2', description: '1607-1754' },
    { id: 3, name: 'Unit 3', description: '1754-1800' },
    { id: 4, name: 'Unit 4', description: '1800-1848' },
    { id: 5, name: 'Unit 5', description: '1844-1877' },
    { id: 6, name: 'Unit 6', description: '1865-1898' },
    { id: 7, name: 'Unit 7', description: '1890-1945' },
    { id: 8, name: 'Unit 8', description: '1945-1980' },
    { id: 9, name: 'Unit 9', description: '1980-Present' }
  ];

  const quizModes = [
    { id: 'term-to-why-when', name: 'Term → Why & When', description: 'Given the term, fill in the significance and time period', icon: <Target className="w-5 h-5" /> },
    { id: 'why-to-term-when', name: 'Why → Term & When', description: 'Given the significance, identify the term and time period', icon: <BookOpen className="w-5 h-5" /> },
  ];

  // Get filtered terms based on current unit
  const getFilteredTerms = () => {
    if (currentUnit === 'all') return apushTerms;
    return apushTerms.filter(term => term.unit === currentUnit);
  };

  // Start quiz function
  const startQuiz = (mode) => {
    const terms = getFilteredTerms();
    setQuizData(terms);
    setQuizMode(mode);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResult(false);
    setIsQuizActive(true);
    setShowCorrectAnswer(false);
  };

  // Handle answer submission
  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowCorrectAnswer(false);
    } else {
      setShowResult(true);
      setIsQuizActive(false);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowCorrectAnswer(false);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizMode(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResult(false);
    setQuizData([]);
    setIsQuizActive(false);
    setShowCorrectAnswer(false);
  };

  // Calculate score
  const calculateScore = () => {
    // For now, return 100% since this is a study tool, not a graded test
    // In the future, you could implement more sophisticated scoring
    const answeredQuestions = Object.keys(userAnswers).length;
    return answeredQuestions > 0 ? 100 : 0;
  };

  if (isQuizActive) {
    const currentTerm = quizData[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Menu</span>
              </button>
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {quizData.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {quizMode === 'term-to-why-when' ? currentTerm.term : 'Identify the Term'}
              </h2>
              
              {quizMode === 'term-to-why-when' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why was this significant?
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Explain the historical significance..."
                      value={userAnswers[currentQuestion]?.why || ''}
                      onChange={(e) => handleAnswer({
                        ...userAnswers[currentQuestion],
                        why: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      When did this occur?
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Time period..."
                      value={userAnswers[currentQuestion]?.when || ''}
                      onChange={(e) => handleAnswer({
                        ...userAnswers[currentQuestion],
                        when: e.target.value
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{currentTerm.why}</p>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What is this term?"
                    value={userAnswers[currentQuestion] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Show Answer Button */}
            <button
              onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
              className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {showCorrectAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>

            {/* Correct Answer Display */}
            {showCorrectAnswer && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Correct Answer:</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Term:</strong> {currentTerm.term}</p>
                  <p><strong>When:</strong> {currentTerm.when}</p>
                  <p><strong>Why:</strong> {currentTerm.why}</p>
                  <p><strong>Who:</strong> {currentTerm.who}</p>
                  <p><strong>Where:</strong> {currentTerm.where}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>{currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Complete!</h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {calculateScore()}%
            </div>
            <p className="text-gray-600 mb-8">
              You answered {Object.keys(userAnswers).length} out of {quizData.length} questions
            </p>
            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Menu
              </button>
              <button
                onClick={() => startQuiz(quizMode)}
                className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">APUSH Study App</h1>
          <p className="text-gray-600">Master your AP US History terms with interactive quizzes</p>
        </div>

        {/* Unit Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Unit</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setCurrentUnit(unit.id)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  currentUnit === unit.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold">{unit.name}</div>
                <div className="text-xs text-gray-500">{unit.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Study Modes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Modes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quizModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => startQuiz(mode.id)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 mt-1">{mode.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{mode.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Terms Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Terms Preview ({getFilteredTerms().length} terms)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {getFilteredTerms().slice(0, 9).map((term) => (
              <div key={term.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800">{term.term}</h3>
                <p className="text-sm text-gray-600 mt-1">{term.when}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">{term.why}</p>
              </div>
            ))}
          </div>
          {getFilteredTerms().length > 9 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              And {getFilteredTerms().length - 9} more terms...
            </p>
          )}
        </div>
      </div>
      <Analytics />
    </div>
  );
};

export default App;
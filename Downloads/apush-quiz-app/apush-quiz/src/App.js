import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Users, Target, RefreshCw } from 'lucide-react';

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

    // Continue with more units if needed...
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
   

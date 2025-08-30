const euroTerms = [
  // =========================
  // Unit 1: Renaissance
  // =========================
  {
    id: 1,
    unit: 1,
    term: "Petrarch",
    who: "Petrarch",
    what: "Called the 'Father of Humanism'; divided history into Classical, Dark Ages, and Rebirth.",
    where: "Italy",
    when: "1304–1374",
    why: "Shaped Renaissance thought by promoting humanism and historical periodization.",
    keywords: ["humanism", "periodization", "classical", "rebirth", "Renaissance"]
  },
  {
    id: 2,
    unit: 1,
    term: "De Medici Family",
    who: "Wealthy banking family",
    what: "Major patrons of Renaissance art and culture.",
    where: "Florence, Italy",
    when: "15th–16th centuries",
    why: "Their patronage fueled artistic innovation during the Renaissance.",
    keywords: ["Medici", "Florence", "patronage", "arts", "wealth"]
  },
  {
    id: 3,
    unit: 1,
    term: "Pope Julius II",
    who: "Renaissance Pope",
    what: "Commissioned major artworks like Raphael’s 'School of Athens'.",
    where: "Rome",
    when: "Papacy 1503–1513",
    why: "Linked papal authority with Renaissance art and humanism.",
    keywords: ["Pope", "Renaissance", "art", "Raphael", "patronage"]
  },
  {
    id: 4,
    unit: 1,
    term: "Niccolò Machiavelli",
    who: "Machiavelli",
    what: "Wrote 'The Prince', arguing rulers should be pragmatic and the end justifies the means.",
    where: "Florence",
    when: "1513",
    why: "Marked a shift from religious to secular political thought.",
    keywords: ["Machiavelli", "The Prince", "politics", "pragmatism", "secular"]
  },
  {
    id: 5,
    unit: 1,
    term: "Sir Thomas More",
    who: "Thomas More",
    what: "English humanist who wrote 'Utopia'; argued for moral rulers.",
    where: "England",
    when: "1478–1535",
    why: "Promoted Christian humanism and reform ideals.",
    keywords: ["More", "Utopia", "humanism", "Christian", "England"]
  },
  {
    id: 6,
    unit: 1,
    term: "Humanism",
    who: "Renaissance scholars",
    what: "Movement focused on classical studies, human potential, and individualism.",
    where: "Italy → Europe",
    when: "14th–16th centuries",
    why: "Foundation of Renaissance thought in education, art, and politics.",
    keywords: ["humanism", "classical", "individualism", "education"]
  },
  {
    id: 7,
    unit: 1,
    term: "Secularism",
    who: "Renaissance thinkers",
    what: "Focus on worldly matters separate from the Church.",
    where: "Europe",
    when: "Renaissance era",
    why: "Encouraged art, science, and politics independent from religion.",
    keywords: ["secularism", "worldly", "Church", "Renaissance"]
  },
  {
    id: 8,
    unit: 1,
    term: "Fall of Constantinople",
    who: "Ottoman Empire, Byzantines",
    what: "Ottomans conquered Byzantine capital, ending the empire.",
    where: "Constantinople (Istanbul)",
    when: "1453",
    why: "Byzantine scholars fled to Italy with classical texts, fueling the Renaissance.",
    keywords: ["Ottomans", "Byzantine", "1453", "Constantinople", "classical"]
  },
  {
    id: 9,
    unit: 1,
    term: "Spanish Inquisition",
    who: "Ferdinand & Isabella",
    what: "Religious tribunal enforcing Catholic orthodoxy, persecuting heretics.",
    where: "Spain",
    when: "1478 onward",
    why: "Unified Spain under Catholicism but spread intolerance.",
    keywords: ["Spain", "Inquisition", "Catholic", "heretics", "orthodoxy"]
  },

  // =========================
  // Unit 2: Exploration & Society
  // =========================
  {
    id: 10,
    unit: 2,
    term: "Prince Henry the Navigator",
    who: "Portuguese prince",
    what: "Sponsored voyages along Africa and founded navigation school.",
    where: "Portugal, Africa",
    when: "1394–1460",
    why: "Laid foundations for Age of Exploration.",
    keywords: ["Portugal", "navigation", "exploration", "Africa"]
  },
  {
    id: 11,
    unit: 2,
    term: "Christopher Columbus",
    who: "Italian explorer for Spain",
    what: "Voyages led to European awareness of the Americas.",
    where: "Spain, Americas",
    when: "1492",
    why: "Started Columbian Exchange and Spanish colonization.",
    keywords: ["Columbus", "1492", "Americas", "Spain", "exploration"]
  },
  {
    id: 12,
    unit: 2,
    term: "Hernán Cortés",
    who: "Spanish conquistador",
    what: "Conquered the Aztec Empire.",
    where: "Mexico",
    when: "1519–1521",
    why: "Expanded Spanish empire, devastated native populations.",
    keywords: ["Cortés", "Aztecs", "Mexico", "conquest"]
  },
  {
    id: 13,
    unit: 2,
    term: "Francisco Pizarro",
    who: "Spanish conquistador",
    what: "Conquered the Inca Empire.",
    where: "Peru",
    when: "1530s",
    why: "Weakened Incan civilization, enriched Spain.",
    keywords: ["Pizarro", "Inca", "Peru", "conquest"]
  },
  {
    id: 14,
    unit: 2,
    term: "Caravel",
    who: "Portuguese shipbuilders",
    what: "Small, maneuverable sailing ship used in exploration.",
    where: "Portugal",
    when: "15th century",
    why: "Allowed longer voyages, crucial for exploration.",
    keywords: ["Caravel", "ship", "navigation", "exploration"]
  },
  {
    id: 15,
    unit: 2,
    term: "Mercantilism",
    who: "European states",
    what: "Economic theory: power based on wealth, exports over imports.",
    where: "Europe",
    when: "16th–18th centuries",
    why: "Drove colonial expansion and competition.",
    keywords: ["mercantilism", "trade", "exports", "wealth"]
  },
  {
    id: 16,
    unit: 2,
    term: "Columbian Exchange",
    who: "Europeans & Native Americans",
    what: "Transfer of plants, animals, people, disease, and culture.",
    where: "Europe, Africa, Americas",
    when: "1492 onward",
    why: "Revolutionized global economy, ecology, and demographics.",
    keywords: ["Columbian Exchange", "trade", "disease", "Americas"]
  },
  {
    id: 17,
    unit: 2,
    term: "Encomienda System",
    who: "Spanish colonists, natives",
    what: "Labor system demanding tribute and work from natives.",
    where: "Spanish colonies",
    when: "16th century",
    why: "Exploited natives, shifted labor demand to Africans.",
    keywords: ["encomienda", "Spain", "labor", "natives"]
  },
  {
    id: 18,
    unit: 2,
    term: "Price Revolution",
    who: "Europeans",
    what: "Inflation from influx of New World gold and silver.",
    where: "Europe",
    when: "16th century",
    why: "Wealth redistribution—benefited gentry, hurt poor.",
    keywords: ["inflation", "silver", "gold", "Europe", "Price Revolution"]
  },
  {
    id: 19,
    unit: 2,
    term: "Transatlantic Slave Trade",
    who: "Europeans, Africans",
    what: "Mass transport of enslaved Africans to the Americas.",
    where: "Africa, Americas",
    when: "15th century onward",
    why: "Fueled plantations, reshaped global demographics.",
    keywords: ["slave trade", "Atlantic", "plantations", "slavery"]
  },
  {
    id: 20,
    unit: 2,
    term: "Treaty of Tordesillas",
    who: "Spain, Portugal",
    what: "Divided New World territories between Spain and Portugal.",
    where: "Europe, Americas",
    when: "1494",
    why: "Shaped colonial borders and competition.",
    keywords: ["Treaty of Tordesillas", "Spain", "Portugal", "colonization"]
  },
  {
    id: 21,
    unit: 2,
    term: "British East India Company",
    who: "British merchants, monarchy",
    what: "Private company controlling trade in Asia.",
    where: "India, Asia",
    when: "1600–1874",
    why: "Weakened Iberian trade dominance, expanded British empire.",
    keywords: ["British East India Company", "trade", "India", "Asia"]
  },
  {
    id: 22,
    unit: 2,
    term: "Dutch East India Company",
    who: "Dutch merchants",
    what: "Trading company competing with British in East Indies.",
    where: "Indonesia, Asia",
    when: "1602–1799",
    why: "Established Dutch dominance in spice trade.",
    keywords: ["Dutch East India Company", "trade", "Indonesia", "spices"]
  }, 
  // =========================
  // Unit 3: Reformation
  // =========================
  {
    id: 23,
    unit: 3,
    term: "Martin Luther",
    who: "German monk and reformer",
    what: "Wrote 95 Theses criticizing indulgences and Church corruption.",
    where: "Germany",
    when: "1517",
    why: "Sparked Protestant Reformation and challenged papal authority.",
    keywords: ["Luther", "95 Theses", "Protestant", "Reformation", "indulgences"]
  },
  {
    id: 24,
    unit: 3,
    term: "John Calvin",
    who: "French reformer",
    what: "Founded Calvinism, emphasizing predestination and strict morality.",
    where: "Geneva, Switzerland",
    when: "1509–1564",
    why: "Spread Protestant ideas across Europe and influenced Puritans.",
    keywords: ["Calvin", "Calvinism", "predestination", "Protestant"]
  },
  {
    id: 25,
    unit: 3,
    term: "Henry VIII",
    who: "King of England",
    what: "Split from the Catholic Church after denial of annulment.",
    where: "England",
    when: "1534",
    why: "Created the Church of England, shifting power from Pope to monarch.",
    keywords: ["Henry VIII", "Church of England", "Reformation", "Anglican"]
  },
  {
    id: 26,
    unit: 3,
    term: "Elizabeth I",
    who: "Queen of England",
    what: "Established Protestantism as state religion, defeated Spanish Armada.",
    where: "England",
    when: "1558–1603",
    why: "Stabilized England’s religion and expanded global power.",
    keywords: ["Elizabeth I", "Protestant", "England", "Armada"]
  },
  {
    id: 27,
    unit: 3,
    term: "Council of Trent",
    who: "Catholic Church leaders",
    what: "Meeting of Catholic leaders responding to Protestant Reformation.",
    where: "Trent, Italy",
    when: "1545–1563",
    why: "Reaffirmed Catholic doctrines and reformed Church practices.",
    keywords: ["Council of Trent", "Catholic Reformation", "Counter-Reformation"]
  },
  {
    id: 28,
    unit: 3,
    term: "Jesuits",
    who: "Ignatius of Loyola and followers",
    what: "Catholic order devoted to education and missionary work.",
    where: "Europe, Americas, Asia",
    when: "Founded 1540",
    why: "Spread Catholicism and strengthened Church during Counter-Reformation.",
    keywords: ["Jesuits", "Catholic", "missionary", "education"]
  },
  {
    id: 29,
    unit: 3,
    term: "Peace of Augsburg",
    who: "Charles V, German princes",
    what: "Allowed rulers to choose Catholicism or Lutheranism for their state.",
    where: "Holy Roman Empire",
    when: "1555",
    why: "Established principle of 'cuius regio, eius religio'.",
    keywords: ["Peace of Augsburg", "religion", "Lutheranism", "Holy Roman Empire"]
  },
  {
    id: 30,
    unit: 3,
    term: "Spanish Armada",
    who: "Philip II of Spain, Elizabeth I of England",
    what: "Failed Spanish naval invasion of England.",
    where: "English Channel",
    when: "1588",
    why: "Marked decline of Spanish power and rise of England as naval force.",
    keywords: ["Spanish Armada", "England", "Spain", "naval"]
  },

  // =========================
  // Unit 4: State Building & Absolutism
  // =========================
  {
    id: 31,
    unit: 4,
    term: "Thirty Years' War",
    who: "Catholics vs. Protestants",
    what: "Conflict in Holy Roman Empire fueled by religion and politics.",
    where: "Central Europe",
    when: "1618–1648",
    why: "Weakened Holy Roman Empire, strengthened France, ended with Peace of Westphalia.",
    keywords: ["Thirty Years' War", "religion", "HRE", "Westphalia"]
  },
  {
    id: 32,
    unit: 4,
    term: "Peace of Westphalia",
    who: "European states",
    what: "Treaty ending Thirty Years’ War.",
    where: "Europe",
    when: "1648",
    why: "Recognized state sovereignty, limited papal authority.",
    keywords: ["Peace of Westphalia", "1648", "sovereignty", "religion"]
  },
  {
    id: 33,
    unit: 4,
    term: "Louis XIV",
    who: "King of France",
    what: "The 'Sun King', built Versailles, practiced absolutism.",
    where: "France",
    when: "1643–1715",
    why: "Centralized monarchy, model of absolutism.",
    keywords: ["Louis XIV", "absolutism", "Versailles", "France"]
  },
  {
    id: 34,
    unit: 4,
    term: "English Civil War",
    who: "Parliament vs. Charles I",
    what: "Conflict over royal power and Parliament’s role.",
    where: "England",
    when: "1642–1651",
    why: "Resulted in temporary overthrow of monarchy.",
    keywords: ["English Civil War", "Charles I", "Parliament", "monarchy"]
  },
  {
    id: 35,
    unit: 4,
    term: "Glorious Revolution",
    who: "William and Mary",
    what: "Peaceful overthrow of James II, established constitutional monarchy.",
    where: "England",
    when: "1688",
    why: "Ensured Parliament’s supremacy over monarchy.",
    keywords: ["Glorious Revolution", "1688", "England", "monarchy"]
  },
  {
    id: 36,
    unit: 4,
    term: "Peter the Great",
    who: "Tsar of Russia",
    what: "Modernized Russia with western technology and navy.",
    where: "Russia",
    when: "1682–1725",
    why: "Turned Russia into major European power.",
    keywords: ["Peter the Great", "Russia", "modernization", "westernization"]
  },
  {
    id: 37,
    unit: 4,
    term: "English Bill of Rights",
    who: "Parliament, William and Mary",
    what: "Outlined rights of Parliament and limits on monarchy.",
    where: "England",
    when: "1689",
    why: "Created foundation for constitutional monarchy.",
    keywords: ["Bill of Rights", "England", "monarchy", "Parliament"]
  },
  {
    id: 38,
    unit: 4,
    term: "Mercantilist Wars",
    who: "England, France, Netherlands",
    what: "Wars over trade and colonies.",
    where: "Europe, colonies",
    when: "17th–18th centuries",
    why: "Reflected growing importance of overseas empire.",
    keywords: ["mercantilism", "trade wars", "colonies", "empire"]
  },
  // =========================
  // Unit 5: Scientific Revolution
  // =========================
  {
    id: 39,
    unit: 5,
    term: "Nicolaus Copernicus",
    who: "Polish astronomer",
    what: "Proposed heliocentric theory placing the Sun at the center of the universe.",
    where: "Poland",
    when: "1543",
    why: "Challenged geocentric model and Catholic orthodoxy.",
    keywords: ["Copernicus", "heliocentric", "astronomy", "Poland"]
  },
  {
    id: 40,
    unit: 5,
    term: "Galileo Galilei",
    who: "Italian scientist",
    what: "Used telescope to support heliocentrism, discovered moons of Jupiter.",
    where: "Italy",
    when: "1564–1642",
    why: "Faced trial by Inquisition; advanced scientific method.",
    keywords: ["Galileo", "heliocentric", "telescope", "astronomy"]
  },
  {
    id: 41,
    unit: 5,
    term: "Johannes Kepler",
    who: "German astronomer",
    what: "Formulated laws of planetary motion (elliptical orbits).",
    where: "Holy Roman Empire",
    when: "1571–1630",
    why: "Provided mathematical support for heliocentrism.",
    keywords: ["Kepler", "planets", "elliptical orbits", "astronomy"]
  },
  {
    id: 42,
    unit: 5,
    term: "Isaac Newton",
    who: "English scientist",
    what: "Published Principia Mathematica, laws of motion and universal gravitation.",
    where: "England",
    when: "1687",
    why: "Unified physics and astronomy under natural laws.",
    keywords: ["Newton", "gravity", "laws of motion", "physics"]
  },
  {
    id: 43,
    unit: 5,
    term: "Francis Bacon",
    who: "English philosopher",
    what: "Promoted empiricism and inductive reasoning.",
    where: "England",
    when: "1561–1626",
    why: "Father of scientific method, emphasized observation and experiment.",
    keywords: ["Bacon", "scientific method", "empiricism", "England"]
  },
  {
    id: 44,
    unit: 5,
    term: "René Descartes",
    who: "French philosopher",
    what: "Advocated deductive reasoning and rationalism; 'I think, therefore I am'.",
    where: "France",
    when: "1596–1650",
    why: "Contributed to development of scientific method.",
    keywords: ["Descartes", "deductive", "rationalism", "France"]
  },

  // =========================
  // Unit 6: Enlightenment
  // =========================
  {
    id: 45,
    unit: 6,
    term: "John Locke",
    who: "English philosopher",
    what: "Argued for natural rights: life, liberty, property; believed government must protect them.",
    where: "England",
    when: "1632–1704",
    why: "Influenced liberalism, social contract theory, and revolutions.",
    keywords: ["Locke", "natural rights", "liberalism", "England"]
  },
  {
    id: 46,
    unit: 6,
    term: "Thomas Hobbes",
    who: "English philosopher",
    what: "Author of Leviathan; believed humans need strong absolute government to maintain order.",
    where: "England",
    when: "1588–1679",
    why: "Defended absolutism as necessary to prevent chaos.",
    keywords: ["Hobbes", "Leviathan", "absolutism", "England"]
  },
  {
    id: 47,
    unit: 6,
    term: "Voltaire",
    who: "French philosopher",
    what: "Criticized organized religion; supported free speech and religious tolerance.",
    where: "France",
    when: "1694–1778",
    why: "Major Enlightenment voice for civil liberties.",
    keywords: ["Voltaire", "freedom", "religion", "tolerance"]
  },
  {
    id: 48,
    unit: 6,
    term: "Jean-Jacques Rousseau",
    who: "French philosopher",
    what: "Wrote The Social Contract; believed sovereignty belongs to the people.",
    where: "France",
    when: "1712–1778",
    why: "Inspired democratic ideals and revolutions.",
    keywords: ["Rousseau", "social contract", "democracy", "France"]
  },
  {
    id: 49,
    unit: 6,
    term: "Montesquieu",
    who: "French philosopher",
    what: "Wrote The Spirit of the Laws; advocated separation of powers.",
    where: "France",
    when: "1689–1755",
    why: "Influenced U.S. Constitution and modern democracies.",
    keywords: ["Montesquieu", "separation of powers", "Enlightenment"]
  },
  {
    id: 50,
    unit: 6,
    term: "Adam Smith",
    who: "Scottish economist",
    what: "Wrote The Wealth of Nations; promoted free-market capitalism and laissez-faire.",
    where: "Scotland",
    when: "1776",
    why: "Laid foundation for modern economics.",
    keywords: ["Adam Smith", "capitalism", "economics", "free market"]
  },
  {
    id: 51,
    unit: 6,
    term: "Mary Wollstonecraft",
    who: "English writer",
    what: "Wrote A Vindication of the Rights of Woman, advocating women’s education and equality.",
    where: "England",
    when: "1792",
    why: "Early voice for women’s rights in Enlightenment thought.",
    keywords: ["Wollstonecraft", "women's rights", "education", "Enlightenment"]
  },
  {
    id: 52,
    unit: 6,
    term: "Denis Diderot",
    who: "French philosopher",
    what: "Compiled the Encyclopédie, spreading Enlightenment ideas widely.",
    where: "France",
    when: "1751–1772",
    why: "Helped democratize knowledge and challenge tradition.",
    keywords: ["Diderot", "Encyclopédie", "Enlightenment", "knowledge"]
  },
  // =========================
  // Unit 7: French Revolution
  // =========================
  {
    id: 53,
    unit: 7,
    term: "Estates-General",
    who: "French representatives of three estates",
    what: "Assembly of clergy, nobility, and commoners; called by Louis XVI.",
    where: "France",
    when: "1789",
    why: "Led to National Assembly and beginning of Revolution.",
    keywords: ["Estates-General", "France", "1789", "French Revolution"]
  },
  {
    id: 54,
    unit: 7,
    term: "National Assembly",
    who: "Third Estate representatives",
    what: "Declared themselves true representatives of the French people.",
    where: "France",
    when: "1789",
    why: "Issued Declaration of the Rights of Man, challenged monarchy.",
    keywords: ["National Assembly", "Third Estate", "French Revolution"]
  },
  {
    id: 55,
    unit: 7,
    term: "Storming of the Bastille",
    who: "Parisian revolutionaries",
    what: "Mob stormed royal prison symbolizing tyranny.",
    where: "Paris",
    when: "July 14, 1789",
    why: "Marked symbolic start of French Revolution.",
    keywords: ["Bastille", "French Revolution", "Paris", "1789"]
  },
  {
    id: 56,
    unit: 7,
    term: "Maximilien Robespierre",
    who: "Leader of Committee of Public Safety",
    what: "Led Reign of Terror, executed enemies of Revolution.",
    where: "France",
    when: "1793–1794",
    why: "Represented radical phase of Revolution.",
    keywords: ["Robespierre", "Reign of Terror", "French Revolution"]
  },
  {
    id: 57,
    unit: 7,
    term: "Reign of Terror",
    who: "Committee of Public Safety",
    what: "Mass executions of perceived enemies of Revolution.",
    where: "France",
    when: "1793–1794",
    why: "Radical defense of Revolution, ended with Robespierre’s fall.",
    keywords: ["Reign of Terror", "Robespierre", "French Revolution"]
  },
  {
    id: 58,
    unit: 7,
    term: "Napoleon Bonaparte",
    who: "French military leader",
    what: "Rose to power, crowned Emperor, expanded French empire.",
    where: "France and Europe",
    when: "1799–1815",
    why: "Spread Napoleonic Code and nationalism across Europe.",
    keywords: ["Napoleon", "French Empire", "Napoleonic Code", "France"]
  },
  {
    id: 59,
    unit: 7,
    term: "Congress of Vienna",
    who: "European powers (Metternich, Castlereagh, etc.)",
    what: "Reorganized Europe after Napoleon’s defeat.",
    where: "Vienna, Austria",
    when: "1814–1815",
    why: "Restored monarchies, balanced power to prevent revolutions.",
    keywords: ["Congress of Vienna", "1815", "Metternich", "Napoleon"]
  },

  // =========================
  // Unit 8: Industrial Revolution
  // =========================
  {
    id: 60,
    unit: 8,
    term: "Industrial Revolution",
    who: "Inventors, entrepreneurs, and workers",
    what: "Shift from hand production to machine-based industry.",
    where: "Britain, spreading to Europe",
    when: "18th–19th centuries",
    why: "Transformed economies, societies, and environments.",
    keywords: ["Industrial Revolution", "industry", "machines", "factories"]
  },
  {
    id: 61,
    unit: 8,
    term: "James Watt",
    who: "Scottish engineer",
    what: "Improved the steam engine, key to industrialization.",
    where: "Britain",
    when: "1760s–1770s",
    why: "Powered factories, mines, and transportation.",
    keywords: ["James Watt", "steam engine", "industrialization", "Britain"]
  },
  {
    id: 62,
    unit: 8,
    term: "Factory System",
    who: "Industrial capitalists and workers",
    what: "Centralized production with machines and wage labor.",
    where: "Britain, Europe",
    when: "18th–19th centuries",
    why: "Reorganized labor and production efficiency.",
    keywords: ["Factory System", "industrialization", "labor", "factories"]
  },
  {
    id: 63,
    unit: 8,
    term: "Urbanization",
    who: "Industrial workers and migrants",
    what: "Movement of people from countryside to cities.",
    where: "Europe",
    when: "18th–19th centuries",
    why: "Caused overcrowding, poor conditions, social change.",
    keywords: ["urbanization", "cities", "industrialization", "migration"]
  },
  {
    id: 64,
    unit: 8,
    term: "Luddites",
    who: "English workers",
    what: "Destroyed machines they believed threatened jobs.",
    where: "England",
    when: "1811–1816",
    why: "Protested negative effects of industrialization.",
    keywords: ["Luddites", "machines", "workers", "industrialization"]
  },
  {
    id: 65,
    unit: 8,
    term: "Karl Marx",
    who: "German philosopher",
    what: "Co-authored The Communist Manifesto; critiqued capitalism.",
    where: "Germany, Britain",
    when: "1848",
    why: "Founded Marxism, inspired socialist and communist movements.",
    keywords: ["Karl Marx", "Communism", "socialism", "capitalism"]
  },
  {
    id: 66,
    unit: 8,
    term: "Chartist Movement",
    who: "British working-class activists",
    what: "Pushed for political reforms like universal male suffrage.",
    where: "Britain",
    when: "1830s–1840s",
    why: "Expanded political rights during industrial era.",
    keywords: ["Chartism", "reform", "suffrage", "Britain"]
  },
  // =========================
  // Unit 9: 19th Century Revolutions & Nationalism
  // =========================
  {
    id: 67,
    unit: 9,
    term: "Liberal Revolutions of 1848",
    who: "Middle-class liberals and workers",
    what: "Series of uprisings across Europe for democracy and national self-determination.",
    where: "France, German states, Austria, Italy",
    when: "1848",
    why: "Mostly failed but spread liberal and nationalist ideas.",
    keywords: ["Revolutions of 1848", "liberalism", "nationalism", "Europe"]
  },
  {
    id: 68,
    unit: 9,
    term: "Giuseppe Garibaldi",
    who: "Italian nationalist and soldier",
    what: "Led Red Shirts to help unify Italy.",
    where: "Italy",
    when: "1860s",
    why: "Key figure in Italian unification movement.",
    keywords: ["Garibaldi", "Italy", "unification", "Red Shirts"]
  },
  {
    id: 69,
    unit: 9,
    term: "Camillo di Cavour",
    who: "Prime Minister of Piedmont-Sardinia",
    what: "Used diplomacy and alliances to unify northern Italy.",
    where: "Italy",
    when: "1850s–1860s",
    why: "Architect of Italian unification.",
    keywords: ["Cavour", "Italy", "unification", "diplomacy"]
  },
  {
    id: 70,
    unit: 9,
    term: "Otto von Bismarck",
    who: "Prussian statesman",
    what: "Used 'blood and iron' to unify Germany under Prussian dominance.",
    where: "Germany",
    when: "1860s–1871",
    why: "Established German Empire and Realpolitik.",
    keywords: ["Bismarck", "Germany", "unification", "Realpolitik"]
  },
  {
    id: 71,
    unit: 9,
    term: "German Unification",
    who: "Prussia under Bismarck",
    what: "Series of wars (vs. Denmark, Austria, France) leading to unified German Empire.",
    where: "Central Europe",
    when: "1871",
    why: "Created a new major European power.",
    keywords: ["Germany", "unification", "Bismarck", "1871"]
  },
  {
    id: 72,
    unit: 9,
    term: "Romanticism",
    who: "European artists and intellectuals",
    what: "Cultural movement emphasizing emotion, nature, and nationalism.",
    where: "Europe",
    when: "late 18th–19th century",
    why: "Countered Enlightenment rationalism; fueled nationalist sentiment.",
    keywords: ["Romanticism", "art", "literature", "nationalism"]
  },

  // =========================
  // Unit 10: Imperialism & Nation-States
  // =========================
  {
    id: 73,
    unit: 10,
    term: "New Imperialism",
    who: "European powers",
    what: "Expansion of empires for resources, markets, and prestige.",
    where: "Africa, Asia, Pacific",
    when: "19th century",
    why: "Fueled by industrialization, nationalism, and competition.",
    keywords: ["New Imperialism", "colonialism", "Africa", "Asia"]
  },
  {
    id: 74,
    unit: 10,
    term: "Social Darwinism",
    who: "European intellectuals",
    what: "Applied Darwin’s survival of the fittest to justify imperialism and racism.",
    where: "Europe",
    when: "late 19th century",
    why: "Provided ideological justification for imperialism.",
    keywords: ["Social Darwinism", "imperialism", "racism", "Darwin"]
  },
  {
    id: 75,
    unit: 10,
    term: "Scramble for Africa",
    who: "European powers",
    what: "Rapid colonization and partition of Africa.",
    where: "Africa",
    when: "1880s–1914",
    why: "Driven by resources, markets, and competition.",
    keywords: ["Scramble for Africa", "colonialism", "imperialism"]
  },
  {
    id: 76,
    unit: 10,
    term: "Berlin Conference",
    who: "European leaders",
    what: "Meeting to divide Africa without African participation.",
    where: "Berlin, Germany",
    when: "1884–1885",
    why: "Formalized imperial control of Africa.",
    keywords: ["Berlin Conference", "Africa", "imperialism", "1884"]
  },
  {
    id: 77,
    unit: 10,
    term: "British Raj",
    who: "British Empire",
    what: "Colonial rule over India after Sepoy Mutiny.",
    where: "India",
    when: "1858–1947",
    why: "Established direct British rule over Indian subcontinent.",
    keywords: ["British Raj", "India", "imperialism", "colonialism"]
  },
  {
    id: 78,
    unit: 10,
    term: "Opium Wars",
    who: "Britain vs. Qing China",
    what: "Wars over opium trade and Chinese sovereignty.",
    where: "China",
    when: "1839–1842, 1856–1860",
    why: "Weakened Qing dynasty, opened China to foreign influence.",
    keywords: ["Opium Wars", "China", "Britain", "imperialism"]
  },
  {
    id: 79,
    unit: 10,
    term: "Meiji Restoration",
    who: "Japanese leaders",
    what: "Modernization and westernization of Japan under Emperor Meiji.",
    where: "Japan",
    when: "1868 onward",
    why: "Transformed Japan into an industrial and imperial power.",
    keywords: ["Meiji Restoration", "Japan", "modernization", "imperialism"]
  },
  // =========================
  // Unit 11: World Wars & Interwar Europe
  // =========================
  {
    id: 80,
    unit: 11,
    term: "World War I",
    who: "Allied Powers vs. Central Powers",
    what: "Global war sparked by assassination of Archduke Franz Ferdinand.",
    where: "Europe, colonies worldwide",
    when: "1914–1918",
    why: "Redrew borders, ended empires, led to Treaty of Versailles.",
    keywords: ["WWI", "Great War", "Allies", "Central Powers"]
  },
  {
    id: 81,
    unit: 11,
    term: "Treaty of Versailles",
    who: "Allied Powers, Germany",
    what: "Peace treaty ending WWI, imposed harsh reparations on Germany.",
    where: "Versailles, France",
    when: "1919",
    why: "Weakened Germany, created resentment fueling WWII.",
    keywords: ["Treaty of Versailles", "WWI", "Germany", "1919"]
  },
  {
    id: 82,
    unit: 11,
    term: "League of Nations",
    who: "International organization of states",
    what: "Founded to promote peace and collective security after WWI.",
    where: "Geneva, Switzerland",
    when: "1919",
    why: "First attempt at international peacekeeping, but weak without U.S.",
    keywords: ["League of Nations", "peacekeeping", "WWI"]
  },
  {
    id: 83,
    unit: 11,
    term: "Russian Revolution",
    who: "Bolsheviks led by Lenin",
    what: "Overthrew Tsar Nicholas II, established communist state.",
    where: "Russia",
    when: "1917",
    why: "Brought first communist government to power.",
    keywords: ["Russian Revolution", "Bolsheviks", "Lenin", "1917"]
  },
  {
    id: 84,
    unit: 11,
    term: "Fascism",
    who: "Mussolini, Hitler, Franco",
    what: "Authoritarian nationalist ideology rejecting democracy and liberalism.",
    where: "Italy, Germany, Spain",
    when: "1920s–1930s",
    why: "Led to totalitarian regimes and WWII.",
    keywords: ["Fascism", "Mussolini", "Hitler", "dictatorship"]
  },
  {
    id: 85,
    unit: 11,
    term: "Great Depression",
    who: "Global economies, especially U.S. and Europe",
    what: "Severe worldwide economic downturn after 1929 stock crash.",
    where: "Global",
    when: "1929–1939",
    why: "Fueled political extremism and instability leading to WWII.",
    keywords: ["Great Depression", "economy", "1929", "WWII causes"]
  },
  {
    id: 86,
    unit: 11,
    term: "World War II",
    who: "Allied Powers vs. Axis Powers",
    what: "Global war sparked by German invasion of Poland.",
    where: "Europe, Asia, Africa, Pacific",
    when: "1939–1945",
    why: "Deadliest conflict in history; ended fascist regimes; led to Cold War.",
    keywords: ["WWII", "Allies", "Axis", "Hitler", "Stalin"]
  },
  {
    id: 87,
    unit: 11,
    term: "Holocaust",
    who: "Nazi Germany under Hitler",
    what: "Systematic genocide of 6 million Jews and millions of others.",
    where: "Nazi-occupied Europe",
    when: "1941–1945",
    why: "One of history’s greatest atrocities; shaped human rights laws.",
    keywords: ["Holocaust", "genocide", "Nazis", "WWII"]
  },
  {
    id: 88,
    unit: 11,
    term: "United Nations",
    who: "International organization of states",
    what: "Founded after WWII to promote peace, human rights, and cooperation.",
    where: "San Francisco (founded), New York (HQ)",
    when: "1945",
    why: "Stronger replacement for League of Nations.",
    keywords: ["United Nations", "UN", "WWII", "peacekeeping"]
  },
  {
    id: 89,
    unit: 11,
    term: "Cold War",
    who: "United States vs. Soviet Union",
    what: "Period of ideological, political, and military tension without direct war.",
    where: "Global",
    when: "1945–1991",
    why: "Shaped world politics; defined late 20th-century Europe.",
    keywords: ["Cold War", "USA", "USSR", "nuclear arms"]
  }
];

export default euroTerms;
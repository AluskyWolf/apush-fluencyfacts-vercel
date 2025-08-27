const worldTerms = [
    // Unit 1: Belief Systems (formerly Unit 0)
    { id: 1, unit: 1, term: "Confucianism", who: "Chinese philosophical system founded by Confucius", what: "Philosophy emphasizing social harmony, education, virtue, and respect for authority with strict social hierarchy", where: "China", when: "6th century BCE onwards", why: "Shaped Chinese society and government for millennia; emphasized filial piety and meritocratic ideals", keywords: ["china", "philosophy", "social harmony", "hierarchy", "filial piety", "education", "virtue", "confucius"] },
    
    { id: 2, unit: 1, term: "Daoism", who: "Chinese philosophical and religious tradition", what: "Philosophy emphasizing living in harmony with nature and promoting internal reflection over external behavior", where: "China", when: "6th century BCE onwards", why: "Provided alternative to Confucian social order; promoted non-violence and acceptance of natural way", keywords: ["china", "philosophy", "nature", "harmony", "reflection", "non-violence", "tao"] },
    
    { id: 3, unit: 1, term: "Legalism", who: "Chinese political philosophy", what: "Belief system asserting people are inherently wicked and can only be controlled by strict laws and harsh punishments", where: "China", when: "4th-3rd centuries BCE", why: "Influenced authoritarian approaches to governance; emphasized state control over individual freedom", keywords: ["china", "philosophy", "laws", "punishment", "authoritarian", "state control"] },
    
    { id: 4, unit: 1, term: "Hinduism", who: "Religious tradition of the Indian subcontinent", what: "Polytheistic religion with beliefs in reincarnation and rigid caste system based on Vedic scriptures", where: "India", when: "1500 BCE onwards", why: "Shaped Indian social structure and spiritual practices; caste system influenced social mobility", keywords: ["india", "religion", "polytheistic", "reincarnation", "caste system", "vedas", "social structure"] },
    
    { id: 5, unit: 1, term: "Buddhism", who: "Religion founded by Siddhartha Gautama (Buddha)", what: "Universalizing religion teaching Four Noble Truths and Eightfold Path to achieve nirvana", where: "India, spread throughout Asia", when: "6th century BCE onwards", why: "Rejected caste system; spread through missionary work; offered path to spiritual liberation", keywords: ["india", "religion", "buddha", "nirvana", "four noble truths", "eightfold path", "missionary", "universalizing"] },
    
    { id: 6, unit: 1, term: "Judaism", who: "Hebrew/Jewish people", what: "Early monotheistic faith believing in covenant between God (Yahweh) and Hebrew people", where: "Middle East/Palestine", when: "2000 BCE onwards", why: "Established foundation for monotheism; influenced Christianity and Islam; concept of chosen people", keywords: ["monotheism", "covenant", "yahweh", "hebrew", "chosen people", "middle east"] },

    // Unit 2: The Global Tapestry (c. 1200-1450)
    { id: 7, unit: 2, term: "Song Dynasty", who: "Chinese Empire under Song rulers", what: "Chinese dynasty known for economic prosperity, technological innovation, and meritocratic bureaucracy", where: "China", when: "960-1279 CE", why: "Established model for centralized government through civil service exams; innovations like gunpowder and printing influenced global development", keywords: ["china", "dynasty", "bureaucracy", "civil service", "meritocracy", "technology", "gunpowder", "printing"] },
    
    { id: 8, unit: 2, term: "Neo-Confucianism", who: "Chinese scholars and philosophers", what: "Revival and reinterpretation of Confucian philosophy blended with Buddhist and Daoist elements", where: "China", when: "Song Dynasty period", why: "Provided intellectual foundation for Chinese governance and education; influenced East Asian cultures", keywords: ["china", "philosophy", "confucianism", "buddhism", "daoism", "intellectual", "governance"] },
    
    { id: 9, unit: 2, term: "Abbasid Caliphate", who: "Islamic empire ruled by Abbasid dynasty", what: "Major Islamic empire that became center for learning and innovation despite political fragmentation", where: "Middle East, centered in Baghdad", when: "750-1258 CE", why: "Preserved and advanced knowledge in math, medicine, and science; House of Wisdom became center of learning", keywords: ["islam", "caliphate", "baghdad", "learning", "house of wisdom", "mathematics", "medicine", "science"] },
    
    { id: 10, unit: 2, term: "Delhi Sultanate", who: "Islamic rulers in Northern India", what: "Series of Islamic kingdoms that created complex Muslim-Hindu interactions", where: "Northern India", when: "1206-1526 CE", why: "Established Islamic rule in Hindu-majority region; created cultural and religious synthesis", keywords: ["india", "islam", "sultanate", "muslim", "hindu", "cultural synthesis"] },
    
    { id: 11, unit: 2, term: "Srivijaya", who: "Maritime trading empire", what: "Sea-based empire controlling Southeast Asian trade routes", where: "Southeast Asia (modern Indonesia/Malaysia)", when: "7th-13th centuries CE", why: "Controlled vital maritime trade routes; spread Indian culture and Buddhism in Southeast Asia", keywords: ["southeast asia", "maritime", "trade", "empire", "buddhism", "indian influence"] },
    
    { id: 12, unit: 2, term: "Majapahit", who: "Javanese Hindu-Buddhist empire", what: "Powerful maritime empire in Southeast Asia", where: "Java (modern Indonesia)", when: "1293-1527 CE", why: "Controlled Indonesian archipelago trade; blended Hindu-Buddhist and local traditions", keywords: ["java", "indonesia", "maritime", "empire", "hindu", "buddhist", "trade"] },
    
    { id: 13, unit: 2, term: "Khmer Empire", who: "Southeast Asian empire", what: "Land-based empire famous for constructing Angkor Wat temple complex", where: "Cambodia", when: "802-1431 CE", why: "Built largest religious monument in world; demonstrated Indian cultural influence in Southeast Asia", keywords: ["cambodia", "angkor wat", "temple", "empire", "indian influence", "hinduism", "buddhism"] },
    
    { id: 14, unit: 2, term: "Aztec Empire", who: "Mesoamerican empire ruled by Mexica people", what: "Powerful tribute-based empire in central Mexico", where: "Central Mexico", when: "1345-1521 CE", why: "Controlled vast trade networks through tribute system; demonstrated advanced urban planning and agriculture", keywords: ["mesoamerica", "mexico", "tribute", "empire", "tenochtitlan", "urban planning"] },
    
    { id: 15, unit: 2, term: "Inca Empire", who: "Andean empire ruled from Cusco", what: "Highly centralized empire using mit'a system of mandatory public service", where: "Andes Mountains (Peru, Bolivia, Ecuador)", when: "1438-1572 CE", why: "Largest empire in pre-Columbian America; sophisticated administrative and engineering systems", keywords: ["andes", "peru", "empire", "mita system", "centralized", "administration", "engineering"] },
    
    { id: 16, unit: 2, term: "Mali Empire", who: "West African empire", what: "Wealthy empire controlling trans-Saharan gold and salt trade", where: "West Africa", when: "1235-1600 CE", why: "Demonstrated Africa's wealth and connection to Islamic world; Mansa Musa's pilgrimage showed empire's prosperity", keywords: ["west africa", "mali", "gold", "salt", "trade", "mansa musa", "islam", "wealth"] },
    
    { id: 17, unit: 2, term: "Great Zimbabwe", who: "Shona people", what: "Stone city and trading center in East Africa", where: "Zimbabwe", when: "1100-1450 CE", why: "Controlled Indian Ocean trade routes; demonstrated sophisticated African architecture and trade networks", keywords: ["east africa", "zimbabwe", "stone city", "trade", "indian ocean", "architecture"] },
    
    { id: 18, unit: 2, term: "Ethiopia", who: "Christian kingdom in East Africa", what: "Christian kingdom that maintained independence and trading relationships", where: "East Africa (modern Ethiopia)", when: "1270-present", why: "Only African nation to resist European colonization; maintained Christian identity in Islamic region", keywords: ["east africa", "ethiopia", "christian", "kingdom", "independence", "coptic christianity"] },
    
    { id: 19, unit: 2, term: "Feudalism", who: "European political system", what: "Decentralized system where land was exchanged for loyalty and military service", where: "Europe", when: "9th-15th centuries CE", why: "Organized European society after collapse of Carolingian Empire; created hierarchical relationships", keywords: ["europe", "feudalism", "land", "loyalty", "hierarchy", "decentralized", "military service"] },
    
    { id: 20, unit: 2, term: "Manorialism", who: "European economic system", what: "Self-sufficient agricultural estates forming basis of medieval European economy", where: "Europe", when: "9th-15th centuries CE", why: "Provided economic foundation for feudal society; organized rural life and agriculture", keywords: ["europe", "manor", "agriculture", "self-sufficient", "medieval", "rural", "economy"] },

    // Unit 3: Networks of Exchange (c. 1200-1450)
    { id: 21, unit: 3, term: "Mongol Empire", who: "Nomadic empire led by Genghis Khan and successors", what: "Largest contiguous land empire in history", where: "Asia, Eastern Europe", when: "1206-1368 CE", why: "Created Pax Mongolica enabling safe trade; facilitated cultural exchange across Eurasia", keywords: ["mongol", "genghis khan", "empire", "pax mongolica", "trade", "eurasia", "nomadic"] },
    
    { id: 22, unit: 3, term: "Pax Mongolica", who: "Mongol-imposed peace", what: "Period of relative peace and stability under Mongol rule", where: "Mongol Empire territories", when: "13th-14th centuries CE", why: "Enabled safe passage along Silk Roads; increased trade and cultural exchange", keywords: ["mongol", "peace", "stability", "silk roads", "trade", "cultural exchange"] },
    
    { id: 23, unit: 3, term: "Silk Roads", who: "Network of trade routes", what: "Overland trade routes connecting Asia, Middle East, and Europe", where: "Asia to Europe", when: "2nd century BCE - 18th century CE", why: "Facilitated exchange of goods, ideas, and technologies; spread of religions and diseases", keywords: ["trade routes", "asia", "europe", "goods", "ideas", "technology", "religion", "disease"] },
    
    { id: 24, unit: 3, term: "Indian Ocean Trade", who: "Maritime trading network", what: "Sea-based trade network connecting Asia, Africa, and Middle East", where: "Indian Ocean", when: "7th century CE onwards", why: "Enabled peaceful cooperation between merchants; spread of Islam and other cultures", keywords: ["indian ocean", "maritime", "trade", "cooperation", "merchants", "islam", "monsoons"] },
    
    { id: 25, unit: 3, term: "Trans-Saharan Trade", who: "African and Middle Eastern merchants", what: "Trade routes across Sahara Desert using camels", where: "Africa, connecting sub-Saharan Africa to North Africa/Middle East", when: "8th century CE onwards", why: "Connected West African gold with Islamic world; spread Islam into Africa", keywords: ["sahara", "desert", "camels", "gold", "salt", "islam", "west africa"] },
    
    { id: 26, unit: 3, term: "Bubonic Plague", who: "Disease pandemic", what: "Devastating plague that spread along trade routes, killing millions", where: "Asia, Europe, Africa", when: "1347-1351 CE (Black Death)", why: "Demonstrated interconnectedness of trade networks; caused massive demographic and social changes", keywords: ["plague", "black death", "pandemic", "trade routes", "demographic", "social change"] },
    
    { id: 27, unit: 3, term: "Marco Polo", who: "Venetian explorer and merchant", what: "European traveler who documented Asian trade networks and cultures", where: "Venice to China via Silk Roads", when: "1271-1295 CE", why: "His accounts increased European interest in Asian trade and exploration", keywords: ["venice", "explorer", "china", "silk roads", "trade", "european interest"] },
    
    { id: 28, unit: 3, term: "Ibn Battuta", who: "Moroccan Islamic scholar and traveler", what: "Muslim traveler who documented Islamic world and trade networks", where: "North Africa, Middle East, Asia", when: "1325-1354 CE", why: "Provided detailed accounts of Islamic world and trade; demonstrated extent of Islamic civilization", keywords: ["morocco", "islamic", "scholar", "traveler", "islamic world", "trade", "civilization"] },

    // Unit 4: Land-Based Empires (c. 1450-1750)
    { id: 29, unit: 4, term: "Ottoman Empire", who: "Turkish Islamic empire", what: "Sunni Muslim empire using gunpowder weapons and Devshirme system", where: "Turkey, Balkans, Middle East, North Africa", when: "1299-1922 CE", why: "Controlled strategic trade routes; used Janissaries and conquered Constantinople", keywords: ["ottoman", "turkish", "sunni", "gunpowder", "devshirme", "janissaries", "constantinople"] },
    
    { id: 30, unit: 4, term: "Safavid Empire", who: "Persian Shia Muslim empire", what: "Shia Muslim empire often in conflict with Ottomans", where: "Persia (modern Iran)", when: "1501-1736 CE", why: "Established Shia Islam as state religion; created rivalry with Sunni Ottomans", keywords: ["safavid", "persian", "shia", "iran", "religious rivalry", "ottoman conflict"] },
    
    { id: 31, unit: 4, term: "Mughal Empire", who: "Islamic empire in India", what: "Muslim empire unifying most of India with policies of religious tolerance", where: "Indian subcontinent", when: "1526-1857 CE", why: "United diverse Indian populations; Akbar's tolerance created stable multi-religious state", keywords: ["mughal", "india", "muslim", "religious tolerance", "akbar", "diverse", "unity"] },
    
    { id: 32, unit: 4, term: "Akbar the Great", who: "Mughal emperor", what: "Mughal ruler known for religious tolerance and integration of Hindus and Muslims", where: "Mughal Empire (India)", when: "1556-1605 CE", why: "Created stable multi-religious empire through tolerant policies and administrative reforms", keywords: ["akbar", "mughal", "religious tolerance", "hindu", "muslim", "integration", "administration"] },
    
    { id: 33, unit: 4, term: "Louis XIV", who: "French absolute monarch", what: "Sun King who exemplified European absolutism", where: "France", when: "1643-1715 CE", why: "Model of absolute monarchy; centralized French power; built Versailles as symbol of royal authority", keywords: ["louis xiv", "france", "absolutism", "sun king", "versailles", "centralization", "royal authority"] },
    
    { id: 34, unit: 4, term: "English Bill of Rights", who: "English Parliament", what: "Document limiting monarchical power and establishing parliamentary rights", where: "England", when: "1689 CE", why: "Established constitutional monarchy; protected individual rights; influenced later democratic movements", keywords: ["england", "parliament", "constitutional monarchy", "rights", "limited monarchy", "democracy"] },
    
    { id: 35, unit: 4, term: "Peter the Great", who: "Russian Tsar", what: "Russian ruler who westernized and modernized Russia", where: "Russia", when: "1682-1725 CE", why: "Modernized Russian military and government; expanded territory; made Russia a European power", keywords: ["peter great", "russia", "westernization", "modernization", "military", "european power"] },
    
    { id: 36, unit: 4, term: "Qing Dynasty", who: "Manchu rulers of China", what: "Dynasty established by Manchus after overthrowing Ming Dynasty", where: "China", when: "1644-1912 CE", why: "Last imperial dynasty of China; expanded Chinese territory; maintained Chinese culture while ruling as foreigners", keywords: ["qing", "manchu", "china", "dynasty", "expansion", "cultural continuity"] },
    
    { id: 37, unit: 4, term: "Tokugawa Shogunate", who: "Japanese military government", what: "Unified Japan under military rule with period of peace and isolation", where: "Japan", when: "1603-1867 CE", why: "Unified Japan; maintained stability through isolation; controlled contact with outside world", keywords: ["tokugawa", "japan", "shogunate", "unification", "isolation", "stability", "military rule"] },

    // Unit 5: Transoceanic Interconnections (c. 1450-1750)
    { id: 38, unit: 5, term: "Age of Exploration", who: "European maritime powers", what: "Period of European overseas exploration and colonization", where: "Global maritime routes", when: "15th-17th centuries CE", why: "Sought new trade routes to Asia; led to European colonization and global trade networks", keywords: ["exploration", "european", "maritime", "colonization", "trade routes", "global"] },
    
    { id: 39, unit: 5, term: "Caravel", who: "Portuguese and Spanish shipbuilders", what: "Improved ship design enabling long-distance ocean voyages", where: "Atlantic and other oceans", when: "15th century onwards", why: "Enabled European exploration and colonization; technological advantage in maritime travel", keywords: ["caravel", "ship", "portuguese", "spanish", "ocean voyages", "maritime technology"] },
    
    { id: 40, unit: 5, term: "Columbian Exchange", who: "Exchange between Old and New Worlds", what: "Massive exchange of diseases, foods, animals, and people between hemispheres", where: "Between Americas and Afro-Eurasia", when: "1492 CE onwards", why: "Transformed societies on both sides of Atlantic; demographic catastrophe for Native Americans", keywords: ["columbian exchange", "disease", "food", "animals", "demographic", "transformation"] },
    
    { id: 41, unit: 5, term: "Encomienda System", who: "Spanish colonial system", what: "Forced labor system granting Spanish colonists control over indigenous workers", where: "Spanish America", when: "1503-1720 CE", why: "Exploited indigenous labor for resource extraction; created racial hierarchy in colonies", keywords: ["encomienda", "spanish", "forced labor", "indigenous", "exploitation", "colonial"] },
    
    { id: 42, unit: 5, term: "Hacienda System", who: "Spanish colonial agricultural system", what: "Large estate system using various forms of coerced labor", where: "Spanish America", when: "16th century onwards", why: "Organized agricultural production; maintained social hierarchy; concentrated land ownership", keywords: ["hacienda", "spanish", "estate", "agricultural", "coerced labor", "land ownership"] },
    
    { id: 43, unit: 5, term: "Mit'a System", who: "Spanish adaptation of Inca labor system", what: "Forced labor system requiring indigenous communities to provide workers", where: "Spanish Peru and Bolivia", when: "1573 onwards", why: "Provided labor for silver mines like Potosí; continued indigenous exploitation under Spanish rule", keywords: ["mita", "spanish", "forced labor", "indigenous", "silver mines", "potosi"] },
    
    { id: 44, unit: 5, term: "Atlantic Slave Trade", who: "European, African, and American participants", what: "Forced transportation of millions of Africans to the Americas", where: "Atlantic Ocean routes", when: "16th-19th centuries CE", why: "Provided labor for plantation agriculture; created African diaspora; generated enormous profits", keywords: ["slave trade", "atlantic", "africans", "plantation", "diaspora", "middle passage"] },
    
    { id: 45, unit: 5, term: "Middle Passage", who: "Enslaved Africans and slave traders", what: "Brutal ocean voyage transporting enslaved Africans to Americas", where: "Atlantic Ocean", when: "16th-19th centuries CE", why: "Central component of Atlantic slave trade; caused death and suffering of millions", keywords: ["middle passage", "enslaved", "atlantic", "brutal", "voyage", "death", "suffering"] },
    
    { id: 46, unit: 5, term: "Triangular Trade", who: "Atlantic world merchants", what: "Three-way trade network connecting Europe, Africa, and Americas", where: "Atlantic Ocean", when: "16th-19th centuries CE", why: "Integrated Atlantic economies; based on exploitation of enslaved labor and colonial resources", keywords: ["triangular trade", "europe", "africa", "americas", "atlantic", "exploitation"] },
    
    { id: 47, unit: 5, term: "Mercantilism", who: "European economic theory", what: "Economic theory emphasizing national wealth through favorable balance of trade", where: "Europe and colonies", when: "16th-18th centuries CE", why: "Justified colonialism; led to competition between European powers; restricted colonial trade", keywords: ["mercantilism", "european", "wealth", "balance of trade", "colonialism", "competition"] },
    
    { id: 48, unit: 5, term: "Joint-Stock Companies", who: "European merchants and investors", what: "Business organizations pooling capital for overseas trade and colonization", where: "Europe and colonies", when: "16th century onwards", why: "Financed exploration and colonization; spread financial risk; enabled large-scale overseas ventures", keywords: ["joint stock", "merchants", "investors", "capital", "colonization", "exploration"] },
    
    { id: 49, unit: 5, term: "Casta System", who: "Spanish colonial social hierarchy", what: "Rigid racial classification system in Latin America", where: "Spanish America", when: "16th-19th centuries CE", why: "Maintained European dominance; created complex racial categories; influenced social mobility", keywords: ["casta", "spanish", "racial", "hierarchy", "latin america", "social mobility"] },

    // Unit 6: Revolutions (c. 1750-1900)
    { id: 50, unit: 6, term: "Enlightenment", who: "European intellectual movement", what: "Intellectual movement emphasizing reason, individualism, and natural rights", where: "Europe", when: "17th-18th centuries CE", why: "Challenged traditional authority; influenced democratic revolutions; promoted scientific thinking", keywords: ["enlightenment", "reason", "individualism", "natural rights", "democratic", "scientific"] },
    
    { id: 51, unit: 6, term: "John Locke", who: "English Enlightenment philosopher", what: "Philosopher advocating natural rights of life, liberty, and property", where: "England", when: "1632-1704 CE", why: "Influenced American Revolution; established foundation for liberal democracy and individual rights", keywords: ["john locke", "natural rights", "life", "liberty", "property", "liberal democracy"] },
    
    { id: 52, unit: 6, term: "American Revolution", who: "American colonists", what: "Colonial rebellion against British rule based on 'no taxation without representation'", where: "North America", when: "1775-1783 CE", why: "Established first modern republic; inspired other democratic revolutions; applied Enlightenment principles", keywords: ["american revolution", "colonists", "british", "taxation", "representation", "republic"] },
    
    { id: 53, unit: 6, term: "French Revolution", who: "French people", what: "Revolution overthrowing monarchy under banner of 'liberty, equality, fraternity'", where: "France", when: "1789-1799 CE", why: "Ended absolute monarchy; established principles of popular sovereignty; influenced global democratic movements", keywords: ["french revolution", "monarchy", "liberty", "equality", "fraternity", "popular sovereignty"] },
    
    { id: 54, unit: 6, term: "Reign of Terror", who: "Radical French revolutionaries", what: "Period of extreme violence during French Revolution", where: "France", when: "1793-1794 CE", why: "Demonstrated potential extremes of revolutionary change; led to reaction against radical democracy", keywords: ["reign of terror", "french revolution", "violence", "radical", "extremes"] },
    
    { id: 55, unit: 6, term: "Napoleon Bonaparte", who: "French military leader and emperor", what: "Military leader who rose during French Revolution and created European empire", where: "France and Europe", when: "1799-1815 CE", why: "Spread revolutionary and nationalist ideas across Europe; created legal codes; reshaped European politics", keywords: ["napoleon", "french", "military", "emperor", "revolutionary", "nationalist", "legal codes"] },
    
    { id: 56, unit: 6, term: "Haitian Revolution", who: "Enslaved Africans in Haiti led by Toussaint L'Ouverture", what: "Only successful slave revolt in history, creating first Black-led nation", where: "Haiti", when: "1791-1804 CE", why: "Proved enslaved people could successfully rebel; challenged racial assumptions; inspired other liberation movements", keywords: ["haitian revolution", "slave revolt", "toussaint", "black led", "liberation"] },
    
    { id: 57, unit: 6, term: "Latin American Revolutions", who: "Creoles led by Simon Bolivar and others", what: "Independence movements led by American-born Europeans against Spanish rule", where: "Latin America", when: "1808-1826 CE", why: "Created independent nations; often preserved existing social hierarchies; inspired by other revolutions", keywords: ["latin american", "revolutions", "creoles", "simon bolivar", "independence", "spanish"] },
    
    { id: 58, unit: 6, term: "Industrial Revolution", who: "Beginning in Great Britain", what: "Transformation from agricultural to industrial economy using mechanization", where: "Britain, then Europe and North America", when: "1760-1840 CE", why: "Created modern industrial economy; urbanization; new social classes; changed labor patterns", keywords: ["industrial revolution", "britain", "mechanization", "factory", "urbanization", "social classes"] },
    
    { id: 59, unit: 6, term: "Factory System", who: "Industrial entrepreneurs and workers", what: "Centralized production system using machinery and division of labor", where: "Industrial regions", when: "18th-19th centuries CE", why: "Increased production efficiency; created industrial working class; changed nature of work", keywords: ["factory system", "production", "machinery", "division of labor", "working class"] },
    
    { id: 60, unit: 6, term: "Adam Smith", who: "Scottish economist", what: "Economist who described principles of capitalism and free markets", where: "Scotland/Britain", when: "1723-1790 CE", why: "Provided intellectual foundation for capitalist economics; influenced economic policy globally", keywords: ["adam smith", "capitalism", "free markets", "economics", "wealth of nations"] },
    
    { id: 61, unit: 6, term: "Labor Unions", who: "Industrial workers", what: "Organizations formed by workers to protect their rights and improve conditions", where: "Industrial areas", when: "19th century CE onwards", why: "Protected worker rights; improved working conditions; challenged industrial capitalism", keywords: ["labor unions", "workers", "rights", "conditions", "industrial", "collective bargaining"] },
    
    { id: 62, unit: 6, term: "Karl Marx", who: "German philosopher and economist", what: "Theorist who developed communist ideology advocating worker ownership of means of production", where: "Germany/England", when: "1818-1883 CE", why: "Created theoretical foundation for communist movements; analyzed capitalism; influenced global politics", keywords: ["karl marx", "communist", "worker ownership", "means of production", "capitalism", "theory"] },

    // Unit 7: Consequences of Industrialization (c. 1750-1900)
    { id: 63, unit: 7, term: "New Imperialism", who: "European industrial powers", what: "Late 19th century imperial expansion driven by industrial needs", where: "Africa, Asia", when: "1870-1914 CE", why: "Sought raw materials and markets; justified by racial theories; reshaped global power relations", keywords: ["new imperialism", "european", "industrial", "raw materials", "markets", "racial theories"] },
    
    { id: 64, unit: 7, term: "Social Darwinism", who: "European racial theorists", what: "Pseudo-scientific theory claiming biological superiority of white Europeans", where: "Europe and colonies", when: "Late 19th century CE", why: "Justified imperial domination and racial discrimination; influenced colonial policies", keywords: ["social darwinism", "racial", "biological superiority", "europeans", "imperial", "discrimination"] },
    
    { id: 65, unit: 7, term: "Berlin Conference", who: "European powers", what: "Meeting where Europeans partitioned Africa without African participation", where: "Berlin, Germany", when: "1884-1885 CE", why: "Divided Africa among European powers; ignored ethnic and cultural boundaries; accelerated colonization", keywords: ["berlin conference", "european", "partition", "africa", "colonization", "boundaries"] },
    
    { id: 66, unit: 7, term: "British Raj", who: "British colonial government in India", what: "Direct British rule over India following Indian Rebellion of 1857", where: "Indian subcontinent", when: "1858-1947 CE", why: "Consolidated British control; exploited Indian resources; created unified administrative system", keywords: ["british raj", "india", "colonial", "rebellion", "administrative", "exploitation"] },
    
    { id: 67, unit: 7, term: "Spheres of Influence", who: "European powers in China", what: "Regions where European powers had exclusive economic privileges without formal control", where: "China", when: "Late 19th-early 20th century CE", why: "Allowed economic exploitation without full colonization; weakened Chinese sovereignty", keywords: ["spheres of influence", "china", "european", "economic", "privileges", "sovereignty"] },
    
    { id: 68, unit: 7, term: "Meiji Restoration", who: "Japanese reformers", what: "Political revolution that rapidly industrialized and modernized Japan", where: "Japan", when: "1868 CE onwards", why: "Transformed Japan into modern industrial power; enabled Japanese imperialism; avoided colonization", keywords: ["meiji restoration", "japan", "industrialization", "modernization", "political revolution"] },
    
    { id: 69, unit: 7, term: "Indian National Congress", who: "Indian nationalist organization", what: "Political organization advocating for Indian self-rule and independence", where: "India", when: "1885 CE onwards", why: "Led Indian independence movement; represented Indian interests against British rule", keywords: ["indian national congress", "nationalist", "self-rule", "independence", "british rule"] },
    
    { id: 70, unit: 7, term: "Indentured Servitude", who: "Asian and other workers", what: "Contract labor system replacing slavery in many regions", where: "Global, especially former slave regions", when: "19th century CE", why: "Provided labor for plantations and construction; created new patterns of global migration", keywords: ["indentured servitude", "contract labor", "migration", "plantations", "post-slavery"] },
    
    { id: 71, unit: 7, term: "Chinese Exclusion Act", who: "United States government", what: "Law prohibiting Chinese immigration to United States", where: "United States", when: "1882 CE", why: "Demonstrated racial discrimination; reflected anti-Asian sentiment; restricted migration patterns", keywords: ["chinese exclusion", "united states", "immigration", "racial discrimination", "anti-asian"] },
    
    { id: 72, unit: 7, term: "White Australia Policy", who: "Australian government", what: "Immigration policy favoring European immigrants and restricting non-white immigration", where: "Australia", when: "1901-1973 CE", why: "Maintained white dominance in Australia; reflected global patterns of racial discrimination", keywords: ["white australia", "immigration", "european", "racial discrimination", "white dominance"] },

    // Unit 8: Global Conflict (c. 1900-Present)
    { id: 73, unit: 8, term: "World War I", who: "Global powers", what: "First global industrial war characterized by trench warfare and massive casualties", where: "Europe, Africa, Middle East, Pacific", when: "1914-1918 CE", why: "Ended four empires; redrew world map; demonstrated destructiveness of modern warfare", keywords: ["world war one", "trench warfare", "industrial war", "casualties", "empires"] },
    
    { id: 74, unit: 8, term: "MAIN Causes", who: "European powers", what: "Militarism, Alliances, Imperialism, and Nationalism as causes of WWI", where: "Europe", when: "Early 20th century", why: "Created tensions leading to global conflict; demonstrated interconnectedness of modern world", keywords: ["militarism", "alliances", "imperialism", "nationalism", "wwi causes"] },
    
    { id: 75, unit: 8, term: "Total War", who: "Nations in WWI and WWII", what: "Warfare involving entire populations and economies, not just military", where: "Global during world wars", when: "20th century", why: "Mobilized entire societies for war effort; blurred lines between military and civilian", keywords: ["total war", "population", "economy", "mobilization", "civilian", "military"] },
    
    { id: 76, unit: 8, term: "Treaty of Versailles", who: "Allied powers", what: "Punitive peace treaty ending WWI, forcing Germany to accept blame and pay reparations", where: "Versailles, France", when: "1919 CE", why: "Created resentment in Germany; contributed to rise of Nazism; redrew European boundaries", keywords: ["versailles", "treaty", "germany", "reparations", "blame", "nazism"] },
    
    { id: 77, unit: 8, term: "Great Depression", who: "Global economic crisis", what: "Worldwide economic collapse beginning with US stock market crash", where: "Global", when: "1929-1939 CE", why: "Destabilized global economy; contributed to rise of fascism; led to government economic intervention", keywords: ["great depression", "economic", "collapse", "stock market", "fascism", "government intervention"] },
    
    { id: 78, unit: 8, term: "Adolf Hitler", who: "Nazi leader of Germany", what: "Fascist dictator who led Germany into WWII and orchestrated Holocaust", where: "Germany", when: "1933-1945 CE", why: "Demonstrated dangers of totalitarianism; caused WWII; responsible for genocide and massive destruction", keywords: ["hitler", "nazi", "fascist", "dictator", "holocaust", "genocide", "totalitarian"] },
    
    { id: 79, unit: 8, term: "Appeasement", who: "Western democracies", what: "Policy of giving in to aggressive demands to avoid conflict", where: "Europe", when: "1930s CE", why: "Failed to prevent WWII; demonstrated weakness of democratic response to fascism", keywords: ["appeasement", "western democracies", "aggressive", "conflict", "fascism"] },
    
    { id: 80, unit: 8, term: "Holocaust", who: "Nazi Germany", what: "Systematic genocide of six million Jews and five million others", where: "Nazi-occupied Europe", when: "1941-1945 CE", why: "Demonstrated ultimate consequences of racism and totalitarianism; changed understanding of human rights", keywords: ["holocaust", "nazi", "genocide", "jews", "systematic", "human rights"] },
    
    { id: 81, unit: 8, term: "World War II", who: "Global powers", what: "Deadliest conflict in human history with 75 million deaths", where: "Global", when: "1939-1945 CE", why: "Established US and USSR as superpowers; led to decolonization; created UN and modern world order", keywords: ["world war two", "deadliest", "conflict", "superpowers", "decolonization", "united nations"] },

    // Unit 9: Cold War & Decolonization (c. 1900-Present)
    { id: 82, unit: 9, term: "Cold War", who: "United States and Soviet Union", what: "Ideological struggle between capitalism and communism", where: "Global", when: "1945-1991 CE", why: "Shaped global politics for decades; led to proxy wars; created bipolar world order", keywords: ["cold war", "united states", "soviet union", "capitalism", "communism", "bipolar"] },
    
    { id: 83, unit: 9, term: "Containment", who: "United States policy", what: "US strategy to prevent spread of communism", where: "Global", when: "1947 onwards", why: "Defined US foreign policy during Cold War; led to multiple interventions and conflicts", keywords: ["containment", "united states", "communism", "foreign policy", "interventions"] },
    
    { id: 84, unit: 9, term: "Truman Doctrine", who: "US President Harry Truman", what: "Policy of supporting free peoples against communist threats", where: "Global, initially Greece and Turkey", when: "1947 CE", why: "Marked beginning of active US role in containing communism worldwide", keywords: ["truman doctrine", "free peoples", "communist", "threats", "containment"] },
    
    { id: 85, unit: 9, term: "Marshall Plan", who: "United States", what: "US economic aid program to rebuild Western Europe", where: "Western Europe", when: "1948-1952 CE", why: "Rebuilt European economy; prevented communist expansion; strengthened US-European alliance", keywords: ["marshall plan", "economic aid", "western europe", "rebuild", "communist expansion"] },
    
    { id: 86, unit: 9, term: "NATO", who: "Western alliance", what: "North Atlantic Treaty Organization military alliance", where: "North Atlantic region", when: "1949 CE onwards", why: "Created collective defense against Soviet threat; institutionalized Western alliance", keywords: ["nato", "military alliance", "collective defense", "soviet", "western alliance"] },
    
    { id: 87, unit: 9, term: "Warsaw Pact", who: "Soviet-led alliance", what: "Eastern European communist military alliance", where: "Eastern Europe", when: "1955-1991 CE", why: "Soviet response to NATO; institutionalized division of Europe during Cold War", keywords: ["warsaw pact", "soviet", "communist", "military alliance", "eastern europe"] },
    
    { id: 88, unit: 9, term: "Berlin Wall", who: "East German government", what: "Concrete barrier dividing East and West Berlin", where: "Berlin, Germany", when: "1961-1989 CE", why: "Symbol of Cold War division; demonstrated failure of communist system when it fell", keywords: ["berlin wall", "east germany", "barrier", "cold war", "division", "symbol"] },
    
    { id: 89, unit: 9, term: "Korean War", who: "North and South Korea, major powers", what: "Proxy war between communist North and capitalist South", where: "Korean Peninsula", when: "1950-1953 CE", why: "First major Cold War conflict; established pattern of limited proxy wars", keywords: ["korean war", "proxy war", "communist", "capitalist", "cold war conflict"] },
    
    { id: 90, unit: 9, term: "Vietnam War", who: "North and South Vietnam, US", what: "Long proxy war resulting in communist victory", where: "Vietnam", when: "1955-1975 CE", why: "Demonstrated limits of US power; turned American public against Cold War interventions", keywords: ["vietnam war", "proxy war", "communist victory", "us power", "public opinion"] },
    
    { id: 91, unit: 9, term: "Cuban Missile Crisis", who: "US, Soviet Union, Cuba", what: "Nuclear standoff bringing world closest to nuclear war", where: "Cuba", when: "1962 CE", why: "Demonstrated dangers of nuclear weapons; led to improved US-Soviet communication", keywords: ["cuban missile crisis", "nuclear", "standoff", "nuclear war", "us soviet"] },
    
    { id: 92, unit: 9, term: "Mutual Assured Destruction", who: "Nuclear powers", what: "Nuclear strategy based on certainty of mutual annihilation", where: "Global", when: "Cold War period", why: "Prevented nuclear war through fear; created tense but stable balance of power", keywords: ["mad", "mutual assured destruction", "nuclear", "annihilation", "balance of power"] },
    
    { id: 93, unit: 9, term: "Mao Zedong", who: "Chinese Communist leader", what: "Leader who established Communist China and launched radical campaigns", where: "China", when: "1949-1976 CE", why: "Created world's most populous communist state; his policies caused millions of deaths", keywords: ["mao zedong", "chinese communist", "communist china", "radical campaigns", "deaths"] },
    
    { id: 94, unit: 9, term: "Great Leap Forward", who: "Chinese Communist Party under Mao", what: "Failed attempt to rapidly industrialize China causing massive famine", where: "China", when: "1958-1962 CE", why: "Demonstrated failures of communist central planning; caused millions of deaths from starvation", keywords: ["great leap forward", "industrialize", "china", "famine", "communist planning", "starvation"] },
    
    { id: 95, unit: 9, term: "Cultural Revolution", who: "Chinese Communist Party under Mao", what: "Violent campaign to purge perceived enemies and enforce ideological purity", where: "China", when: "1966-1976 CE", why: "Destroyed traditional Chinese culture; caused widespread persecution and death", keywords: ["cultural revolution", "violent", "purge", "ideological", "persecution", "traditional culture"] },
    
    { id: 96, unit: 9, term: "Decolonization", who: "Former European colonies", what: "Process of colonies gaining independence after WWII", where: "Africa, Asia", when: "1945-1980s CE", why: "Created many new nations; ended European empires; often led to political instability", keywords: ["decolonization", "independence", "european colonies", "new nations", "political instability"] },
    
    { id: 97, unit: 9, term: "Mohandas Gandhi", who: "Indian independence leader", what: "Leader who used nonviolent resistance to achieve Indian independence", where: "India", when: "1869-1948 CE", why: "Demonstrated power of nonviolent resistance; influenced civil rights movements globally", keywords: ["gandhi", "nonviolent", "resistance", "indian independence", "civil rights"] },
    
    { id: 98, unit: 9, term: "Partition of India", who: "British government and Indian leaders", what: "Division of India into Hindu-majority India and Muslim-majority Pakistan", where: "Indian subcontinent", when: "1947 CE", why: "Created two new nations but caused massive population displacement and violence", keywords: ["partition", "india", "pakistan", "hindu", "muslim", "displacement", "violence"] },
    
    { id: 99, unit: 9, term: "Kwame Nkrumah", who: "Ghanaian independence leader", what: "Leader who achieved peaceful independence for Ghana", where: "Ghana (Gold Coast)", when: "1957 CE", why: "First sub-Saharan African colony to gain independence; inspired other African independence movements", keywords: ["kwame nkrumah", "ghana", "peaceful independence", "sub-saharan", "african independence"] },
    
    { id: 100, unit: 9, term: "Algerian War", who: "Algeria and France", what: "Violent war of independence resulting in Algerian independence", where: "Algeria", when: "1954-1962 CE", why: "Demonstrated costs of maintaining empire; showed that violent resistance could succeed", keywords: ["algerian war", "independence", "violent", "france", "empire", "resistance"] },
    
    { id: 101, unit: 9, term: "Mikhail Gorbachev", who: "Soviet leader", what: "Reformist leader whose policies led to end of Cold War", where: "Soviet Union", when: "1985-1991 CE", why: "His reforms of glasnost and perestroika led to collapse of Soviet system", keywords: ["gorbachev", "soviet", "reformist", "glasnost", "perestroika", "collapse"] },

    // Unit 10: Globalization (c. 1900-Present)
    { id: 102, unit: 10, term: "Green Revolution", who: "Agricultural scientists and developing nations", what: "Dramatic increase in agricultural yields through new crop varieties and fertilizers", where: "Global, especially Asia and Latin America", when: "1950s-1960s CE", why: "Fed growing global population; increased food security but created environmental problems", keywords: ["green revolution", "agricultural", "crop varieties", "fertilizers", "food security", "environmental"] },
    
    { id: 103, unit: 10, term: "Internet", who: "Global communication network", what: "Worldwide computer network revolutionizing communication and information", where: "Global", when: "1990s CE onwards", why: "Connected world instantly; enabled globalization; transformed economy and society", keywords: ["internet", "communication", "computer network", "globalization", "economy", "society"] },
    
    { id: 104, unit: 10, term: "Penicillin", who: "Alexander Fleming and medical researchers", what: "First antibiotic, revolutionizing treatment of bacterial infections", where: "Global", when: "1928 discovered, 1940s mass produced", why: "Saved millions of lives; began antibiotic era; transformed medical treatment", keywords: ["penicillin", "antibiotic", "bacterial infections", "medical", "treatment", "lives saved"] },
    
    { id: 105, unit: 10, term: "Multinational Corporations", who: "Global businesses", what: "Companies operating in multiple countries with global reach", where: "Global", when: "20th century onwards", why: "Drove economic globalization; created global labor markets; concentrated economic power", keywords: ["multinational", "corporations", "global", "companies", "economic globalization", "labor markets"] },
    
    { id: 106, unit: 10, term: "World Trade Organization", who: "International trade organization", what: "Global organization regulating international trade", where: "Global", when: "1995 CE", why: "Promoted free trade; reduced trade barriers; facilitated economic globalization", keywords: ["wto", "world trade", "international trade", "free trade", "trade barriers", "globalization"] },
    
    { id: 107, unit: 10, term: "Universal Declaration of Human Rights", who: "United Nations", what: "International document establishing fundamental human rights", where: "Global", when: "1948 CE", why: "Established global human rights standards; inspired civil rights movements worldwide", keywords: ["human rights", "united nations", "fundamental rights", "global standards", "civil rights"] },
    
    { id: 108, unit: 10, term: "Global Feminism", who: "Women's rights advocates worldwide", what: "International movement for women's equality and rights", where: "Global", when: "20th century onwards", why: "Advanced women's suffrage and equality; challenged traditional gender roles globally", keywords: ["feminism", "women's rights", "equality", "suffrage", "gender roles", "global movement"] },
    
    { id: 109, unit: 10, term: "Civil Rights Movement", who: "African Americans and allies", what: "US movement for racial equality and civil rights", where: "United States", when: "1950s-1960s CE", why: "Ended legal segregation; inspired global human rights movements; advanced racial equality", keywords: ["civil rights", "african americans", "racial equality", "segregation", "human rights"] },
    
    { id: 110, unit: 10, term: "Nelson Mandela", who: "South African anti-apartheid leader", what: "Leader who helped end apartheid and became South Africa's first Black president", where: "South Africa", when: "1918-2013 CE", why: "Ended racial segregation in South Africa; symbol of peaceful transition from oppression to democracy", keywords: ["nelson mandela", "apartheid", "south africa", "black president", "racial segregation", "democracy"] },
    
    { id: 111, unit: 10, term: "Apartheid", who: "South African white minority government", what: "System of institutionalized racial segregation in South Africa", where: "South Africa", when: "1948-1994 CE", why: "Extreme example of racial oppression; its end symbolized victory of human rights over racism", keywords: ["apartheid", "racial segregation", "south africa", "white minority", "oppression", "human rights"] },
    
    { id: 112, unit: 10, term: "Environmentalism", who: "Environmental activists and scientists", what: "Global movement addressing pollution, resource depletion, and climate change", where: "Global", when: "1960s onwards", why: "Raised awareness of environmental threats; led to international environmental agreements", keywords: ["environmentalism", "pollution", "climate change", "environmental", "global movement", "agreements"] },
    
    { id: 113, unit: 10, term: "Greenpeace", who: "Environmental activist organization", what: "International environmental organization opposing environmental destruction", where: "Global", when: "1971 CE onwards", why: "Pioneered direct action environmentalism; raised global environmental awareness", keywords: ["greenpeace", "environmental", "activist", "environmental destruction", "direct action", "awareness"] },
    
    { id: 114, unit: 10, term: "Paris Agreement", who: "International climate accord", what: "Global agreement to combat climate change", where: "Global", when: "2015 CE", why: "First universal climate agreement; demonstrated global cooperation on environmental issues", keywords: ["paris agreement", "climate change", "global agreement", "universal", "environmental", "cooperation"] },
    
    { id: 115, unit: 10, term: "United Nations", who: "International organization", what: "Global organization promoting international cooperation and peace", where: "Global", when: "1945 CE", why: "Replaced League of Nations; forum for international diplomacy; peacekeeping operations", keywords: ["united nations", "international", "cooperation", "peace", "diplomacy", "peacekeeping"] }
];

export default worldTerms;

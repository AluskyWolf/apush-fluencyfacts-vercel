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
    { id: 25, unit: 3, term: "Great Compromise", who: "Congress: small states vs big states, Madison, Sherman", what: "Compromise between VA, NJ plans after the impasse almost destroyed the Constitution. Proposed by Roger Sherman: bicameral legislature - one based on population, one on equal representation.", where: "Philadelphia", when: "1787", why: "Show ability to compromise in the critical period to repair the inadequacies of the Article of Confederation. Balances power between big and small states, North and South, commerce + slavery." },
    { id: 26, unit: 3, term: "Federalist Papers", who: "Hamilton, Madison, Jay", what: "Collection of essays that supported ratification of the constitution aimed at citizens of New York. Most famous: Madison's #10, 51", where: "US", when: "1788", why: "Division between federalists, anti-federalists, addressed fears about constitution, Important source for understanding the Constitution." },
    { id: 27, unit: 3, term: "Hamilton's Economic Plan", who: "Hamilton, G Washington", what: "Set of measures:Assumption of states + federal debt; Establish a national bank; Encourage manufacturing in the US through taxes, tariffs", where: "US", when: "1790", why: "Foundation of strong role of federal government in economy" },
    { id: 28, unit: 3, term: "Jay's Treaty", who: "John Jay, British Gov't, US Gov't", what: "GB to withdraw all ships from US territory & western outposts. Given \"most favored nation\" status, opposed by Jeffersonians", where: "US", when: "1794", why: "To avert war over British seizure of US ships required passage of Pinckney treaty to appease Jeffersonians. Passed by razor slim margin. Leads to conflict: XYZ Affair." },
    { id: 29, unit: 3, term: "Washington's Farewell Address", who: "George Washington", what: "Letter written by GW at end of 2nd term. Focus on preservation of union, danger of factions, should trade w/ foreign countries; avoid political connections and alliances", where: "US", when: "1796", why: "Warning and inspiration for future generations. Influenced US foreign policy until end of 19th century. Precedent of two terms for presidents. Won't be broken until FDR." },
    { id: 30, unit: 3, term: "XYZ Affair", who: "John Adams, American and French Diplomats", what: "Caused by Jay's Treaty. American peace delegation in France, 3 agents of the French Foreign Minister (X, Y, Z in Adams' initial communications with Congress), & Foreign Minister's demand for a bribe from the American delegation.", where: "United States, France", when: "1797-8", why: "Resulted in a limited, undeclared war known as the Quasi-War. Raised anti-French sentiment which caused the passage of the Alien and Sedition Acts and the establishment of Department of the Navy to oversee naval affairs." },
    { id: 31, unit: 3, term: "Alien & Sedition Acts", who: "Congress, Adams, Jefferson", what: "Act curtailed freedom of press, jailed newspaper editors, created harsher requirements for immigrants to become citizens. Goal:minimze power of JDRs. Removed by Jefferson.", where: "US", when: "1798", why: "Blatantly against the 1st Amendment but Federalist Party controlled the Executive & Legislative branches; Supreme Court has little power at this point. Experimentation with compact theory & nullification in response." },

    // Unit 4
    { id: 32, unit: 4, term: "Marbury v Madison", who: "Marbury, Madison, Marshall", what: "Midnight judges instated by Adams, Madison (TJ sec of state) tries to remove, Marbury sues", where: "US", when: "1803", why: "Established role of supreme court, judicial review courts have duty to say what law is but not to enforce it." },
    { id: 33, unit: 4, term: "American System", who: "Henry Clay, Madison, Jackson", what: "Way to unite the country economically. Bank, tariff, internal improvements (roads, canals). Goal: make America less reliant on foreign made goods. Effect of War of 1812. Tariffs, BUS go through. Few victories for internal improvements.", where: "US", when: "1816-1830", why: "Gov't sponsored econ development, protected new industries, reduce dependence on foreign made goods. Important for infrastructure;t increases sectionalism; North, West benefit more. Furthering ideas of Hamilton's Economic Plan." },
    { id: 34, unit: 4, term: "Monroe Doctrine", who: "John Quincy Adams, James Monroe", what: "Statement issued saying that western Hem. was closed off to further colonization, in return US will stay out of European affairs.", where: "US", when: "1823", why: "Could not enforce, Britain would have to assist. \"Big bark from small dog\". Won't be utilized until 1840s - Polk, Tyler. Shows US to be participating more in global affairs." },
    { id: 35, unit: 4, term: "Market Revolution", who: "Entrepreneurs, lowell, Slater", what: "Rapid development in transportation, commercialization and industrialization", where: "US, especially in North", when: "1800-1840", why: "Industrial regionalization, (North vs south) shift towards paid labor, factory work, and more opportunity for women in industrial workforce" },
    { id: 36, unit: 4, term: "2nd Great Awakening", who: "Charles Finney, Peter Cartwright, Richard Allen", what: "Religious revival starts in Burned Over District (NY), spread south amongst slaves and white southerners. Rejection of Calvinism. Increase in Baptist, Methodist Churches.", where: "US", when: "1790s-1830s", why: "Emphasis on individual piety, role in improving society. Creates a distinctly African American brand of Christianity: Bethel. Increases literacy rates, esp in South. Impact on reform: Temperance, Asylums, Education, Utopias, Women's Movement etc." },
    { id: 37, unit: 4, term: "Seneca Falls Convention", who: "Lucretia Mott, Elizabeth Cady Stanton", what: "Women's rights convention resulted in Declaration of Sentiments modeled after Dec of Indep. Launched the Women's Rights Movement. Controversy over suffrage resolution.", where: "Seneca Falls, NY", when: "1848", why: "Part of national reform community response to market revolution, 2nd Great Awakening. Potent symbol of equality, some regard it as the birthplace of American feminism. Eventually leads to the passage of the 19th Amendment." },
    { id: 38, unit: 4, term: "Nullification Crisis", who: "South Carolina, Jackson, Calhoun", what: "SC nullifies the Tariff of 1832, resignation of Calhoun (AJ's VP). Tariffs hurt South more than other regions. AJ issues Force Bill to compel collection of tariff duties. Compromise reached:Tariff of 1833, SC relents; nullifies Force Bill.", where: "SC", when: "1832-1833", why: "Highlights States rights, nullifcation theory. Compromise possible because of Henry Clay. Avoidance of Civil War as a result but was a prelude to secession. Made Southerners more aware of their minority status vs Northern majority status in gov't." },
    { id: 39, unit: 4, term: "Bank War", who: "Jackson, Nicholas Biddle, Clay", what: "Jackson opposed the renewal of the bank charter. Saw it as undemocratic. Biddle, Clay tried to recharter early. Clay couldn't override AJ\"s veto in Congress.", where: "US", when: "1832", why: "Effective end of American system, led to the formation of the Whig Party who opposed Jackson. Led to financial panic in 1837. No nat'l bank until Fed Reserve in 1914" },
    { id: 40, unit: 4, term: "2nd American Party System", who: "AJ, Clay, Dems, Whigs", what: "Term used to describe party system during Jacksonian era. Lines draw among anti bank Jacksonians and pro American System Whigs. High voter interest, close elections.", where: "US", when: "1828-1854", why: "Reflected and shaped political, social, and cultural attitudes during era of Jacksonian Democracy. Change in party politics: use of conventions, executive as head of political party, white manhood suffrage. Use of spoils system." },
    { id: 41, unit: 4, term: "Indian Removal Act", who: "Jackson, congress, Southern Civilized tribes", what: "Money, law to relocate tribes by force if necessary. NAI who assimilated were not free from this. AJ ignores 2 supreme court cases that said Cherokees were \"domestic dependent nations\"", where: "Georgia Alabama, Mississippi, Florida → Ok", when: "1830", why: "Many tribes resisted, ended in Trail of Tears and forced removal; thousands died. Opened 25 million acres to white settlers. Departure from respecting sovereign rights of NAI. Seminole resisted; wars last until 1842 in Florida." },
    { id: 42, unit: 4, term: "Missouri Compromise", who: "Slave states, free states, Henry Clay", what: "Missouri added as a slave state, Maine as free state, line established by congress (36/30) dictates states of slavery added in the future", where: "US, Missouri, Maine 36'30 line", when: "1820", why: "Senate stayed balanced between free states and slave states. Compromise is still possible but no long term solution for removing slavery from the nation. Will bring more people to Abolition. Leads to more sectionalism, violence." },
    { id: 43, unit: 4, term: "Nat Turner's Rebellion", who: "Nat Turner", what: "An armed rebellion as a form of retribution of enslaved people, led by Nat Turner killing 57 whites. Put down by state militia.", where: "Virginia", when: "1831", why: "Destroyed myth of happy, docile slaves. Led to harsher punishments toward slaves, slave codes controlling movement, access to education. Hardens views on both sides, hastening Civil War" },

    // Unit 5
    { id: 44, unit: 5, term: "Manifest Destiny", who: "American Settlers, O'sullivan", what: "Belief that stressed Americans were destined to expand from coast to coast because of God given gifts of civilization, democracy. Boosts economic opportunities for some.", where: "West", when: "1845-1900", why: "Justified aggressive expansion, NAI removal, sparked war with Mexico. Extension of American Exceptionalism. Gov't aids in movement west through RR subsidies. Raises questions about what rights NAI, slaves, Mexicans should hold." },
    { id: 45, unit: 5, term: "Mexican American War", who: "Pres Polk, Gen Zachary Taylor, Santa Anna", what: "1st US armed conflict fought on foreign soil. Resolved by Treaty of Hidalgo, Mexico cedes CA and NM, Rio grande becomes border between Texas and Mexico, pays 15 mil for SW territory.", where: "NM, CA, TX", when: "1846-1848", why: "Politically divisive, set precedent for territorial acquisitions. Reignites slavery debate with Wilmot Proviso. Shows aggressive mood of Manifest Destiny; lights fuse that will fuel the Civil War." },
    { id: 46, unit: 5, term: "Know Nothing Party", who: "Whigs, disaffected by N. democrats", what: "The American party. Based on nativism: anti-catholic, anti-irish, participates in Bloody Kansas, later split because of slavery issue, many go to Rep. Party", where: "US", when: "1854", why: "Shows intense nativism, anti-immigrant sentiment after increased immigration of the 40s and 50s" },
    { id: 47, unit: 5, term: "Compromise of 1850", who: "Henry Clay, Calhoun, Daniel Webster", what: "Neg'd last attempt to settle slavery issue 1 CA becomes a free state 2 People in NM and UT decide on slavery 3 Slave trades end in DC 4 Stricter Fugitive slave Laws 5 TX gives up land claims", where: "Western territories", when: "1850", why: "Outrage over the bill leads to heightened traffic on Underground RR, more people to abolitionist cause. Last peaceful resolution of disagreement between north and south, shows compromise is still possible but the Civil War is looming and potentially inevitable." },
    { id: 48, unit: 5, term: "Republican Party", who: "Republicans, Former Whigs, Free Soilers", what: "New political party founded in wake of Kansas Nebraska Act. Anti Slavery activists, Conscience Whigs, Becomes main opposition to Democratic Party.", where: "NE", when: "1854", why: "Elected Lincoln in 1860. Champions of Reconstruction post War. Still one of the 2 main parties today: ideology during this time is more aligned with modern democrats" },
    { id: 49, unit: 5, term: "Kansas Nebraska Act", who: "Stephen Douglas, Calhoun, Clay, Webster", what: "Propose opening northern indian territory (KS, NE) allowing their position on slavery to be decided based on popular sovereignty", where: "Kansas, Nebraska", when: "1854", why: "Impetus for bleeding kansas and Lecompton constitution, overwrites Missouri compromise by permitting slavery above Mason Dixon line." },
    { id: 50, unit: 5, term: "Dred Scott Decision", who: "Dred Scott, Judge Taney", what: "Scott sued for freedom after being moved to free territory. Said slaves not citizens, but property. Missouri comp declared unconstitutional, slaves cannot sue.", where: "Supreme Court", when: "1857", why: "One of the Court's most controversial decisions (anti-canon). Gave momentum to the abolition movement and served as one of the last stepping stones to the Civil War." },
    { id: 51, unit: 5, term: "Emancipation Proclamation", who: "Lincoln, Confederate states", what: "Abe frees all slaves in states still in rebellion on Jan 1st,1863 after Battle of Antietam. Didn't have jurisdiction, kept slavery legal where he could have freed them (like border states)", where: "US confederacy", when: "1862-1863", why: "Precursor to 13th amendment, focused civil war more on slavery issue. Way to solve Fugitive Slave Act, need for soldiers = political, legal, military necessity." },
    { id: 52, unit: 5, term: "Homestead Act", who: "Republican Congress, Lincoln", what: "Congressional act by Congress, giving land sales in the West. Could get 160 acres for a small fee, promise to improve land in some ways", where: "US, West", when: "1862", why: "Large impetus for western expansion. Leads to problems for Plains Tribes, overworking of land by inexperienced farmers - ecological issues in the future like the Dust Bowl." },
    { id: 53, unit: 5, term: "Gettysburg Address", who: "Lincoln", what: "At a dedication ceremony for the Gettysburg ceremony and to honor those who died at Gettysburg, Lincoln gives speech to rally morale in the Union to preserve the union and its freedoms", where: "Gettysburg, PA", when: "1863", why: "Lincoln connects the Civil war to the fight for freedom and equality, rather than simply a fight to preserve union. Invokes connections to the Dec of Independence and that \"all men are created equal\"" },
    { id: 54, unit: 5, term: "Reconstruction Amendments", who: "Radical republicans, former slaves", what: "13-15th amendments: slavery, citizenship, voting. Opposed by women right's groups. Condition of reentry for seceding states. Fed protection of rights for African Americans.", where: "US", when: "Ratified 1865, 1868, 1870", why: "Accomplished immediate goal of reconstruction (rights + reunification). Continuation of Emancipation Proclamation so these rights would be enshrined in the Constitution. Federal gov't as protector of voting rights not states." },
    { id: 55, unit: 5, term: "Sharecropping", who: "Freed slaves, southern landowners", what: "System of farming which owned by a white person. Poor farmers (mostly black) paid for their rent in some percentages of the goods produced", where: "South", when: "Late 1860s-1940s", why: "Allowed further oppression of the officially enfranchised freedmen, predominant farming system in post civil war south. Keeps blacks down economically in the South until WW2." },
    { id: 56, unit: 5, term: "Jim Crow Laws/Black Codes", who: "African Americans, local governments", what: "State and local laws legalizing segregation throughout the US. Slavery by another name. Denied opportunties for voting, jobs, education. Paired w/ sharecropping = steps backward for blacks in the South.", where: "US", when: "1880s-1968", why: "Upheld and enforced a system of white supremacy and entrenched racism in the structures of society in Southern states. Use of fear and intimindation - KKK, White League." },
    { id: 57, unit: 5, term: "Compromise of 1877", who: "Rutherford B Hayes, Sam Tilden", what: "Compromise ending the contested election of 1876 by placing Republican Hayes in office but removing oppressive Northern military influence in South", where: "South", when: "1877", why: "Formally ended military reconstruction of the south, hinted at the end of republican national dominance. \"Great Betrayal\" as it will result in entrenchment of discriminatory laws (Jim Crow) and erosion of racial equality in the south." },

    // Unit 6
    { id: 58, unit: 6, term: "Gilded Age", who: "Mark Twain, upper class", what: "Rapid econ growth between end of Civil War and the 20th Century. Leads to conspicuous consumption, corruption of industrialists at expense of working class.", where: "US", when: "Late 19th Century", why: "Ushered in the modern age of American cities. Evidence of shifting morality, gap between rich & poor, excesses of 2nd industrial Revolution. Leads to labor, progressive/populist movements." },
    { id: 59, unit: 6, term: "Gospel of Wealth", who: "Andrew Carnegie", what: "Treatise written by Carnegie that said rich had duty to be charitable, establish libraries, museums, colleges. This would be a way to balance wealth inequality and limit rich just passing their $ to their heirs.", where: "US", when: "1889", why: "Goal was to limit wasteful spending of the rich (conspicuous consumption). Called into question duty of rich people. Advocated individual philanthropy similar to idea of trickle down economics." },
    { id: 60, unit: 6, term: "Political Machines", who: "Boss Tweed, Thomas Nast", what: "Corrupt political entities like Tammany Hall controlled by a boss that wielded immense power over local/state politics. Controlled tax rates, exchanged favors/votes for jobs especially for immigrants Stole millions from taxpayers.", where: "NY, Chicago, Philadelphia", when: "1830s-1930", why: "Thrived off kickbacks and bribes from businesses. Prime example of fraud, political domination +graft in Gilded Age. Made it difficult for qualified people to break into political office (Teddy Roosevelt). Later faced scrutiny from critics like Nast and Pendleton Act of 1883." },
    { id: 61, unit: 6, term: "The New South", who: "Former Confederacy, American South", what: "New social/political/economic systems in the South post Civil War in an attempt to rebuild the South - industrialize, modernize", where: "South", when: "1877", why: "South was primarily slave based economy and had to figure out how to create a new way to create revenue. Not very successful. Share cropping, segregation continues." },
    { id: 62, unit: 6, term: "Dawes Severalty Act", who: "Congress, NAI, Grover Cleveland, Sen. Henry Dawes", what: "Act ending tribal ownership of lands, allocating some to NAI, gov't selling the rest. Objective was forced assimilation into white culture", where: "US", when: "1887", why: "Undermined the NAI tribal structure and destroyed their way of life; cultural genocide. Stripped over 90 million acres from NAI. Led to boarding schools (Carlisle) and reservations with substandard care." },
    { id: 63, unit: 6, term: "Wounded Knee", who: "Sitting Bull", what: "Began with arrest of Sitting Bull (killed in the process) in response to the Ghost Dance movement (US thought it was prelude to war). Massacre left 150 Sioux dead. US Calvary honored with medals.", where: "Pine Ridge Reservation, S. Dakota", when: "1890", why: "Last major armed conflict between Lakota Sioux and US Army; the end of NAI resistance in the Plains. ⅓ of all dead at Wounded Knee were women, children. Will hasten cultural genocide of Native Tribes forced onto reservations" },
    { id: 64, unit: 6, term: "Populist Party", who: "Weaver, WJ Bryan, farmers", what: "Calling for: Gov't ownership of RR, bank, telegraph, graduated income tax, 8 hour workday, subtreasuries, free Silver. Bryan both the Democrat & Populist candidate", where: "Western states", when: "1890s", why: "Farmers involved in politics because their demands were ignored by major parties. Mass appeal led to Dem Party championing policy goals in 1896. Paves way for the Progressives." },
    { id: 65, unit: 6, term: "Interstate Commerce Commission (ICC)", who: "Congress", what: "Agency created to regulate the RR industry to ensure fair rates, eliminate rate discrimination. 5 member commission appt by president", where: "US", when: "1887, revoked 1895", why: "Shift in power from state to federal. 1st independent regulatory body, 1st agency to regulate big business. One of the few (short lived) successes of the Populist Party." },
    { id: 66, unit: 6, term: "American Federation of Labor (AFL)", who: "Samuel Gompers, skilled white male workers", what: "Union bargained w/ management for better wages, conditions & hours. Organized along craft lines. Utilized collective bargaining & mediation.", where: "US", when: "1886", why: "Use of collective bargaining = effective as an exclusive union. Less overtly political than other unions which allowed for their longevity. Merge with CIO in '55 to be largest union in US." },
    { id: 67, unit: 6, term: "Haymarket Riot", who: "Knights of Labor", what: "Peaceful protest (workers had been killed, injured by Chicago police previously) for labor rights in Chicago that turned violent when a bomb was thrown at police.", where: "Chicago", when: "May 4, 1886", why: "Associates the labor movement with anarchy, violence, and radicalism. Major setback for unions and leads to large drop in membership." },
    { id: 68, unit: 6, term: "Chinese Exclusion Act", who: "Congress, Chinese Immigrants", what: "Act ending immigration from China for 10 years; no naturalization. Made permanent in 1902. Repealed in 1943. 1st immigration act to target one nation's immigrants.", where: "US", when: "1882", why: "Increase in nativism, violence against Chinese, dislike for cheap Chinese labor available as a result of increased immigration (Gold Rush, RR). Impact relationships with other Asian nations (Japan - Gentlemen's Agreement)." },
    { id: 69, unit: 6, term: "NAWSA", who: "Carrie Chapman Catt, Anthony, Stanton", what: "Merging of 2 opposing suffrage factions. They worked on both a state by state campaign and a Constitutional Amendment to grant women the vote.", where: "Washington DC", when: "1890-1920", why: "Along with other groups like the Nat'l Women's Party, successful at getting the 19th amendment passed in 1920 but were a segregated movement especially after the 15th Amendment." },
    { id: 70, unit: 6, term: "Plessy v Ferguson", who: "Supreme Court, African Americans, Homer Plessy", what: "Racially mixed shoemaker (Plessy) arrested after boarding whites only train car in Louisiana as a civil rights test case over Jim Crow laws. Plessy loses case.", where: "US", when: "1896", why: "Gave legal backing to Jim Crow Laws and legitimized \"Separate But Equal\" doctrine. Will stand until overturned in Brown v Board." },

    // Unit 7
    { id: 71, unit: 7, term: "Progressive Era", who: "Women, Middle class reformers", what: "Wide ranging movement focused on raising social change, consciousness after the changes the Civil War & industrialization brought upon US society. Goal: use power of gov't for social change,", where: "Nat'l mvt; US", when: "1900-1920", why: "Gave mainstream support to many previous reform movements like Populists. Long term success: referendum, recall, initiative, women's suffrage, direct election of senators. Brought out tension b/w social justice & social control" },
    { id: 72, unit: 7, term: "Sherman Antitrust Act", who: "Congress, Teddy Roosevelt", what: "Allowed gov't to break up large trusts, monopolies to regulate industry when they interfered with trade, competition.", where: "US", when: "1890", why: "Initially used on unions as \"illegal combinations\" until T.R. Gives gov't direct role in economy. Later acts will strength its enforcement: Clayton Anti Trust Act, Fed Trade Commission. Still used today." },
    { id: 73, unit: 7, term: "Preservationism", who: "John Muir, Gifford Pinchot, T.R.", what: "Federal Environmental policy in originating with Teddy Roosevelt. Differences in perspective: conservation vs preservation. Preservation = nature should be pristine, untouched; ideas of John Muir vs TR's perspective of nature should be open to use by public but not used up.", where: "US", when: "1870s-1905", why: "Advocated for national/state parks, wildlife refuges for both protecting the environment and making it usable by the public. Going forward issues at center of every major environmental debate will be controversial to balance needs of gov't, ranchers, rising populations in urban centers like water issues - Hetch Hetchy" },
    { id: 74, unit: 7, term: "18th Amendment", who: "Congress, Wilson, WCTU", what: "Amendment passed outlawing alcohol. Also known as Prohibition or the Volstead Act. Created a special unit in the US Treasury department to enforce it.", where: "US", when: "Jan 1920", why: "Bans alcohol nationwide, hard to enforce, rise of speakeasies and organized crime, repealed in 1933 with the 21st amendment" },
    { id: 75, unit: 7, term: "NAACP", who: "African American activists, WEB Du Bois", what: "Formed in NY by white + black activists in response to race riots, lynchings. Strove for racial equality on nat'l level. Focuses on voting & legal rights, education & employment opportunities.", where: "US", when: "1909-today", why: "One of the most effective & influential organizations fighting for racial equality. Major influence on Civil Rights Movement of the 1950s, Identity Movements of the 1960s up to modern day." },
    { id: 76, unit: 7, term: "Versailles Treaty", who: "Wilson, European Reps", what: "Treaty ending WWI, centered around 14 points and League of Nations. Fails to win approval from congress because of the fear of loss of autonomy with league & could lead to European entanglements.", where: "Versailles, International", when: "1918", why: "Forced Germany to pay reparations - leading to WW2. Showed isolationist strength at end of war in US (Irreconcilables), sets stage for WW2 isolation. Shows failure of Wilson's idealism (peace without victory)." },
    { id: 77, unit: 7, term: "1st Red Scare", who: "Palmer, Communists", what: "Hysteria over the threat of communism in the US after Bolshevik Rev in Russia.", where: "US", when: "1917-1920", why: "Leads to many in federal gov't being scrutinized for perceived affiliations with communists or radicals. Often targeted labor unions. Sedition Act targets those who criticize the government. Fear and hysteria continue into the 1940s and 50s." },
    { id: 78, unit: 7, term: "Sedition Act", who: "Eugene Debs, Woodrow Wilson, A. Mitchell Palmer, US gov't", what: "Amendment to Espionage Act lets gov't go after anyone criticizing US policies; especifically focused on radicals, draft dodgers, pacificists, socialists. Designed to protect America's participation in WW1 but curtailed freedom of speech. Upheld by Supreme Court.", where: "US", when: "1918", why: "Increased federal control during WWI, limiting freedom of speech. Famous cases: Debs, Schenck. Will set the stage for strong handed tactics of gov't control in 1st (1920s), 2nd Red Scare (1950s). Major portions of this law remain in place today largely against journalists post 9/11." },
    { id: 79, unit: 7, term: "19th Amendment", who: "Congress, A. Paul, E. Stanton, S. Anthony, C. Catt", what: "Amendment giving vote to women ending almost a century of protest from groups like NAWSA, Nat'l Women's Party.", where: "US", when: "1920", why: "Culmination of women's suffrage movement, win for feminists. Despite passage of the amendment, poll taxes and Jim Crow Laws would continue to bar black women from suffrage." },
    { id: 80, unit: 7, term: "Scopes Trial", who: "John Scopes, Clarence Darrow, WJB", what: "HS teacher violates Butler Act which prohibited teaching of evolution. Circus Trial ensues over religion/science & role of gov't in education that continues today.", where: "Dayton, TN", when: "1925", why: "Continued debate of separation of church and state. Impact of evangelical christianity in Southern states. Enhanced profile of ACLU." },
    { id: 81, unit: 7, term: "1920s Immigration Acts", who: "Immigrants, Congress", what: "Immigration goes to a quota system. Law limiting immigration by region based on 1910 (1921) & 1890 (1924) census data.", where: "US", when: "1921", why: "Designed to limit immigration of those from S+ E europe, shows xenophobia, fear of communist revolution, racism, nationalism of US" },
    { id: 82, unit: 7, term: "Great Migration", who: "Southern Blacks", what: "Demographic shift, millions of blacks move north to escape racial violence and for work beginning in WW1. Large cities will increase in size with the population boost from black migrants.", where: "Rural south to N. cities (Chicago, Detroit)", when: "1914-1920", why: "Competition for jobs, housing led to an increase in racial tension & violence (Red Summer 1919). Redlining process used by whites to segregate city areas. Blacks will create their own neighborhoods (Harlem). Impacts Harlem Ren." },
    { id: 83, unit: 7, term: "Harlem Renaissance", who: "Black artists: Langston Hughes, Hurston", what: "Cultural movement coming out of Harlem that encouraged African Americans to embrace and cherish their unique culture and identity. Produced famous writers, artists, musicians", where: "Harlem, NY", when: "1920-1930", why: "Promoted black identity and produce culturally important works, people" },
    { id: 84, unit: 7, term: "Marcus Garvey", who: "Garvey, African Americans, UNIA", what: "Black nationalist and leader of the Pan African movement who disagreed with the integration & accommodationist views of mainstream African American movements.", where: "Liberia, NY", when: "1887-1940", why: "Advocated for \"separate but equal\" status for black Americans and pushed for a return to Africa. While the NAACP and many black leaders in America disagreed with his stance, he is credited for advocating for black pride and nationalism (\"Black is beautiful\"). Influenced black power movement in the 1960s, 70s." },
    { id: 85, unit: 7, term: "New Deal Coalition", who: "Political machines, workers trade unions, poor farmers, A. A.", what: "Political coalition that wanted more active government involvement in dealing with GD.", where: "US", when: "1930s", why: "Promoted big government that resulted in many large long lasting programs, allowed FDR to push his agenda. Allowed Democratic Party to control both houses of Congress for decades. Led to the destruction of political machines. Declined in the wake of the Reagan Revolution of the 1980s." },
    { id: 86, unit: 7, term: "Social Security Act", who: "FDR, Dr. Townsend, Congress", what: "Act that gave benefits to people like the elderly, unemployed, dependent mothers. Townsend believed help for elderly was needed as they were hit hard by the Depression. Benefits are based on how much a person paid into the system via pensions.", where: "US", when: "1935", why: "Established a social safety net. Millions of Americans have been helped by this program. Prime example of modern liberalism: gov't as the vehicle for help but also ushers in welfare state. Critiqued by conservatives as overstepping limits of federal government. Program has been in financial peril since the late 1970s." },
    { id: 87, unit: 7, term: "Lend Lease Act", who: "US, Britain", what: "Provides military aid to any country whose security deemed vital to us security. Military aid to GB with understanding US would be paid back", where: "International", when: "1941", why: "Furthers us involvement in growing global struggle on side with France, GB" },
    { id: 88, unit: 7, term: "Code Talkers", who: "Navajo, US military", what: "Navajo Marines who conveyed messages in Navajo code that was unbreakable by the Axis powers in WWII", where: "Pacific theater", when: "1940-1945", why: "Provided fast and secure line of communication on the front lines of WWII. One of the only codes not broken during the war, which led to the recruitment of 400 Navajo men." },
    { id: 89, unit: 7, term: "Executive Order 9066", who: "FDR,Sec of War Henry Stimson, Issei, Nisei, War Relocation Authority", what: "Forced removal of \"enemy aliens\" Japanese Americans from the west coast in internment camps. Eleanor disagreed strongly. Mexico, Canada followed suit. Hawaii did not intern. Upheld in Korematsu v US (1944)", where: "West Coast", when: "Feb 19, 1942", why: "Affected the lives of over 120,000 American citizens. Long standing question of constitutional rights being violated in time of war. Reparations paid in 1988 by the Reagan administration." },
    { id: 90, unit: 7, term: "Bracero Program", who: "Mexican workers", what: "Agreements between the US and Mexico to allow Mexican men to come to the US for work", where: "US and Mexico", when: "1942-1964", why: "Largest US contract labor system ever (employed 4 million workers over its duration). Wages were low and led to advocacy from many groups for changes to the treatment for farm workers, including Chavez/Huerta and the United Farm Workers." },
    { id: 91, unit: 7, term: "D-Day", who: "US + Allies vs Nazis, Eisenhower", what: "AKA Operation Overlord. Largest amphibious invasion in military history. Orchestrated w/ France, England to liberate France. US troops @ Omaha, Utah Beaches. High casualties.", where: "Normandy, France", when: "June 6, 1944", why: "Opened up the long awaited 2nd front in Europe. Victorious turning point for the Allies and beginning of the end of Nazi control of Europe." },

    // Unit 8
    { id: 92, unit: 8, term: "Truman Doctrine", who: "Truman, George Kennan, GB, Turkey, Greece", what: "AKA Containment Policy. GB couldn't fund anti-communist side in Turkish civil war any longer. Truman sends $400 million to Turkey and Greece to keep communists from winning.", where: "Europe", when: "1947", why: "Asserted US right to intervene to save other countries from communism Containment policy that will dominate US foreign policy for much of the Cold War." },
    { id: 93, unit: 8, term: "Marshall Plan", who: "George Marshall", what: "European recovery program. Designed to prevent socialism from getting foothold in western europe. Protect markets for US.", where: "Europe", when: "1947", why: "Deepens wedge between US and USSR containment. Soviets will respond with their own version: Molotov Plan & will work to restrain satellite nations more severely." },
    { id: 94, unit: 8, term: "Korean War", who: "Truman", what: "A proxy war between the US and USSR in Korea. No \"winner,\" and essentially no change in borders due to the war. Threat of use of nukes. Use of tech, air war. Bloody massacres on both sides.", where: "US", when: "1950", why: "Demonstrates the Truman doctrine at work attempting to contain communism but unable to unify Korea. Foreshadows quagmires like Vietnam." },
    { id: 95, unit: 8, term: "GI Bill", who: "Congress, veterans", what: "Law providing benefits to ww2 vets: low cost mortgages, low interest loans for business, cash for tuition", where: "US", when: "1944", why: "Another example of government paying for people to attain success, boosts people into the middle class." },
    { id: 96, unit: 8, term: "McCarthyism AKA 2nd Red Scare", who: "Joe McCarthy, HUAC, Congress, Ike", what: "Subset of 2nd Red scare (HUAC - Hiss, Hollywood 10) Investigation into hysteria about subversives in federal government, used to target individuals groups for being \"un american\". Intended to silence critics of the cold war; liberals", where: "US", when: "1950s", why: "Infringement of civil liberties in the name of Cold War hysteria. Political beliefs, associations on trial. Homosexuals targetted (Lavender Scare.) Led to loss of jobs, livelihoods for thousands. Fear of being \"soft\" on communism stops Congress, Ike from stopping McCarthy." },
    { id: 97, unit: 8, term: "Military Industrial Complex", who: "Ike, US gov't army", what: "Ike's Farewell Address. Warned nation: danger posed to democracy by relationship between gov't, DoD & defense industries. Urged successors to take a better balance of spending, diplomacy.", where: "US", when: "1961", why: "Still true today. It has become more difficult to rein in defense spending, especially during the War on Terror in the early 2000s. US continues to vastly outspend other nations on weapons/defense." },
    { id: 98, unit: 8, term: "Vietnam War", who: "Ho Chi Minh, JFK, Johnson, Nixon", what: "A long proxy war fought between North (communist) and South Vietnam.", where: "Vietnam", when: "1955-1975", why: "It helped seriously spark anti-war movements and led to increased questioning of the government in the US" },
    { id: 99, unit: 8, term: "War Powers Act of 1973", who: "Nixon, Congress", what: "A law that limits the president's ability to commit the US to long-term armed conflicts without Congressional approval", where: "USA", when: "1973", why: "Demonstrates a response to the Vietnam war (e.g. Gulf of Tonkin Resolution) away from giving the president unchecked power" },
    { id: 100, unit: 8, term: "Immigration Acts of 1965", who: "Lyndon Baines Johnson, congress, immigrants", what: "Represented a change of immigation policy of the 1920s, abolished the \"national-origins\" quota and doubled the number of immigrants allowed to enter annually.", where: "USA, Asia, Latin America", when: "1965", why: "Immigration numbers increases largely and created more diversity in America, and it also allowed for family unification with chain migration. Largest increases from Latinx, Asian nations." },
    { id: 101, unit: 8, term: "Environmental Protection Agency", who: "Richard Nixon, congress, Rachel Carson", what: "Federal agency to oversee environmental monitoring and cleanup programs. Invented to protect human and environmental health.", where: "USA", when: "1970", why: "Protected against pollution and destruction, still exists today, and shows how the federal government has more direct concern of environmental issues." },
    { id: 102, unit: 8, term: "Brown V Board of Education", who: "Oliver Brown, Earl Warren", what: "The supreme court ruling that ruled segregation in public schools, and by extension the doctrine of \"separate but equal\" unconstitutional. Overturned Plessy v. Ferguson", where: "US", when: "1954", why: "The ruling overturned Plessy v. Ferguson and represented a first success of the Civil Rights Movement. It paved the way for later Civil Rights reforms and demonstrates the activism of the Warren court" },
    { id: 103, unit: 8, term: "Civil Rights Act of 1964", who: "Lyndon Baines Johnson", what: "Ooutlawed discrimination based on race, color, religion, sex or national origin. Ended unequal application of vote registration requirments and racial segregation in all institutions.", where: "USA", when: "1964", why: "Started the desegregation process in the U, and shows the Legislative branch finally taking action to start civil rights movement" },
    { id: 104, unit: 8, term: "Black Panther Party", who: "Huey P. Newton, Bobby Seale", what: "An activist black power party that worked towards African American rights and conducted community service for African Americans in large cities. Patrolled AA communities to protect from police brutality. 10 Point Program: focus on education, economic help for AA.", where: "Oakland", when: "1966", why: "Powerful image of black pride. Highlights continued tension over issues of race." },
    { id: 105, unit: 8, term: "ERA", who: "Women, middle-class", what: "Proposed amendment to the US Constitution designed to guarantee equal legal rights for all American citizens regardless of sex", where: "USA", when: "1971", why: "Largely supported by middle class, with criticism from working class about lack of protection for women in workplace. Passed Congress, but only approved by 35 of required 38 state legislatures, thus failing. Though it failed, the federal government and states have passed laws protecting the legal rights of women." },
    { id: 106, unit: 8, term: "Roe V Wade", who: "Supreme Court, Norma McCorvey (Roe)", what: "Landmark Supreme Court ruling legalizing abortion in the first 2 trimesters. Court ruled 7-2 that the right to privacy was protected under the 14th Amendment", where: "US", when: "1973", why: "Reshaped national politics. Divides the US into pro choice and pro life camps, grass roots movements on both sides." },
    { id: 107, unit: 8, term: "Stonewall", who: "LBGT Community, Gay Rights Activists, NYPD", what: "Series of demonstrations by LBGT community and gay rights activists in response to a police raid at the Stonewall Inn in the Greenwich Village neighborhood of New York City.", where: "Greenwich Village, New York City", when: "June 28, 1969", why: "Widely considered a watershed event that transformed the gay liberation movement and the twentieth-century fight for LGBT rights in the United States." },
    { id: 108, unit: 8, term: "Chicano Movement", who: "Cesar Chavez, Dolores Huerta, Brown Berets, Chicano/as", what: "Social and political movement in the U.S. that worked to embrace a Chicano/a identity and worldview that combated structural racism, encouraged cultural revitalization, and achieved community empowerment by rejecting assimilation.", where: "SW United States, California, New Mexico, Arizona, Texas", when: "1965-1975", why: "Brought about educational, economic, and political reforms for people of Mexican-American descent. Gave a political voice to Mexican-Americans, and made Americans more aware of the unfair laws and discrimination Chicano/as faced in U.S." },
    { id: 109, unit: 8, term: "Great Society", who: "Lyndon B. Johnson", what: "Ambitious series of policy initiatives, legislation and programs spearheaded by President Lyndon B. Johnson with the main goals of ending poverty, reducing crime, abolishing inequality and improving the environment.", where: "United States", when: "1964", why: "Launched new major domestic programs. Major achievements include the Civil Rights Act, Voting Rights Act, Immigration and Nationality Act of 1965, and the establishment of Medicare and Medicaid. Some resented the increased gov't handouts and interference in daily lives. Cost would be overshadowed by the Vietnam War." },
    { id: 110, unit: 8, term: "Detente", who: "Nixon, Reagan, China, Soviet Union", what: "Relaxation of tensions with 2 US, Soviet Union. A time of increased trade and cooperation. Evidenced by the SALT treaties. Relations become tense again when USSR invades Afghanistan in 1979.", where: "US, Russia", when: "1970s, 1980s", why: "Relaxed tensions contribute to the end of the Cold War" },
    { id: 111, unit: 8, term: "Watergate", who: "Richard Nixon, DNC, congress", what: "Political scandal of Nixon's administration following the arrest of 5 burglars caught at the Watergate Hotel, home of the DNC. Uncovered by WaPo by Woodward & Bernstein", where: "USA", when: "1972-1974", why: "Leads to a huge decrease in American trust in government and the first president to resign to avoid impeachment." },
    { id: 112, unit: 8, term: "OPEC", who: "Saudi Arabia, Egypt, Syria, etc.", what: "The Arab majority of the Organization of Petroleum Exporting Countries started an embargo against countries that supported Israel in the 1973 Yom Kippur War, and oil and gas prices skyrocket in Western nations", where: "USA, Europe, Middle East", when: "1973-1974", why: "Causes emergency rationing in America, causes a long term recession (stagflation of the 1970s) and ends the period of economic prosperity after World War II" },
    { id: 113, unit: 8, term: "Sunbelt", who: "American People", what: "Internal migration to South and Western states for retirement, jobs (defense, tech, service) climate, lower taxes from NE cities", where: "Southwest States: So Cal, Arizona, Texas, Florida", when: "1950s-1970s", why: "Increases population and importance politically of Sunbelt states" },
    { id: 114, unit: 8, term: "Moral Majority", who: "Christians, Pat Robertson, Jerry Falwell", what: "Christian political action group that formed to further conservative, religious agenda including allowing prayer in schools and outlawing abortion.", where: "US", when: "1979-1989", why: "Rise of religious fundamentalism as a response to social change, experimentation of the 70s. New use of media. Helps Reagan win in 1980." },
    { id: 115, unit: 8, term: "Iranian Hostage Crisis", who: "Hostages, Carter, Reagan, Ayatollah Khomeini", what: "Diplomatic crisis between the US and Iran. 52 US diplomats and civilians and held for 444 days. Prompted by Iranian anger over US support of ousted Shah. Released on RR's inauguration day.", where: "Tehran, Iran", when: "1979-1980", why: "Critical moment in Iran - US relations. Hurt Carter's presidency (failed rescue attempt), start of use of economic sanctions" },

    // Unit 9
    { id: 116, unit: 9, term: "Reaganomics", who: "Reagan", what: "Econ policies of Pres Reagan during the 1980s. Supply side econ. Reduce gov't spending, reduce taxes, reduce gov't regulation and tighen money supply to reduce inflation", where: "US", when: "1980s", why: "US debt balloons, some argue benefitted US economy because it ended the inflation of the 1970s.. Still advocated by many conservatives today." },
    { id: 117, unit: 9, term: "Strategic Defense Initiative", who: "Reagan", what: "\"Star Wars\". Increased defense spending to fund space based missile defense system. US did not have the required tech to make it a reality.", where: "US", when: "1983", why: "Lacked popular support. But some believe it scares the Russians enough to put an eventual end of the Cold War." },
    { id: 118, unit: 9, term: "Operation Desert Storm", who: "US Soldiers, Bush, Saddam Hussein", what: "Iraq invades oil rich Kuwait. Concern Saddam could take Saudi Arabia as well; would control ⅕ of world's oil supply. Bombing, use of ground troops to liberate Kuwait.", where: "Kuwait", when: "1991", why: "1st major foreign crisis after Cold War ends. Massive casualties and ecological damage - oil into Persian Gulf. . Didn't capture or kill Hussein. Round the clock coverage on media outlets." },
    { id: 119, unit: 9, term: "North American Free Trade Agreement", who: "Clinton, Canadian & Mexican leaders", what: "Treaty established free trade in North America, lifting tariffs on participating countries", where: "US, Canada, Mexico", when: "1992", why: "Improved flow of goods -> general economic upturn but did result in some outsourcing of jobs. Will lead to creation of USMCA." },
    { id: 120, unit: 9, term: "War on Terror", who: "George W. Bush, Al-Qaeda, Osama Bin Laden", what: "A shift in American foreign policy following 4 surprise terrorist attacks on the morning of 9/11 (2,977 Americans killed)", where: "NYC, DC, World", when: "9/11/01-present", why: "Creation of the Dept of Homeland Security, Patriot Acts, wars in Afghanistan and Iraq" }
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
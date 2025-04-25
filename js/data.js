const permanentUnlocks = [
	"Scheduling", // currently unused
	"Shop",
	"Automation",
	"Quick task display"
];

const jobBaseData = {
	Beggar: { name: "Beggar", maxXp: 50, income: 5 },
	Farmer: { name: "Farmer", maxXp: 100, income: 9 },
	Fisherman: { name: "Fisherman", maxXp: 200, income: 15 },
	Miner: { name: "Miner", maxXp: 400, income: 40 },
	Blacksmith: { name: "Blacksmith", maxXp: 800, income: 80 },
	Merchant: { name: "Merchant", maxXp: 1600, income: 150 },

	Squire: { name: "Squire", maxXp: 100, income: 5 },
	Footman: { name: "Footman", maxXp: 1000, income: 50 },
	"Veteran footman": { name: "Veteran footman", maxXp: 10000, income: 120 },
	Knight: { name: "Knight", maxXp: 100000, income: 300 },
	"Veteran knight": { name: "Veteran knight", maxXp: 1000000, income: 1000 },
	"Elite knight": { name: "Elite knight", maxXp: 7500000, income: 3000 },
	"Holy knight": { name: "Holy knight", maxXp: 40000000, income: 15000 },
	"Legendary knight": {
		name: "Legendary knight",
		maxXp: 150000000,
		income: 50000
	},

	Student: { name: "Student", maxXp: 100000, income: 100 },
	"Apprentice mage": {
		name: "Apprentice mage",
		maxXp: 1000000,
		income: 1000
	},
	Mage: { name: "Mage", maxXp: 10000000, income: 7500 },
	Wizard: { name: "Wizard", maxXp: 100000000, income: 50000 },
	"Master wizard": {
		name: "Master wizard",
		maxXp: 10000000000,
		income: 250000
	},
	Chairman: { name: "Chairman", maxXp: 1000000000000, income: 1000000 },
	"Illustrious Chairman": {
		name: "Illustrious Chairman",
		maxXp: 7000000000000,
		income: 1500000
	},

	"Junior Caretaker": { name: "Junior Caretaker", maxXp: 100000, income: 15 },
	"Lead Caretaker": { name: "Lead Caretaker", maxXp: 1000000, income: 115 },
	Freshman: { name: "Freshman", maxXp: 2000000, income: 250 },
	Sophomore: { name: "Sophomore", maxXp: 4000000, income: 500 },
	Junior: { name: "Junior", maxXp: 16000000, income: 1000 },
	Senior: { name: "Senior", maxXp: 64000000, income: 2000 },
	Probation: { name: "Probation", maxXp: 300000000, income: 12000 },

	Baronet: { name: "Baronet", maxXp: 7500000, income: 3500 },
	Baron: { name: "Baron", maxXp: 40000000, income: 4500 },
	"Vice Count": { name: "Vice Count", maxXp: 160000000, income: 6000 },
	Count: { name: "Count", maxXp: 640000000, income: 8000 },
	Duke: { name: "Duke", maxXp: 2400000000, income: 25000 },
	"Grand Duke": { name: "Grand Duke", maxXp: 9600000000, income: 40000 },
	"Arch Duke": { name: "Arch Duke", maxXp: 40000000000, income: 55000 },
	Lord: { name: "Lord", maxXp: 160000000000, income: 150000 },
	"High Lord": { name: "High Lord", maxXp: 160000000000000, income: 300000 },
	King: { name: "King", maxXp: 160000000000000, income: 300000 },
	"High King": { name: "High King", maxXp: 160000000000000, income: 1200000 },
	"Emperor of Mankind": {
		name: "Emperor of Mankind",
		maxXp: 160000000000000,
		income: 2500000
	}
};

const skillBaseData = {
	//original effect: 0.01
	//Fundamentals
	Concentration: {
		name: "Concentration",
		maxXp: 100,
		effect: 0.01,
		description: "Skill xp"
	},
	Productivity: {
		name: "Productivity",
		maxXp: 100,
		effect: 0.01,
		description: "Job xp"
	},
	Bargaining: {
		name: "Bargaining",
		maxXp: 100,
		effect: -0.01,
		description: "Expenses"
	},
	Meditation: {
		name: "Meditation",
		maxXp: 100,
		effect: 0.01,
		description: "Happiness"
	},

	//Combat
	Strength: {
		name: "Strength",
		maxXp: 100,
		effect: 0.01,
		description: "Military pay"
	},
	"Battle tactics": {
		name: "Battle tactics",
		maxXp: 100,
		effect: 0.01,
		description: "Military xp"
	},
	"Muscle memory": {
		name: "Muscle memory",
		maxXp: 100,
		effect: 0.01,
		description: "Strength xp"
	},

	//Magic
	"Mana control": {
		name: "Mana control",
		maxXp: 100,
		effect: 0.01,
		description: "T.A.A. xp"
	},
	Immortality: {
		name: "Immortality",
		maxXp: 100,
		effect: 0.01,
		description: "Longer lifespan"
	},
	"Time warping": {
		name: "Time warping",
		maxXp: 100,
		effect: 0.01,
		description: "Gamespeed"
	},
	"Super immortality": {
		name: "Super immortality",
		maxXp: 100,
		effect: 0.01,
		description: "Longer lifespan"
	},

	//Mind
	"Novel Knowledge": {
		name: "Novel Knowledge",
		maxXp: 100,
		effect: 0.01,
		description: "Discovery xp"
	},
	"Unusual Insight": {
		name: "Unusual Insight",
		maxXp: 100,
		effect: 0.005,
		description: "Magical xp"
	},
	"Trade Psychology": {
		name: "Trade Psychology",
		maxXp: 100,
		effect: 0.8,
		description: "Merchant pay"
	},
	Flow: { name: "Flow", maxXp: 800, effect: 0.001, description: "Gamespeed" },
	"Magical Engineering": {
		name: "Magical Engineering",
		maxXp: 1000,
		effect: 0.01,
		description: "Chairman xp"
	},
	"Scales Of Thought": {
		name: "Scales Of Thought",
		maxXp: 1100,
		effect: 0.003,
		description: "Magical xp"
	},
	"Magical Biology": {
		name: "Magical Biology",
		maxXp: 1500,
		effect: 0.005,
		description: "Chairman xp"
	},

	"Dark influence": {
		name: "Dark influence",
		maxXp: 100,
		effect: 0.01,
		description: "All xp"
	},
	"Evil control": {
		name: "Evil control",
		maxXp: 100,
		effect: 0.01,
		description: "Evil gain"
	},
	Intimidation: {
		name: "Intimidation",
		maxXp: 100,
		effect: -0.01,
		description: "Expenses"
	},
	"Demon training": {
		name: "Demon training",
		maxXp: 100,
		effect: 0.01,
		description: "All xp"
	},
	"Blood meditation": {
		name: "Blood meditation",
		maxXp: 100,
		effect: 0.01,
		description: "Evil gain"
	},
	"Demon's wealth": {
		name: "Demon's wealth",
		maxXp: 100,
		effect: 0.002,
		description: "Job pay"
	}
};

const projectBaseData = {
	"Labratorium Arcaenus": {
		name: "Labratorium Arcaenus",
		jobAffected: "Chairman",
		jobCategoriesAffected: "The Arcane Association",
		xpMultiplier: 1.05,
		baseCost: 1000000000000000, //One million platinum
		persistsThroughRebirthOne: true,
		rebirthTwoDestructionPenalty: 0.9 // embracing evil destroys 90 percent of the project's value
	}
};

const itemBaseData = {
	Homeless: { name: "Homeless", expense: 0, effect: 1 },
	Tent: { name: "Tent", expense: 15, effect: 1.4 },
	"Wooden hut": { name: "Wooden hut", expense: 100, effect: 2 },
	Cottage: { name: "Cottage", expense: 750, effect: 3.5 },
	House: { name: "House", expense: 3000, effect: 6 },
	"Large house": { name: "Large house", expense: 25000, effect: 12 },
	"Small Manor": { name: "Small Manor", expense: 300000, effect: 25 },
	"Small palace": { name: "Small palace", expense: 5000000, effect: 60 },
	"Grand palace": { name: "Grand palace", expense: 190000000, effect: 135 },

	//Cameron's first addition: rag clothing. Woohoo!
	"Rag Clothing": {
		name: "Rag Clothing",
		expense: 3,
		effect: 1.5,
		description: "Skill xp"
	},
	Book: { name: "Book", expense: 10, effect: 1.5, description: "Skill xp" },
	"Basic Farm Tools": {
		name: "Basic Farm Tools",
		expense: 10,
		effect: 1.5,
		description: "Farm upgrade"
	},
	Dumbbells: {
		name: "Dumbbells",
		expense: 50,
		effect: 1.5,
		description: "Strength xp"
	},
	"Personal squire": {
		name: "Personal squire",
		expense: 200,
		effect: 2,
		description: "Job xp"
	},
	"Steel longsword": {
		name: "Steel longsword",
		expense: 1000,
		effect: 2,
		description: "Military xp"
	},
	Butler: {
		name: "Butler",
		expense: 7500,
		effect: 1.5,
		description: "Happiness"
	},
	"Sapphire charm": {
		name: "Sapphire charm",
		expense: 50000,
		effect: 3,
		description: "Magic xp"
	},
	"Study desk": {
		name: "Study desk",
		expense: 1000000,
		effect: 2,
		description: "Skill xp"
	},
	Library: {
		name: "Library",
		expense: 12000000,
		effect: 1.5,
		description: "Skill xp"
	},
	"Small Field": {
		name: "Small Field",
		expense: 130,
		effect: 5.0,
		description: "Farm upgrade"
	},
	"Ox-driven Plow": {
		name: "Ox-driven Plow",
		expense: 200,
		effect: 2.4,
		description: "Farm upgrade"
	},
	"Livestock-derived Fertilizer": {
		name: "Livestock-derived Fertilizer",
		expense: 20,
		effect: 1.2,
		description: "Farm upgrade"
	},
	"Cheap Fishing Rod": {
		name: "Cheap Fishing Rod",
		expense: 20,
		effect: 2.0,
		description: "Fishing upgrade"
	},
	"Miner's Lantern": {
		name: "Miner's Lantern",
		expense: 35,
		effect: 1.5,
		description: "Mining upgrade"
	},
	"Crappy Anvil": {
		name: "Crappy Anvil",
		expense: 50,
		effect: 1.5,
		description: "Blacksmith upgrade"
	},
	"Breech Bellows": {
		name: "Breech Bellows",
		expense: 130,
		effect: 1.8,
		description: "Blacksmith upgrade"
	},
	"Pack Horse": {
		name: "Pack Horse",
		expense: 80,
		effect: 3.0,
		description: "Merchant upgrade"
	},
	"Small Shop": {
		name: "Small Shop",
		expense: 600,
		effect: 1.5,
		description: "Merchant upgrade"
	},
	"Weapon Outlet": {
		name: "Weapon Outlet",
		expense: 3000,
		effect: 3.0,
		description: "Merchant upgrade"
	}
};

const jobCategories = {
	"Common work": [
		"Beggar",
		"Farmer",
		"Fisherman",
		"Miner",
		"Blacksmith",
		"Merchant"
	],
	Military: [
		"Squire",
		"Footman",
		"Veteran footman",
		"Knight",
		"Veteran knight",
		"Elite knight",
		"Holy knight",
		"Legendary knight"
	],
	"The Arcane Association": [
		"Student",
		"Apprentice mage",
		"Mage",
		"Wizard",
		"Master wizard",
		"Chairman",
		"Illustrious Chairman"
	],
	"The Order of Discovery": [
		"Junior Caretaker",
		"Lead Caretaker",
		"Freshman",
		"Sophomore",
		"Junior",
		"Senior",
		"Probation"
	],
	Nobility: [
		"Baronet",
		"Baron",
		"Vice Count",
		"Count",
		"Duke",
		"Grand Duke",
		"Arch Duke",
		"Lord",
		"High Lord",
		"King",
		"High King",
		"Emperor of Mankind"
	]
};

const skillCategories = {
	Fundamentals: ["Concentration", "Productivity", "Bargaining", "Meditation"],
	Combat: ["Strength", "Battle tactics", "Muscle memory"],
	Magic: ["Mana control", "Immortality", "Time warping", "Super immortality"],
	Mind: [
		"Novel Knowledge",
		"Unusual Insight",
		"Trade Psychology",
		"Flow",
		"Magical Engineering",
		"Scales Of Thought",
		"Magical Biology"
	],
	"Dark magic": [
		"Dark influence",
		"Evil control",
		"Intimidation",
		"Demon training",
		"Blood meditation",
		"Demon's wealth"
	]
};

const itemCategories = {
	Properties: [
		"Homeless",
		"Tent",
		"Wooden hut",
		"Cottage",
		"House",
		"Large house",
		"Small Manor",
		"Small palace",
		"Grand palace"
	],
	Misc: [
		"Rag Clothing",
		"Book",
		"Basic Farm Tools",
		"Small Field",
		"Ox-driven Plow",
		"Livestock-derived Fertilizer",
		"Cheap Fishing Rod",
		"Dumbbells",
		"Miner's Lantern",
		"Crappy Anvil",
		"Breech Bellows",
		"Pack Horse",
		"Small Shop",
		"Weapon Outlet",
		"Personal squire",
		"Steel longsword",
		"Butler",
		"Sapphire charm",
		"Study desk",
		"Library"
	]
};

const projectCategories = {
	"Chairman Projects": ["Labratorium Arcaenus"]
};

const headerRowColors = {
	"Common work": "#55a630",
	Military: "#e63946",
	"The Arcane Association": "#C71585",
	"The Order of Discovery": "#C7dd85",
	Nobility: "#D1B000",
	Fundamentals: "#4a4e69",
	Combat: "#ff704d",
	Magic: "#875F9A",
	Mind: "#87009A",
	"Dark magic": "#73000f",
	Properties: "#219ebc",
	Misc: "#b56576"
};

const tooltips = {
	Beggar: "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
	Farmer: "Plow the fields and grow the crops. It's not much but it's honest work.",
	Fisherman:
		"Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job.",
	Miner: "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
	Blacksmith:
		"Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
	Merchant:
		"Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",

	Squire: "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
	Footman:
		"Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
	"Veteran footman":
		"More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
	Knight: "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
	"Veteran knight":
		"Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
	"Elite knight":
		"Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped with the finest gear. Such a feared unit on the battlefield is paid extremely well.",
	"Holy knight":
		"Collapse entire armies in mere seconds with your magically imbued blade. The handful of elite knights who attain this level of power are showered with coins.",
	"Legendary knight":
		"Feared worldwide, obliterate entire nations in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

	Student:
		"Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
	"Apprentice mage":
		"Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
	Mage: "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
	Wizard: "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
	"Master wizard":
		"Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map.",
	Chairman:
		'As you walk amongst your fellow Master Wizards, who in recognition of your vast power have just elected you Chairman of the Arcane Association, you receive this anonymous note: "We have followed your progress with great interest. Many have walked this path, but few have used the amulet you now wear to its full potential. But you are not the first to make it this far. Strive on. We will contact you, when the time is right."',
	"Illustrious Chairman":
		"Master of life and war. Renowned throughout the magical and non-magical worlds alike, an Illustrious Chairman is completely free to follow their own path of discovery and ambition. On the other hand, there is that curious note to investigate...",

	//The Order of Discovery
	"Junior Caretaker":
		"A low-level administrator of the ancient Order of Discovery has offered you a job. Cleaning shit-stained chamber pots and mopping kitchen floors isn't glamorous work, but it gives you the rare chance to peruse the Order's world-class library of exotic books. Who cares if touching the books is an offense worthy of expulsion?",
	"Lead Caretaker": "Witty placeholder, my name is.",
	Freshman:
		"Your leadership of the caretaking team has proven you have a modicum of brain cells. A teacher you frequently see has vouched for your potential. Your studies are long and often boring, but you can sense there are great secrets within these halls waiting to be discovered.",
	Sophomore: "Rhyming is crime-ing, and feature delay is not the way.",
	Junior: "Try as I do, these temporary tooltips are poo.",
	Senior: "Forget me not, for this author shall not.",
	Probation:
		"Having completed your basic studies, the Order grants you a bottom-of-the-barrel position as research associate to an old member of little renown. Any major misstep will probably result in your banishment from the halls of knowledge.",

	//Nobility
	Baronet: "A tooltip, a thought. Helpful, I am not.",
	Baron: "The finest $3 pizza modern food science can conceive",
	"Vice Count": "Because Viscount sounds gross.",
	Count: "Are these placeholder tooltips infuriating?",
	Duke: "Good.",
	"Grand Duke": "The nobility cares not for your tooltip desires. ",
	"Arch Duke":
		"Even grander than the most grand Grand Duke your granddad could....Grand.",
	Lord: "Oh lord, please let Gottmilk write the real tooltips already. These are too painful to endure.",
	"High Lord": "Is it April 20th?",
	King: "Now to find yourself a nice Queen. Or two. Or three.",
	"High King": "Even higher. Even nobler.",
	"Emperor of Mankind": "Go outside.",

	Concentration:
		"Improve your learning speed through practising intense concentration activities.",
	Productivity:
		"Learn to procrastinate less at work and receive more job experience per day.",
	Bargaining:
		"Study the tricks of the trade and persuasive skills to lower any type of expense.",
	Meditation:
		"Fill your mind with peace and tranquility to tap into greater happiness from within.",

	//Military
	Strength:
		"Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
	"Battle tactics":
		"Create and revise battle strategies, improving experience gained in the military.",
	"Muscle memory":
		"Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

	// Magic
	"Mana control":
		"Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
	Immortality:
		"Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
	"Time warping":
		"Bend space and time through forbidden techniques, resulting in a faster gamespeed.",
	"Super immortality":
		"Through harnessing ancient, forbidden techniques, lengthen your lifespan drastically beyond comprehension.",

	// Mind
	"Novel Knowledge":
		"A mind needs training. Your time spent absorbing new ideas and worldviews has increased your ability to assimilate new ideas and make connections between seemingly unrelated concepts.",
	"Unusual Insight":
		"Your training in the more mundane affairs of the non-magical world have developed your critical analysis skills. As you gain knowledge, magical concepts which seemed inscrutable and mysterious are becoming more relatable to the physical world around you.",
	"Trade Psychology":
		"Writers pour their souls into the written word. Your extensive reading combined with your countless years spent interacting with people have lent you unparalleled insight into the way mankind views the positive and the negative events of this world. An ethical scholar would refrain from abusing this knowledge for financial gain.",
	Flow: "Intense bouts of concentration warp your perception of time",
	"Magical Engineering":
		"The potential routes of experimentation are infinite. The questions, limitless. What should a budding Chairman focus on in order to enhance their" +
		" knowledge of both life and magic? In medieval times, biology is limited by the tools of the time. Without microscopes and advanced chemistry, it is almost impossible" +
		" to fully grasp the concept of cellular life and the underlying mechanisms governing DNA, metabolism, and degradation of biological structures. Magical Engineering is a worthy pursuit for a Chairman looking to use Magic to build the tools of future scientific inquiry.",
	"Scales Of Thought":
		"Up to this point, a Chairman's experience with Magic is almost entirely on the human scale. A budding apprentice learns to extend the life of a flower." +
		" A mage learns to incinerate man, horse, and siege engine. Master Wizards learn to shake the earth and obscure the vision of their human opponents with natural phenomena" +
		" and magic alike. A Chairman must learn to shift their focus from the scale of humanity to both higher highs and lower lows. A Chairman seeking immortality must investigate" +
		" the smallest structures of existence, must continue probing deeper and uncovering astounding knowledge and even more astounding questions. Scales of Thought will enhance" +
		" Mana Control and Chairman experience gain rates by a substantial rate. By probing nature on a deeper level, a Chairman gains unparalleled understanding which influences every magical action pursuit.",
	"Magical Biology":
		"Through Magical Biology, a Chairman seeks to leverage their new inventions and new frames of thought to directly probe, change, experiment and observe the effects of magic on various cellular structures to enhance their vitality and vigor. Magical Biology is the final step towards immortality.",

	// Dark Magic
	"Dark influence":
		"Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
	"Evil control":
		"Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
	Intimidation:
		"Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
	"Demon training":
		"A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
	"Blood meditation":
		"Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
	"Demon's wealth":
		"Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

	//Housing Tooltips
	Homeless:
		"Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
	Tent: "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
	"Wooden hut":
		"Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
	Cottage:
		"Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
	House: "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
	"Large house":
		"Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
	"Small Manor":
		"Your rising status has granted you access to a small countryside manor. With the manor comes two hundred acres of farmland and the associated serfs, grain mill, and a small river for irrigation. The attendant tells you of a beautiful hollow in some nearby woods where you can relax and meditate.",
	"Small palace":
		"A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
	"Grand palace":
		"A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",

	//Item Tooltips
	"Rag Clothing":
		"After weeks of freezing on the streets, you're making enough money to buy some cheap clothes. They're not much, but they'll keep you warm enough to focus.",
	Book: "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
	"Basic Farm Tools":
		"A set of rusty iron tools to help loosen soil, shape wood, and attach things. Where did you even find this junk?",
	"Cheap Fishing Rod":
		"You found this cracked fishing rod partially buried by the shore. It needs some major TLC, but it'll help you reel in bigger fish.",
	Dumbbells:
		"Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
	"Miner's Lantern":
		"After weeks of feeling your way through pitch black tunnels, bandaging scraped hands, and getting smacked in the face by your fellow miner's pickaxes, you have the bright idea to purchase a lantern. Hopefully some light will help illuminate additional mineral deposits and geological phenomena.",
	"Crappy Anvil":
		"You're pretty sure this lumpy hunk of iron used to be someone's chamber pot.",
	"Breech Bellows":
		"Cobbled together with two sticks and a pair of old trousers, this tool boosts the heat and efficiency of your forge.",
	"Pack Horse":
		"This sweet chestnut horse will haul you and your trade goods to distant cities where your novel fabrics and knick knacks will fetch a tidy profit.",
	"Small Shop":
		"Your first shop. This cozy storefront lies on the main street of a medium-sized walled town. Commoners, nobles, and military patrols all pass along this street, so at the very least people will know your store exists.",
	"Weapon Outlet":
		"A busy military means a busy weapons store. One of the liuetenants who frequents your small shop recently let slip that a long military campaign is imminent. Naturally, a savy merchant such as yourself sees the business opportunity provided by war.",
	"Personal squire":
		"Assists you in completing day to day activities, giving you more time to be productive at work.",
	"Steel longsword":
		"A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
	Butler: "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
	"Sapphire charm":
		"Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
	"Study desk":
		"A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
	Library:
		"Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
	"Small Field":
		"After a pitched battle between bickering barons, your fellow farmer lost his leg and two eldest sons. With a wife and small children to take care of, he says he'll entrust his land to you in exchange for using the proceeds to take care of his family.",
	"Ox-driven Plow":
		"With your newfound land and tools, you've become relatively wealthy. For a peasant farmer, at least. Tale of your achievements has reached the ears of the local lord, who has granted permission for you to rent one of his oxen plow teams and associated gear.",
	"Livestock-derived Fertilizer": "It's poo."
};

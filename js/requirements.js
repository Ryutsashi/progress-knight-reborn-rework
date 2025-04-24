function initializeRequirements() {

	gameData.requirements = {
		//Other
		"The Arcane Association"			: new TaskRequirement(	getElementsByClass(			"The Arcane Association"		),	[{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
		//"Mind"							: new TaskRequirement(	getElementsByClass(			"Mind"							),	[{task: "Concentration", requirement: 700}, {task: "Meditation", requirement: 700}]),
		"Nobility"							: new TaskRequirement(	getElementsByClass(			"Nobility"						),	[{task: "Elite knight", requirement: 10}]),
		"Dark magic"						: new EvilRequirement(	getElementsByClass(			"Dark magic"					),	[{requirement: 1}]),
		"Shop"								: new CoinRequirement(	[document.getElementById(	"shopTabButton"					)],	[{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
		"Rebirth tab"						: new AgeRequirement(	[document.getElementById(	"rebirthTabButton"				)],	[{requirement: 25}]),
		"Rebirth note 1"					: new AgeRequirement(	[document.getElementById(	"rebirthNote1"					)],	[{requirement: 45}]),
		"Rebirth note 2"					: new AgeRequirement(	[document.getElementById(	"rebirthNote2"					)],	[{requirement: 65}]),
		"Rebirth note 3"					: new AgeRequirement(	[document.getElementById(	"rebirthNote3"					)],	[{requirement: 200}]),
		"Evil info"							: new EvilRequirement(	[document.getElementById(	"evilInfo"						)],	[{requirement: 1}]),
		"Time warping info"					: new TaskRequirement(	[document.getElementById(	"timeWarping"					)],	[{task: "Mage", requirement: 10}]),
		"Automation"						: new AgeRequirement(	[document.getElementById(	"automation"					)],	[{requirement: 20}]),
		"Quick task display"				: new AgeRequirement(	[document.getElementById(	"quickTaskDisplay"				)],	[{requirement: 20}]),
	
		//Common work
		"Beggar"							: new TaskRequirement(	[getTaskElement(			"Beggar"						)],	[]),
		"Farmer"							: new TaskRequirement(	[getTaskElement(			"Farmer"						)],	[{task: "Beggar", requirement: 10}]),
		"Fisherman"							: new TaskRequirement(	[getTaskElement(			"Fisherman"						)],	[{task: "Farmer", requirement: 10}]),
		"Miner"								: new TaskRequirement(	[getTaskElement(			"Miner"							)],	[{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
		"Blacksmith"						: new TaskRequirement(	[getTaskElement(			"Blacksmith"					)], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
		"Merchant"							: new TaskRequirement(	[getTaskElement(			"Merchant"						)],	[{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),
	
		//Military 
		"Squire"							: new TaskRequirement(	[getTaskElement(			"Squire"						)],	[{task: "Strength", requirement: 5}]),
		"Footman"							: new TaskRequirement(	[getTaskElement(			"Footman"						)],	[{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
		"Veteran footman"					: new TaskRequirement(	[getTaskElement(			"Veteran footman"				)],	[{task: "Battle tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
		"Knight"							: new TaskRequirement(	[getTaskElement(			"Knight"						)],	[{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
		"Veteran knight"					: new TaskRequirement(	[getTaskElement(			"Veteran knight"				)],	[{task: "Battle tactics", requirement: 150}, {task: "Knight", requirement: 10}]),
		"Elite knight"						: new TaskRequirement(	[getTaskElement(			"Elite knight"					)],	[{task: "Strength", requirement: 300}, {task: "Veteran knight", requirement: 10}]),
		"Holy knight"						: new TaskRequirement(	[getTaskElement(			"Holy knight"					)],	[{task: "Mana control", requirement: 500}, {task: "Elite knight", requirement: 10}]),
		"Legendary knight"					: new TaskRequirement(	[getTaskElement(			"Legendary knight"				)],	[{task: "Mana control", requirement: 1000}, {task: "Battle tactics", requirement: 1000}, {task: "Holy knight", requirement: 10}]),
	
		//The Arcane Association
		"Student"							: new TaskRequirement(	[getTaskElement(			"Student"						)],	[{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
		"Apprentice mage"					: new TaskRequirement(	[getTaskElement(			"Apprentice mage"				)],	[{task: "Mana control", requirement: 400}, {task: "Student", requirement: 10}]),
		"Mage"								: new TaskRequirement(	[getTaskElement(			"Mage"							)],	[{task: "Mana control", requirement: 700}, {task: "Apprentice mage", requirement: 10}]),
		"Wizard"							: new TaskRequirement(	[getTaskElement(			"Wizard"						)],	[{task: "Mana control", requirement: 1000}, {task: "Mage", requirement: 10}]),
		"Master wizard"						: new TaskRequirement(	[getTaskElement(			"Master wizard"					)],	[{task: "Mana control", requirement: 1500}, {task: "Wizard", requirement: 10}]),
		"Chairman"							: new TaskRequirement(	[getTaskElement(			"Chairman"						)],	[{task: "Mana control", requirement: 2000}, {task: "Master wizard", requirement: 10}]),
		"Illustrious Chairman"				: new TaskRequirement(	[getTaskElement(			"Illustrious Chairman"			)],	[{task: "Mana control", requirement: 3000}, {task: "Chairman", requirement: 1000}]),
	
		//The Order of Discovery
		"Junior Caretaker"					: new TaskRequirement(	[getTaskElement(			"Junior Caretaker"				)],	[{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}, {task: "Productivity", requirement: "500"}]),
		"Lead Caretaker"					: new TaskRequirement(	[getTaskElement(			"Lead Caretaker"				)],	[{task: "Junior Caretaker", requirement: 10}]),
		"Freshman"							: new TaskRequirement(	[getTaskElement(			"Freshman"						)],	[{task: "Lead Caretaker", requirement: 10}]),
		"Sophomore"							: new TaskRequirement(	[getTaskElement(			"Sophomore"						)],	[{task: "Freshman", requirement: 10}]),
		"Junior"							: new TaskRequirement(	[getTaskElement(			"Junior"						)],	[{task: "Sophomore", requirement: 10}]),
		"Senior"							: new TaskRequirement(	[getTaskElement(			"Senior"						)],	[{task: "Junior", requirement: 10}]),
		"Probation"							: new TaskRequirement(	[getTaskElement(			"Probation"						)],	[{task: "Senior", requirement: 10}]),
	
		//Nobility
		"Baronet"							: new TaskRequirement(	[getTaskElement(			"Baronet"						)],	[{task: "Elite knight", requirement: 10}]),
		"Baron"								: new TaskRequirement(	[getTaskElement(			"Baron"							)],	[{task: "Baronet", requirement: 10}]),
		"Vice Count"						: new TaskRequirement(	[getTaskElement(			"Vice Count"					)],	[{task: "Baron", requirement: 10}]),
		"Count"								: new TaskRequirement(	[getTaskElement(			"Count"							)],	[{task: "Vice Count", requirement: 10}]),
		"Duke"								: new TaskRequirement(	[getTaskElement(			"Duke"							)],	[{task: "Count", requirement: 10}]),
		"Grand Duke"						: new TaskRequirement(	[getTaskElement(			"Grand Duke"					)],	[{task: "Duke", requirement: 10}]),
		"Arch Duke"							: new TaskRequirement(	[getTaskElement(			"Arch Duke"						)],	[{task: "Grand Duke", requirement: 10}]),
		"Lord"								: new TaskRequirement(	[getTaskElement(			"Lord"							)],	[{task: "Arch Duke", requirement: 10}]),
		"High Lord"							: new TaskRequirement(	[getTaskElement(			"High Lord"						)],	[{task: "Lord", requirement: 10}]),
		"King"								: new TaskRequirement(	[getTaskElement(			"King"							)],	[{task: "High Lord", requirement: 10}]),
		"High King"							: new TaskRequirement(	[getTaskElement(			"High King"						)],	[{task: "King", requirement: 10}]),
		"Emperor of Mankind"				: new TaskRequirement(	[getTaskElement(			"Emperor of Mankind"			)],	[{task: "High King", requirement: 10}]),
	
		//Fundamentals
		"Concentration"						: new TaskRequirement(	[getTaskElement(			"Concentration"					)], []),
		"Productivity"						: new TaskRequirement(	[getTaskElement(			"Productivity"					)],	[{task: "Concentration", requirement: 5}]),
		"Bargaining"						: new TaskRequirement(	[getTaskElement(			"Bargaining"					)],	[{task: "Concentration", requirement: 20}]),
		"Meditation"						: new TaskRequirement(	[getTaskElement(			"Meditation"					)],	[{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),
	
		//Combat
		"Strength"							: new TaskRequirement(	[getTaskElement(			"Strength"						)], []),
		"Battle tactics"					: new TaskRequirement(	[getTaskElement(			"Battle tactics"				)],	[{task: "Concentration", requirement: 20}]),
		"Muscle memory"						: new TaskRequirement(	[getTaskElement(			"Muscle memory"					)],	[{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),
	
		//Magic
		"Mana control"						: new TaskRequirement(	[getTaskElement(			"Mana control"					)],	[{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
		"Immortality"						: new TaskRequirement(	[getTaskElement(			"Immortality"					)],	[{task: "Apprentice mage", requirement: 10}]),
		"Time warping"						: new TaskRequirement(	[getTaskElement(			"Time warping"					)],	[{task: "Mage", requirement: 10}]),
		"Super immortality"					: new TaskRequirement(	[getTaskElement(			"Super immortality"				)],	[{task: "Chairman", requirement: 1000}]),
	
		//Mind
		//"Novel Knowledge"					: new TaskRequirement(	[getTaskElement(			"Novel Knowledge"				)],	[{task: "Concentration", requirement: 700}, {task: "Meditation", requirement: 700}]),
		"Unusual Insight"					: new TaskRequirement(	[getTaskElement(			"Unusual Insight"				)],	[{task: "Meditation", requirement: 900}, {task: "Novel Knowledge", requirement: 900}]),
		"Trade Psychology"					: new TaskRequirement(	[getTaskElement(			"Trade Psychology"				)],	[{task: "Unusual Insight", requirement: 900}, {task: "Probation", requirement: 40}]),
		"Flow"								: new TaskRequirement(	[getTaskElement(			"Flow"							)],	[{task: "Unusual Insight", requirement: 1500}, {task: "Probation", requirement: 40}]),
		"Magical Engineering"				: new TaskRequirement(	[getTaskElement(			"Magical Engineering"			)],	[{task: "Chairman", requirement: 1}]),
		"Scales Of Thought"					: new TaskRequirement(	[getTaskElement(			"Scales Of Thought"				)],	[{task: "Chairman", requirement: 15}]),
		"Magical Biology"					: new TaskRequirement(	[getTaskElement(			"Magical Biology"				)],	[{task: "Chairman", requirement: 150}]),
	
		//Dark magic
		"Dark influence"					: new EvilRequirement(	[getTaskElement(			"Dark influence"				)],	[{requirement: 1}]),
		"Evil control"						: new EvilRequirement(	[getTaskElement(			"Evil control"					)],	[{requirement: 1}]),
		"Intimidation"						: new EvilRequirement(	[getTaskElement(			"Intimidation"					)],	[{requirement: 1}]),
		"Demon training"					: new EvilRequirement(	[getTaskElement(			"Demon training"				)],	[{requirement: 25}]),
		"Blood meditation"					: new EvilRequirement(	[getTaskElement(			"Blood meditation"				)],	[{requirement: 75}]),
		"Demon's wealth"					: new EvilRequirement(	[getTaskElement(			"Demon's wealth"				)],	[{requirement: 500}]),
	
	
		//Properties
		"Homeless"							: new CoinRequirement(	[getItemElement(			"Homeless"						)],	[{requirement: 0}]),
		"Tent"								: new CoinRequirement(	[getItemElement(			"Tent"							)],	[{requirement: 0}]),
		"Wooden hut"						: new CoinRequirement(	[getItemElement(			"Wooden hut"					)],	[{requirement: gameData.itemData["Wooden hut"].getExpense() * 100}]),
		"Cottage"							: new CoinRequirement(	[getItemElement(			"Cottage"						)],	[{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
		"House"								: new CoinRequirement(	[getItemElement(			"House"							)],	[{requirement: gameData.itemData["House"].getExpense() * 100}]),
		"Large house"						: new CoinRequirement(	[getItemElement(			"Large house"					)],	[{requirement: gameData.itemData["Large house"].getExpense() * 100}]),
		"Small Manor"						: new CoinRequirement(	[getItemElement(			"Small Manor"					)],	[{requirement: gameData.itemData["Small Manor"].getExpense() * 100}]),
		"Small palace"						: new CoinRequirement(	[getItemElement(			"Small palace"					)],	[{requirement: gameData.itemData["Small palace"].getExpense() * 100}]),
		"Grand palace"						: new CoinRequirement(	[getItemElement(			"Grand palace"					)],	[{requirement: gameData.itemData["Grand palace"].getExpense() * 100}]),
	
		//Misc
		"Book"								: new CoinRequirement(	[getItemElement(			"Book"							)],	[{requirement: 0}]),
		"Rag Clothing"						: new CoinRequirement(	[getItemElement(			"Rag Clothing"					)],	[{requirement: 10}]),
		"Dumbbells"							: new CoinRequirement(	[getItemElement(			"Dumbbells"						)],	[{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
		"Personal squire"					: new CoinRequirement(	[getItemElement(			"Personal squire"				)],	[{requirement: gameData.itemData["Personal squire"].getExpense() * 100}]),
		"Steel longsword"					: new CoinRequirement(	[getItemElement(			"Steel longsword"				)],	[{requirement: gameData.itemData["Steel longsword"].getExpense() * 100}]),
		"Butler"							: new CoinRequirement(	[getItemElement(			"Butler"						)],	[{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
		"Sapphire charm"					: new CoinRequirement(	[getItemElement(			"Sapphire charm"				)],	[{requirement: gameData.itemData["Sapphire charm"].getExpense() * 100}]),
		"Study desk"						: new CoinRequirement(	[getItemElement(			"Study desk"					)],	[{requirement: gameData.itemData["Study desk"].getExpense() * 100}]),
		"Library"							: new CoinRequirement(	[getItemElement(			"Library"						)],	[{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
		"Small Field"						: new TaskRequirement(	[getItemElement(			"Small Field"					)],	[{task: "Farmer", requirement: 25}]),
		"Basic Farm Tools"					: new TaskRequirement(	[getItemElement(			"Basic Farm Tools"				)],	[{task: "Farmer", requirement: 10}]),
		"Cheap Fishing Rod"					: new TaskRequirement(	[getItemElement(			"Cheap Fishing Rod"				)],	[{task: "Fisherman", requirement: 10}]),
		"Miner's Lantern"					: new TaskRequirement(	[getItemElement(			"Miner's Lantern"				)],	[{task: "Miner", requirement: 10}]),
		"Crappy Anvil"						: new TaskRequirement(	[getItemElement(			"Crappy Anvil"					)],	[{task: "Blacksmith", requirement: 10}]),
		"Breech Bellows"					: new TaskRequirement(	[getItemElement(			"Breech Bellows"				)],	[{task: "Blacksmith", requirement: 25}]),
		"Pack Horse"						: new TaskRequirement(	[getItemElement(			"Pack Horse"					)],	[{task: "Merchant", requirement: 10}]),
		"Small Shop"						: new TaskRequirement(	[getItemElement(			"Small Shop"					)],	[{task: "Merchant", requirement: 75}]),
		"Weapon Outlet"						: new TaskRequirement(	[getItemElement(			"Weapon Outlet"					)],	[{task: "Merchant", requirement: 200}]),
		"Ox-driven Plow"					: new TaskRequirement(	[getItemElement(			"Ox-driven Plow"				)],	[{task: "Farmer", requirement: 75}]),
		"Livestock-derived Fertilizer"		: new TaskRequirement(	[getItemElement(			"Livestock-derived Fertilizer"	)],	[{task: "Farmer", requirement: 85}]),
	}
	
	tempData["requirements"] = Object.assign({}, gameData.requirements);
};
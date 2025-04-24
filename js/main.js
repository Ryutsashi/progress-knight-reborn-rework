// initialization
document.addEventListener("DOMContentLoaded", () => {
	loadGameData();
	bindObjectFunctionContexts();
	registerEventListeners();
	initCustomEffects();
	addMultipliers();

	switchSelectedTab(jobTabButton, "jobs");

	update();
	setInterval(update, 1000 / updateSpeed);
	setInterval(saveGameData, 6000);
	setInterval(setSkillWithLowestMaxXp, 1000);
});

var gameData = {
	version: "0.4.1",
	taskData: {},
	itemData: {},
	townData: {},

	rawTownIncome: 0,
	coins: 0,
	days: 365 * 14,
	evil: 0,
	paused: false,
	timeWarpingEnabled: true,

	rebirthOneCount: 0,
	rebirthTwoCount: 0,

	currentJob: null,
	currentSkill: null,
	currentProperty: null,
	currentMisc: null,

	autoPromote: false,
	autoLearn: false,
	skippedSkills: [],
	darkMode: true,

	totalCitizens: 0,
	assignedCitizens: 0,
	idleCitizens: 0
};

//tempData is used during initial game setup.
var tempData = {};

//used for Auto Learn skill switching logic
var skillWithLowestMaxXp = null;

const autoPromoteElement = document.getElementById("autoPromote");
const autoLearnElement = document.getElementById("autoLearn");

const updateSpeed = 20;

const baseLifespan = 365 * 70;

var devModeFastProgress = false;
// ******* DEV MODE SPEED INCREASES ******* //
var baseGameSpeed = 4;
if (devModeFastProgress) {
	for (let skill of ["Concentration", "Meditation", "Mana control"]) {
		skillBaseData[skill].effect = 100;
	}
	baseGameSpeed = 32;
}

const enableVerboseLogging = false;

function ifVerboseLoggingSay(messageParts /*...arguments*/) {
	if (enableVerboseLogging) console.log(...arguments);
}

const unitSuffixes = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"];

const jobTabButton = document.getElementById("jobTabButton");

function getBaseLog(x, y) {
	return Math.log(y) / Math.log(x);
}

function getBindedTaskEffect(taskName) {
	var task = gameData.taskData[taskName];
	return task.getEffect.bind(task);
}

function getBindedItemEffect(itemName) {
	var item = gameData.itemData[itemName];
	return item.getEffect.bind(item);
}

function addMultipliers() {
	for (taskName in gameData.taskData) {
		var task = gameData.taskData[taskName];

		task.xpMultipliers = [];
		if (task instanceof Job) task.incomeMultipliers = [];

		task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task));
		task.xpMultipliers.push(getHappiness);
		task.xpMultipliers.push(getBindedTaskEffect("Dark influence"));
		task.xpMultipliers.push(getBindedTaskEffect("Demon training"));

		if (task instanceof Job) {
			task.incomeMultipliers.push(task.getLevelMultiplier.bind(task));
			task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"));
			task.xpMultipliers.push(getBindedTaskEffect("Productivity"));
			task.xpMultipliers.push(getBindedItemEffect("Personal squire"));
		} else if (task instanceof Skill) {
			task.xpMultipliers.push(getBindedTaskEffect("Concentration"));
			task.xpMultipliers.push(getBindedItemEffect("Rag Clothing"));
			task.xpMultipliers.push(getBindedItemEffect("Book"));
			task.xpMultipliers.push(getBindedItemEffect("Study desk"));
			task.xpMultipliers.push(getBindedItemEffect("Library"));
		}

		if (jobCategories["Military"].includes(task.name)) {
			task.incomeMultipliers.push(getBindedTaskEffect("Strength"));
			task.xpMultipliers.push(getBindedTaskEffect("Battle tactics"));
			task.xpMultipliers.push(getBindedItemEffect("Steel longsword"));
		} else if (
			jobCategories["The Order of Discovery"].includes(task.name)
		) {
			task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
			task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
		} else if (task.name == "Farmer") {
			//trying to make hand tools increase farmer income
			task.incomeMultipliers.push(
				getBindedItemEffect("Basic Farm Tools")
			);
			task.xpMultipliers.push(getBindedItemEffect("Small Field"));
			task.incomeMultipliers.push(getBindedItemEffect("Small Field"));
			task.incomeMultipliers.push(getBindedItemEffect("Ox-driven Plow"));
			task.xpMultipliers.push(getBindedItemEffect("Ox-driven Plow"));
			task.incomeMultipliers.push(
				getBindedItemEffect("Livestock-derived Fertilizer")
			);
		} else if (task.name == "Fisherman") {
			// Fishing rod boosts both income and fishing xp (bigger fish baby!)
			task.incomeMultipliers.push(
				getBindedItemEffect("Cheap Fishing Rod")
			);
			task.xpMultipliers.push(getBindedItemEffect("Cheap Fishing Rod"));
		} else if (task.name == "Miner") {
			//lantern boosts income and miner xp by 1.5x
			task.incomeMultipliers.push(getBindedItemEffect("Miner's Lantern"));
			task.xpMultipliers.push(getBindedItemEffect("Miner's Lantern"));
		} else if (task.name == "Blacksmith") {
			//crappy anvil boosts income and xp of blacksmith by 1.5x
			task.incomeMultipliers.push(getBindedItemEffect("Crappy Anvil"));
			task.xpMultipliers.push(getBindedItemEffect("Crappy Anvil"));
			task.incomeMultipliers.push(getBindedItemEffect("Breech Bellows"));
			task.xpMultipliers.push(getBindedItemEffect("Breech Bellows"));
		} else if (task.name == "Merchant") {
			task.incomeMultipliers.push(getBindedItemEffect("Pack Horse"));
			task.incomeMultipliers.push(
				getBindedTaskEffect("Trade Psychology")
			);
			task.xpMultipliers.push(getBindedItemEffect("Pack Horse"));
			task.incomeMultipliers.push(getBindedItemEffect("Small Shop"));
			task.xpMultipliers.push(getBindedItemEffect("Small Shop"));
			task.incomeMultipliers.push(getBindedItemEffect("Weapon Outlet"));
			task.xpMultipliers.push(getBindedItemEffect("Weapon Outlet"));
		} else if (task.name == "Chairman") {
			task.incomeMultipliers.push(
				getBindedTaskEffect("Magical Engineering")
			);
			task.xpMultipliers.push(getBindedTaskEffect("Magical Engineering"));
			task.xpMultipliers.push(getBindedTaskEffect("Scales Of Thought"));
			task.xpMultipliers.push(getBindedTaskEffect("Magical Biology"));
		} else if (task.name == "Illustrious Chairman") {
			task.incomeMultipliers.push(
				getBindedTaskEffect("Magical Engineering")
			);
			task.xpMultipliers.push(getBindedTaskEffect("Magical Engineering"));
			task.xpMultipliers.push(getBindedTaskEffect("Scales Of Thought"));
			task.xpMultipliers.push(getBindedTaskEffect("Magical Biology"));
		} else if (task.name == "Strength") {
			task.xpMultipliers.push(getBindedTaskEffect("Muscle memory"));
			task.xpMultipliers.push(getBindedItemEffect("Dumbbells"));
		} else if (skillCategories["Magic"].includes(task.name)) {
			task.xpMultipliers.push(getBindedItemEffect("Sapphire charm"));
			task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
			task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
			task.xpMultipliers.push(getBindedTaskEffect("Scales Of Thought"));
		} else if (skillCategories["Dark magic"].includes(task.name)) {
			task.xpMultipliers.push(getEvil);
		}
		if (jobCategories["The Arcane Association"].includes(task.name)) {
			task.xpMultipliers.push(getBindedTaskEffect("Mana control"));
			task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
			task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
		}
		if (jobCategories["Nobility"].includes(task.name)) {
			//todo
		}
	}

	for (itemName in gameData.itemData) {
		var item = gameData.itemData[itemName];
		item.expenseMultipliers = [];
		item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"));
		item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"));
	}
}

function initCustomEffects() {
	var bargaining = gameData.taskData["Bargaining"];
	bargaining.getEffect = function () {
		var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10;
		if (multiplier < 0.1) {
			multiplier = 0.1;
		}
		return multiplier;
	};

	var intimidation = gameData.taskData["Intimidation"];
	intimidation.getEffect = function () {
		var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10;
		if (multiplier < 0.1) {
			multiplier = 0.1;
		}
		return multiplier;
	};

	//          ***    HISTORICAL NOTES    ***
	// All gamespeed modifying effects are currently combined into this single Time warping multiplier
	// for simplicity's sake. As of this writing, the two relevant skills are Time warping and Flow.
	// As of June 23rd 2021, gameSpeed effects are broken out into their respective effects and functions
	// to increase clarity for players. The old method of combining effects into Time Warping caused Flow
	// to change the Time Warping skill description, which led to confusion.
	var timeWarping = gameData.taskData["Time warping"];
	var flow = gameData.taskData["Flow"];
	// This re-defined getEffect() function is called in the getGameSpeed() function.
	timeWarping.getEffect = function () {
		var multiplier = 1 + getBaseLog(13, timeWarping.level + 1);
		return multiplier;
	};

	flow.getEffect = function () {
		var multiplier = 1 + getBaseLog(100, flow.level + 1) / 1.3;
		return multiplier;
	};

	var immortality = gameData.taskData["Immortality"];
	immortality.getEffect = function () {
		var multiplier = 1 + getBaseLog(33, immortality.level + 1);
		return multiplier;
	};
}

function getHappiness() {
	var meditationEffect = getBindedTaskEffect("Meditation");
	var butlerEffect = getBindedItemEffect("Butler");
	var happiness =
		meditationEffect() *
		butlerEffect() *
		gameData.currentProperty.getEffect();
	return happiness;
}

function getEvil() {
	return gameData.evil;
}

function applyMultipliers(value, multipliers) {
	var finalMultiplier = 1;
	multipliers.forEach(function (multiplierFunction) {
		//wtf is multiplier function? It's called like a function, but we have no function definition ANYWHERE. Mrrrrr...
		if (multiplierFunction !== null) {
			try {
				var multiplier = multiplierFunction();
				finalMultiplier *= multiplier;
			} catch (e) {
				console.log(multiplierFunction);
				console.trace();
			}
		}
	});
	var finalValue = Math.round(value * finalMultiplier);
	return finalValue;
}

function applySpeed(value) {
	finalValue = (value * getGameSpeed()) / updateSpeed;
	return finalValue;
}

function getEvilGain() {
	var evilControl = gameData.taskData["Evil control"];
	var bloodMeditation = gameData.taskData["Blood meditation"];
	var evil = evilControl.getEffect() * bloodMeditation.getEffect();
	return evil;
}

function getAllTimeMultipliers() {
	var timeWarping = gameData.taskData["Time warping"];
	var flow = gameData.taskData["Flow"];
	var flowSpeed = flow.getEffect();
	var timeWarpingSpeed = gameData.timeWarpingEnabled
		? timeWarping.getEffect()
		: 1;
	var totalTimeMultiplier = flowSpeed * timeWarpingSpeed;
	return totalTimeMultiplier;
}

function getGameSpeed() {
	var gameSpeed =
		baseGameSpeed *
		+!gameData.paused *
		+isAlive() *
		getAllTimeMultipliers();
	return gameSpeed;
}

function applyExpenses() {
	var coins = applySpeed(getExpense());
	gameData.coins -= coins;
	if (gameData.coins < 0) {
		goBankrupt();
	}
}

function getExpense() {
	var expense = 0;
	expense += gameData.currentProperty.getExpense();
	for (misc of gameData.currentMisc) {
		expense += misc.getExpense();
	}
	return expense;
}

function goBankrupt() {
	gameData.coins = 0;
	gameData.currentProperty = gameData.itemData["Homeless"];
	gameData.currentMisc = [];
}

function switchSelectedTab(newSelectedTab, oldSelectedTab) {
	let tabs = Array.from(document.querySelectorAll(".tab"));
	tabs.forEach(tab => tab.style.display = "none");
	document.getElementById(oldSelectedTab).style.display = "block";

	let tabButtons = document.querySelectorAll(".tabButton");
	for (let tab of tabButtons) {
		tab.classList.remove("w3-blue-gray");
	}
	newSelectedTab.classList.add("w3-blue-gray");
}

function togglePause() {
	gameData.paused = !gameData.paused;
	updateUI();
}

function toggleTimeWarping() {
	gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled;
}

function setActiveTask(taskName) {
	let task = gameData.taskData[taskName];
	task instanceof Job
		? (gameData.currentJob = task)
		: (gameData.currentSkill = task);
}

function setActiveProperty(propertyName) {
	gameData.currentProperty = gameData.itemData[propertyName];
}

function toggleActiveMisc(miscName) {
	let misc = gameData.itemData[miscName];
	if (gameData.currentMisc.includes(misc)) {
		for (i = 0; i < gameData.currentMisc.length; i++) {
			if (gameData.currentMisc[i] == misc) {
				gameData.currentMisc.splice(i, 1);
			}
		}
	} else {
		gameData.currentMisc.push(misc);
	}
}

function createData(data, baseData) {
	Object.values(baseData).forEach(entity => createEntity(data, entity));
}

function createEntity(data, entity) {
	if ("income" in entity) {
		data[entity.name] = new Job(entity);
	} else if ("maxXp" in entity) {
		data[entity.name] = new Skill(entity);
	} else {
		data[entity.name] = new Item(entity);
	}
	data[entity.name].id = "row " + entity.name;
}

function createRequiredRow(categoryName) {
	let requiredRow = document
		.querySelector(".requiredRowTemplate")
		.content.firstElementChild.cloneNode(true);
	requiredRow.classList.add("requiredRow");
	requiredRow.classList.add(removeSpaces(categoryName));
	requiredRow.id = categoryName;
	return requiredRow;
}

function createHeaderRow(templates, categoryType, categoryName) {
	let headerRow = templates.headerRow.content.firstElementChild.cloneNode(true);
	headerRow.querySelector(".category").textContent = categoryName;
	if (categoryType != itemCategories) {
		headerRow.querySelector(".valueType").textContent =
			categoryType == jobCategories
				? "Income/day"
				: "Effect";
	}

	headerRow.style.backgroundColor = headerRowColors[categoryName];
	headerRow.style.color = "#ffffff";
	headerRow.classList.add(removeSpaces(categoryName));
	headerRow.classList.add("headerRow");

	return headerRow;
}


function createRow(templates, name, categoryName, categoryType) {
	let row = templates.row.content.firstElementChild.cloneNode(true);
	row.getElementsByClassName("name")[0].textContent = name;
	row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name];
	/* TODO: uncomment once data is restructured
	for (let data of [
		jobBaseData,
		skillBaseData,
		projectBaseData,
		itemBaseData
	]) {
		if (data[name]) {
			row.getElementsByClassName("tooltipText")[0].textContent = data[name].tooltip;
		}
	}
	*/
	row.id = "row " + name;
	if (categoryType != itemCategories) {
		row.getElementsByClassName("progressBar")[0].onclick = () => setActiveTask(name);
	} else {
		row.getElementsByClassName("button")[0].onclick =
			categoryName == "Properties"
				? () => setActiveProperty(name)
				: () => toggleActiveMisc(name);
	}

	return row;
}

function createAllRows(categoryType, tableId) {
	let templates = {
		headerRow: document.querySelector(
			categoryType == itemCategories
				? ".headerRowItemTemplate"
				: ".headerRowTaskTemplate"
		),
		row: document.querySelector(
			categoryType == itemCategories
				? ".rowItemTemplate"
				: ".rowTaskTemplate"
		)
	};

	let table = document.getElementById(tableId);

	for (let categoryName in categoryType) {
		table.appendChild(createHeaderRow(templates, categoryType, categoryName));

		let categories = categoryType[categoryName];
		categories.forEach(name => table.appendChild(createRow(templates, name, categoryName, categoryType)));

		table.append(createRequiredRow(categoryName));
	}
}

function updateQuickTaskDisplay(taskType) {
	let currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill;
	let quickTaskDisplayElement = document.getElementById("quickTaskDisplay");
	let progressBar = quickTaskDisplayElement.querySelector("." + taskType);
	progressBar.querySelector(".name").textContent = `${currentTask.name} lvl ${currentTask.level}`;
	progressBar.querySelector(".progressFill").style.width = (currentTask.xp / currentTask.getMaxXp()) * 100 + "%";
}

/*
 *   ******* REFACTOR SORELY NEEDED *******
 *   ******* DOCUMENTATION SORELY NEEDED *******
 */

/*
 *   This function gets called three times. Once with jobs, once with skills, and once for items.
 *   Execution: this function first gathers a list of all possible required rows.
 *   It then parses through each and every possible required row.
 *
 */
function updateRequiredRows(data, categoryType) {
	var requiredRows = document.getElementsByClassName("requiredRow");
	for (requiredRow of requiredRows) {
		var nextEntity = null;
		var category = categoryType[requiredRow.id]; //requiredRow.id is simple the category name. For items, it's either the array Property or Misc
		if (category == null) {
			continue;
		}

		// Once we have the array of items, skills or jobs through the category variable, we iterate through each item within the array
		// with the goal of finding the next entity within the array that has not met it's requirements.
		// So this for loop is responsible for choosing the row we use as the required row, and is a good target for changing the logic of
		// required row display.
		if (categoryType.Misc == undefined) {
			for (i = 0; i < category.length; i++) {
				var entityName = category[i]; //first we grab the name, like "Beggar" or "Rag Clothing"
				if (i >= category.length - 1) break;
				var requirements = gameData.requirements[entityName]; //grab any requirements
				if (requirements && i == 0) {
					//if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
					if (!requirements.isCompleted()) {
						nextEntity = data[entityName];
						break;
					}
				}

				var nextIndex = i + 1;
				if (nextIndex >= category.length) {
					break;
				}
				var nextEntityName = category[nextIndex];
				nextEntityRequirements = gameData.requirements[nextEntityName];

				if (!nextEntityRequirements.isCompleted()) {
					nextEntity = data[nextEntityName];
					break;
				}
			}
		}
		//separate decision logic for nextEntity within the Shop
		// Step one:
		// Step two: then we'll
		else if (categoryType.Misc != undefined) {
			for (i = 0; i < category.length; i++) {
				var entityName = category[i]; //first we grab the name, like "Beggar" or "Rag Clothing"
				if (i >= category.length - 1) break;
				var requirements = gameData.requirements[entityName]; //grab any requirements
				if (requirements && i == 0) {
					//if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
					if (!requirements.isCompleted()) {
						nextEntity = data[entityName];
						break;
					}
				}

				var nextIndex = i + 1;
				if (nextIndex >= category.length) {
					break;
				}
				var nextEntityName = category[nextIndex];
				nextEntityRequirements = gameData.requirements[nextEntityName];

				if (!nextEntityRequirements.isCompleted()) {
					nextEntity = data[nextEntityName];
					break;
				}

				//decision logic for setting the item to be up next, and therefore used for the required row
				//if the current job doesn't match the job in the entity's TaskRequirement, continue to the next loop iteration
				//if the current job matches the item, display that item in the required rows

				/* var requirementObject = nextEntityRequirements; //grab the containing requirement object, like TaskRequirement or CoinRequirement
            if( (requirementObject instanceof TaskRequirement) && gameData.currentJob == requirementObject.requirements[0].task && !requirementObject.isCompleted()) {
                //i++;
                nextEntity = data[nextEntityName];
                break;
            } else if( (requirementObject instanceof TaskRequirement) && gameData.currentJob != requirementObject.requirements[0].task) {
                continue;
            }  else if(requirementObject instanceof CoinRequirement && !nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName];
                break;
            } */
			}
		}

		//If we didn't find an object within the array that has requirements left to fulfill, we don't display any
		//required row. We do this by setting the required row to hiddenTask so it doesn't display.
		if (nextEntity == null) {
			requiredRow.classList.add("hiddenTask");

			//Otherwise, we do have an object to display a required row for. This following code is the code
			//that decides what exactly gets displayed into the requiredRow template.
		} else {
			requiredRow.classList.remove("hiddenTask");
			var requirementObject = gameData.requirements[nextEntity.name]; //grab the containing requirement object, like TaskRequirement or CoinRequirement
			var requirements = requirementObject.requirements; //get the inner object, like {task: Concentration, requirement: 85}

			//grab references to <span> elements within the template
			var coinElement = requiredRow.getElementsByClassName("coins")[0];
			var levelElement = requiredRow.getElementsByClassName("levels")[0];
			var evilElement = requiredRow.getElementsByClassName("evil")[0];

			//start by setting all spans to hidden
			coinElement.classList.add("hiddenTask");
			levelElement.classList.add("hiddenTask");
			evilElement.classList.add("hiddenTask");

			var finalText = "";
			if (data == gameData.taskData) {
				//display logic for a Job or Skill required row
				if (requirementObject instanceof EvilRequirement) {
					evilElement.classList.remove("hiddenTask");
					evilElement.textContent =
						format(requirements[0].requirement) + " evil";
				} else {
					levelElement.classList.remove("hiddenTask");

					//for each mini-object, like {task: Concentration, requirement: 10} inside the containing object like TaskRequirement
					for (requirement of requirements) {
						var task = gameData.taskData[requirement.task];
						//why not just use the already-built requirement.isCompleted check?
						if (task.level >= requirement.requirement) continue;
						var text =
							" " +
							requirement.task +
							" level " +
							task.level +
							"/" +
							format(requirement.requirement) +
							",";
						finalText += text;
					}
					finalText = finalText.substring(0, finalText.length - 1);
					levelElement.textContent = finalText;
				}
				//Item requirement row display logic

				/*
				 *   So once we're here, there are two cases.
				 *   The first case is a simple item with only a CoinRequirement. In this case, we use the original display logic.
				 *   Second case, the item has a TaskRequirement and no CoinRequirement. So as-is, the display logic somehow displays
				 *   the item's expense even though it isn't accessed through a CoinRequirement. Weird as hell. No idea how it's doing that for the
				 *   items that only have TaskRequirements, unless this whole time it's actually been displaying the Task level requirement as the coin cost.
				 *   I think that is what has been happening. Lmao. Oops.
				 *
				 */
			} else if (data == gameData.itemData) {
				if (requirementObject instanceof CoinRequirement) {
					coinElement.classList.remove("hiddenTask");
					levelElement.classList.remove("hiddenTask");
					formatCoins(requirements[0].requirement, coinElement);
				} else if (requirementObject instanceof TaskRequirement) {
					levelElement.classList.remove("hiddenTask");
					for (requirement of requirements) {
						var task = gameData.taskData[requirement.task];
						//why not just use the already-built requirement.isCompleted check?
						if (task.level >= requirement.requirement) continue;
						var text =
							" " +
							requirement.task +
							" level " +
							format(task.level) +
							"/" +
							format(requirement.requirement) +
							",";
						finalText += text;
					}
					finalText = finalText.substring(0, finalText.length - 1);
					levelElement.textContent = finalText;
				}
			}
		}
	}
}

function updateTaskRows() {
	for (let key in gameData.taskData) {
		let task = gameData.taskData[key];
		let row = document.getElementById("row " + task.name);
		row.getElementsByClassName("level")[0].textContent = task.level;
		row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain());
		row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft());

		let maxLevel = row.getElementsByClassName("maxLevel")[0];
		maxLevel.textContent = task.maxLevel;
		gameData.rebirthOneCount > 0
			? maxLevel.classList.remove("hidden")
			: maxLevel.classList.add("hidden");

		let progressFill = row.getElementsByClassName("progressFill")[0];
		progressFill.style.width = (task.xp / task.getMaxXp()) * 100 + "%";
		task == gameData.currentJob || task == gameData.currentSkill
			? progressFill.classList.add("current")
			: progressFill.classList.remove("current");

		let valueElement = row.getElementsByClassName("value")[0];
		valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job;
		valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill;

		let skipSkillElement = row.getElementsByClassName("skipSkill")[0];
		skipSkillElement.style.display =
			task instanceof Skill && autoLearnElement.checked
				? "block"
				: "none";

		if (task instanceof Job) {
			formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0]);
		} else {
			valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription();
		}
	}
}

function updateItemRows() {
	for (key in gameData.itemData) {
		var item = gameData.itemData[key];
		var row = document.getElementById("row " + item.name);
		var active = row.getElementsByClassName("active")[0];
		var color = itemCategories["Properties"].includes(item.name)
			? headerRowColors["Properties"]
			: headerRowColors["Misc"];
		active.style.backgroundColor =
			gameData.currentMisc.includes(item) ||
			item == gameData.currentProperty
				? color
				: "white";
		row.getElementsByClassName("effect")[0].textContent =
			item.getEffectDescription();
		formatCoins(
			item.getExpense(),
			row.getElementsByClassName("expense")[0]
		);
	}
}

function updateHeaderRows(categories) {
	for (categoryName in categories) {
		let className = removeSpaces(categoryName);
		let headerRow = document.getElementsByClassName(className)[0];
		let maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0];
		gameData.rebirthOneCount > 0
			? maxLevelElement.classList.remove("hidden")
			: maxLevelElement.classList.add("hidden");
		let skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0];
		skipSkillElement.style.display =
			categories == skillCategories && autoLearnElement.checked
				? "block"
				: "none";
	}
}

function updateText() {
	//Sidebar
	document.getElementById("ageDisplay").textContent = daysToYears(gameData.days);
	document.getElementById("dayDisplay").textContent = getDay();
	document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan());
	document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause";

	formatCoins(gameData.coins, document.getElementById("coinDisplay"));
	setSignDisplay();
	formatCoins(getNet(), document.getElementById("netDisplay"));
	formatCoins(getIncome(), document.getElementById("incomeDisplay"));
	formatCoins(getExpense(), document.getElementById("expenseDisplay"));

	document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1);

	document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1);
	document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1);

	document.getElementById("timeWarpingDisplay").textContent = "x" + getAllTimeMultipliers().toFixed(2);
	document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp";

	function updateBuildingBadges() {
		var woodenHutButton = document.getElementById("woodenHut");
		woodenHutButton.children[0].innerHTML = o_townBuildingsContainer.o_woodenHut.count;

		var farmButton = document.getElementById("farm");
		farmButton.children[0].innerHTML = o_townBuildingsContainer.o_farm.count;

		var grainShedButton = document.getElementById("grainShed");
		grainShedButton.children[0].innerHTML = o_townBuildingsContainer.o_grainShed.count;
	}
	updateBuildingBadges();

	formatCoins(gameData.rawTownIncome, document.getElementById("townIncomeDisplay"));
}

function setSignDisplay() {
	const plus = document.querySelector(".positive-income-sign");
	const minus = document.querySelector(".negative-income-sign");
	const net = getIncome() - getExpense();
	plus.style.display = net > 0 ? "inline" : "none";
	minus.style.display = net < 0 ? "inline" : "none";
}

function getNet() {
	return Math.abs(getIncome() - getExpense());
}

function hideEntities() {
	for (key in gameData.requirements) {
		var requirement = gameData.requirements[key];
		var completed = requirement.isCompleted();
		for (element of requirement.elements) {
			if (completed) {
				element.classList.remove("hidden");
			} else {
				element.classList.add("hidden");
			}
		}
	}
}

function createItemData(baseData) {
	for (var item of baseData) {
		gameData.itemData[item.name] =
			"happiness" in item ? new Property(task) : new Misc(task);
		gameData.itemData[item.name].id = "item " + item.name;
	}
}

function doCurrentTask(task) {
	task.increaseXp();
	if (task instanceof Job) {
		increaseCoins();
	}
}

function getIncome() {
	return gameData.currentJob.getIncome() + gameData.rawTownIncome;
}

function increaseCoins() {
	gameData.coins += applySpeed(getIncome());
}

function getCategoryFromEntityName(categoryType, entityName) {
	for (let categoryName in categoryType) {
		let category = categoryType[categoryName];
		if (category.includes(entityName)) {
			return category;
		}
	}
}

function getNextEntity(data, categoryType, entityName) {
	let category = getCategoryFromEntityName(categoryType, entityName);
	let nextIndex = category.indexOf(entityName) + 1;
	if (nextIndex > category.length - 1) return null;
	let nextEntityName = category[nextIndex];
	let nextEntity = data[nextEntityName];
	return nextEntity;
}

function autoPromote() {
	if (!autoPromoteElement.checked) return;
	let nextEntity = getNextEntity(
		gameData.taskData,
		jobCategories,
		gameData.currentJob.name
	);
	if (nextEntity == null) return;
	let requirement = gameData.requirements[nextEntity.name];
	if (requirement.isCompleted()) gameData.currentJob = nextEntity;
}

function checkSkillSkipped(skill) {
	let row = document.getElementById("row " + skill.name);
	let isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked;
	return isSkillSkipped;
}

function setSkillWithLowestMaxXp() {
	var enabledSkills = [];

	for (skillName in gameData.taskData) {
		var skill = gameData.taskData[skillName];
		var requirement = gameData.requirements[skillName];
		/*
        Getting an autolearn error, and the dev console says there is an uncaught
        TypeError at this line of code below during the requirement.isCompleted() call. 
        I think the error is saying that when calling requirement.isCompleted, requirement is undefined.
        This would make sense if I have a skill that doesn't have any unlock requirements, which I think
        is true of Novel Knowledge for table rendering reasons. So the game logic assumes each skill has a requirement
        without actually checking if requirement is non-null. 
        */
		if (skill instanceof Skill) {
			//This check on the requirement variable is here to handle the case of a skill
			//having no requirements. By setting requirement equal to Concentration's requirements,
			//we prevent unchecked TypeErrors that have been breaking the auto learn feature.

			// NOTE : FRAGILE FIX
			// This fix will break if the Concentration skill is either removed from the game, renamed, or the requirement is no
			// longer immediately satisfied upon starting a new game.
			if (requirement == null) {
				requirement = gameData.requirements["Concentration"];
			}
			if (requirement.isCompleted() && !checkSkillSkipped(skill)) {
				enabledSkills.push(skill);
			}
		}
	}

	if (enabledSkills.length == 0) {
		skillWithLowestMaxXp = gameData.taskData["Concentration"];
		return;
	}

	enabledSkills.sort((lhs, rhs) => {
		return (
			lhs.getMaxXp() / lhs.getXpGain() - rhs.getMaxXp() / rhs.getXpGain()
		);
	});

	var skillName = enabledSkills[0].name;
	skillWithLowestMaxXp = gameData.taskData[skillName];
}

function autoLearn() {
	if (!autoLearnElement.checked || !skillWithLowestMaxXp) return;
	gameData.currentSkill = skillWithLowestMaxXp;
}

function daysToYears(days) {
	return Math.floor(days / 365);
}

function yearsToDays(years) {
	return Math.floor(years * 365);
}

function getDay() {
	return Math.floor(gameData.days % 365);
}

function increaseDays() {
	gameData.days += applySpeed(1);
}

function format(number) {
	// what tier? (determines SI symbol)
	let tier = (Math.log10(number) / 3) | 0;

	// if zero, we don't need a suffix
	if (tier == 0) return number;

	// get suffix and determine scale
	let suffix = unitSuffixes[tier];
	let scale = Math.pow(10, tier * 3);

	// scale the number
	let scaled = number / scale;

	// format number and add suffix
	return scaled.toFixed(1) + suffix;
}

/*
 * Input:  coins   = 'number' type, representing money in raw copper coins format
 *         element = any HTML element containing four <span> elements.
 * Output: Coin values are placed into their respective <span> elements.
 *         Span styles are set to represent coin colors. (e.g. gold color for gold coins)
 *
 */
function formatCoins(coins, element) {
	let tiers = ["p", "g", "s"];
	let colors = {
		p: "#79b9c7",
		g: "#E5C100",
		s: "#a8a8a8",
		c: "#a15c2f"
	};
	let leftOver = coins;
	let text;
	let i = 0;
	for (let tier of tiers) {
		let x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2));
		leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2));
		text = format(String(x)) + tier + " ";
		element.children[i].textContent = x > 0 ? text : "";
		element.children[i].style.color = colors[tier];
		i += 1;
	}
	if (leftOver == 0 && coins > 0) {
		element.children[3].textContent = "";
		return;
	}
	text = String(Math.floor(leftOver)) + "c";
	element.children[3].textContent = text;
	element.children[3].style.color = colors["c"];
}

function getTaskElement(taskName) {
	return document.getElementById(gameData.taskData[taskName].id);
}

function getItemElement(itemName) {
	return document.getElementById(gameData.itemData[itemName].id);
}

function getElementsByClass(className) {
	return document.getElementsByClassName(removeSpaces(className))
}

function toggleLightDarkMode() {
	document.body.classList[document.body.classList.contains("dark") ? "remove" : "add"]("dark");
}

function removeSpaces(string) {
	return string.replaceAll(" ", "");
}

function rebirthOne() {
	gameData.rebirthOneCount += 1;

	rebirthReset();
}

function rebirthTwo() {
	testSuccessOfTownDestruction();

	gameData.rebirthTwoCount += 1;
	gameData.evil += getEvilGain();

	rebirthReset();

	Object.values(gameData.taskData).forEach(task => task.maxLevel = 0);

	destroyTownWhileEmbracingEvil();
	testSuccessOfTownDestruction();
}

function rebirthReset() {
	switchSelectedTab(jobTabButton, "jobs");

	gameData.coins = 0;
	gameData.days = 365 * 14;
	gameData.currentJob = gameData.taskData["Beggar"];
	gameData.currentSkill = gameData.taskData["Concentration"];
	gameData.currentProperty = gameData.itemData["Homeless"];
	gameData.currentMisc = [];

	Object.values(gameData.taskData).forEach(task => {
		task.maxLevel = Math.max(task.level, task.maxLevel);
		task.level = 0;
		task.xp = 0;
	});

	Object.entries(gameData.requirements).forEach(([key, value]) => {
		if (!value.completed || !permanentUnlocks.includes(key)) {
			value.completed = false;
		}
	})
}

function getLifespan() {
	let immortality = gameData.taskData["Immortality"];
	let superImmortality = gameData.taskData["Super immortality"];
	return baseLifespan * immortality.getEffect() * superImmortality.getEffect();
}

function isAlive() {
	let condition = gameData.days < getLifespan();
	let deathText = document.getElementById("deathText");
	if (!condition) {
		gameData.days = getLifespan();
		deathText.classList.remove("hidden");
	} else {
		deathText.classList.add("hidden");
	}
	return condition;
}

function assignMethods() {
	Object.entries(gameData.taskData).forEach(([taskKey, task]) => {
		if (task.baseData.income) {
			task.baseData = jobBaseData[task.name];
			gameData.taskData[taskKey] = Object.assign(new Job(jobBaseData[task.name]), task);
		} else {
			task.baseData = skillBaseData[task.name];
			gameData.taskData[taskKey] = Object.assign(new Skill(skillBaseData[task.name]), task);
		}
	})

	Object.entries(gameData.itemData).forEach(([itemKey, item]) => {
		item.baseData = itemBaseData[item.name];
		gameData.itemData[itemKey] = Object.assign(new Item(itemBaseData[item.name]), item);
	});

	const REQUIREMENT_CLASS = {
		task: TaskRequirement,
		coins: CoinRequirement,
		age: AgeRequirement,
		evil: EvilRequirement
	}

	for (let key in gameData.requirements) {
		let requirement = gameData.requirements[key];
		requirement = Object.assign(
			new REQUIREMENT_CLASS[requirement.type](
				requirement.elements,
				requirement.requirements
			),
			requirement
		);
		let tempRequirement = tempData["requirements"][key];
		requirement.elements = tempRequirement.elements;
		requirement.requirements = tempRequirement.requirements;
		gameData.requirements[key] = requirement;
	}

	gameData.currentJob = gameData.taskData[gameData.currentJob.name];
	gameData.currentSkill = gameData.taskData[gameData.currentSkill.name];
	gameData.currentProperty = gameData.itemData[gameData.currentProperty.name];
	gameData.currentMisc = gameData.currentMisc.map(misc => gameData.itemData[misc.name]);
}

function updateUI() {
	updateTaskRows();
	updateItemRows();
	updateRequiredRows(gameData.taskData, jobCategories);
	updateRequiredRows(gameData.taskData, skillCategories);
	updateRequiredRows(gameData.itemData, itemCategories);
	updateHeaderRows(jobCategories);
	updateHeaderRows(skillCategories);
	updateQuickTaskDisplay("job");
	updateQuickTaskDisplay("skill");
	hideEntities();
	updateText();
}

function update() {
	if (gameData.paused) return;

	increaseDays();
	autoPromote();
	autoLearn();
	doCurrentTask(gameData.currentJob);
	doCurrentTask(gameData.currentSkill);
	applyExpenses();
	updateUI();
}

function registerEventListeners() {
	let woodenHutButton = document.getElementById("woodenHut");
	woodenHutButton.addEventListener("click", o_townBuildingsContainer.o_woodenHut.handleClick);
	woodenHutButton.addEventListener("mouseenter", updateTooltip);

	let farmButton = document.getElementById("farm");
	farmButton.addEventListener("click", o_townBuildingsContainer.o_farm.handleClick);
	farmButton.addEventListener("mouseenter", updateTooltip);

	let grainShedButton = document.getElementById("grainShed");
	grainShedButton.addEventListener("click", o_townBuildingsContainer.o_grainShed.handleClick);
	grainShedButton.addEventListener("mouseenter", updateTooltip);
}

/*
 *   Note: this gets called before we register event listeners, otherwise we register
 *   the old functions with improper 'this' context.
 */
function bindObjectFunctionContexts() {
	o_townBuildingsContainer.o_woodenHut.handleClick =
		o_townBuildingsContainer.o_woodenHut.handleClick.bind(
			o_townBuildingsContainer.o_woodenHut
		);
	o_townBuildingsContainer.o_farm.handleClick =
		o_townBuildingsContainer.o_farm.handleClick.bind(
			o_townBuildingsContainer.o_farm
		);
	o_townBuildingsContainer.o_grainShed.handleClick =
		o_townBuildingsContainer.o_grainShed.handleClick.bind(
			o_townBuildingsContainer.o_grainShed
		);
	o_townBuildingsContainer.o_grainShed.calculateMultiplier =
		o_townBuildingsContainer.o_grainShed.calculateMultiplier.bind(
			o_townBuildingsContainer.o_grainShed
		);
}

createAllRows(jobCategories, "jobTable");
createAllRows(skillCategories, "skillTable");
createAllRows(itemCategories, "itemTable");

createData(gameData.taskData, jobBaseData);
createData(gameData.taskData, skillBaseData);
createData(gameData.itemData, itemBaseData);

gameData.currentJob = gameData.taskData["Beggar"];
gameData.currentSkill = gameData.taskData["Concentration"];
gameData.currentProperty = gameData.itemData["Homeless"];
gameData.currentMisc = [];

initializeRequirements();

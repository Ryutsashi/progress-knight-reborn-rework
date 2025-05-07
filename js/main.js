let gameData = {
	version: "0.4.1",
	taskData: {},
	itemData: {},
	townData: {},

	rawTownIncome: 0,
	coins: 0,
	days: 365 * 14,
	evil: 0,
	isDead: false,
	isPaused: false,
	timeWarpingEnabled: true,

	rebirthOneCount: 0,
	rebirthTwoCount: 0,

	currentJob: null,
	currentSkill: null,
	currentProperty: null,
	currentMisc: [],

	autoPromote: false,
	autoLearn: false,
	skippedSkills: [],
	darkMode: true,

	totalCitizens: 0,
	assignedCitizens: 0,
	idleCitizens: 0
};

const unitSuffixes = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"];

/*
	TODO: remove this after data and save/load restructuring
	The reason is that we're currently using gameData as both a saveState and, during load,
	we override its values with actual game state data. This causes some information to be
	overwritten so tempData is used to restore some of it. However, the loaded data and
	the game state should be kept separate.
*/
// tempData is used during initial game setup.
let tempData = {};

// used for Auto Learn skill switching logic
let skillWithLowestMaxXp = null;

const jobTabButton = document.getElementById("jobTabButton");

const updateSpeed = 20;
let baseGameSpeed = 4;
const baseLifespan = yearsToDays(70);

const devModeFastProgress = false;
const enableVerboseLogging = false;

if (devModeFastProgress) {
	for (let skill of ["Concentration", "Meditation", "Mana control"]) {
		skillBaseData[skill].effect = 100;
	}
	baseGameSpeed = 32;
}

function ifVerboseLoggingSay(messageParts /*...arguments*/) {
	if (!enableVerboseLogging) return;
	let args = [...arguments];
	console.log({details: (() => {
		let error = new Error();
		return () => {
			// using warn so I can easily filter these
			console.warn(...args)
			console.warn(error.stack);
		};
	})()})
	console.log(...args);
}

// TODO: silly method, remove when refactored out of the code
function removeSpaces(string) {
	return string.replaceAll(" ", "");
}

// TODO: remove when data is refactored
function getTaskElement(taskName) {
	return document.getElementById(gameData.taskData[taskName].id);
}

// TODO: remove when data is refactored
function getItemElement(itemName) {
	return document.getElementById(gameData.itemData[itemName].id);
}

//#region getters, calc methods, and other simple helpers
function formatNumberWithSuffix(number) {
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

function getBaseLog(x, y) {
	return Math.log(y) / Math.log(x);
}

function getNet() {
	return Math.abs(getIncome() - getExpense());
}

function getIncome() {
	return gameData.currentJob.getIncome() + gameData.rawTownIncome;
}

function getBoundTaskEffect(taskName, data = gameData.taskData) {
	return data[taskName].getEffect.bind(data[taskName]);
}

function getBoundItemEffect(itemName, data = gameData.itemData) {
	return data[itemName].getEffect.bind(data[itemName]);
}

function getEvilGain() {
	return gameData.taskData["Evil control"].getEffect() * gameData.taskData["Blood meditation"].getEffect();
}

function getAllTimeMultipliers() {
	if (!gameData.timeWarpingEnabled) return 1;
	return gameData.taskData["Time warping"].getEffect() * gameData.taskData["Flow"].getEffect();
}

function getGameSpeed() {
	return baseGameSpeed * !gameData.isPaused * isAlive() * getAllTimeMultipliers();
}

function getExpense() {
	return gameData.currentMisc.reduce((sum, misc) => misc.getExpense() + sum, gameData.currentProperty.getExpense());
}

function getHappiness() {
    return getBoundTaskEffect("Meditation")() * getBoundItemEffect("Butler")() * gameData.currentProperty.getEffect();
}

function getEvil() {
    return gameData.evil;
}

function daysToYears(days) {
	return Math.floor(days / 365);
}

function yearsToDays(years) {
	return Math.floor(years * 365);
}

function getDayInYear() {
	return Math.floor(gameData.days % 365);
}
//#endregion

//#region basic update methods
function increaseCoins() {
	gameData.coins += applySpeed(getIncome());
}

function increaseDays() {
	gameData.days += applySpeed(1);
}

function applySpeed(value) {
	return (value * getGameSpeed()) / updateSpeed;
}

function setActiveTask(taskName) {
	let task = gameData.taskData[taskName];
	gameData[task instanceof Job ? "currentJob" : "currentSkill"] = task;
}

function applyMultipliers(value, multipliers) {
	return Math.round(multipliers.reduce((final, fn) => final *= fn(), value));
}

function applyExpenses() {
	gameData.coins -= applySpeed(getExpense());
	if (gameData.coins < 0) {
		goBankrupt();
	}
}

function doCurrentTask(task) {
	task.increaseXp();
	if (task instanceof Job) {
		increaseCoins();
	}
}
//#endregion

//#region simple state modifier methods
function setActiveProperty(propertyName) {
	gameData.currentProperty = gameData.itemData[propertyName];
}

function togglePause() {
	gameData.isPaused = !gameData.isPaused;
	updateUI();
}

function toggleTimeWarping() {
	gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled;
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
//#endregion

//#region UI methods
function toggleLightDarkMode() {
	document.body.classList[document.body.classList.contains("dark") ? "remove" : "add"]("dark");
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
	row.querySelector(".name").textContent = name;
	row.querySelector(".tooltipText").textContent = tooltips[name];
	/* TODO: uncomment once data is restructured
	for (let data of [
		jobBaseData,
		skillBaseData,
		projectBaseData,
		itemBaseData
	]) {
		if (data[name]) {
			row.querySelector(".tooltipText").textContent = data[name].tooltip;
		}
	}
	*/
	row.id = "row " + name;
	if (categoryType != itemCategories) {
		row.querySelector(".progress-bar").onclick = () => setActiveTask(name);
	} else {
		row.querySelector(".button").onclick =
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
	updateProgressBar(progressBar.querySelector(".progress-bar-fill"), currentTask.xp, currentTask.getMaxXp());
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
	let requiredRows = document.getElementsByClassName("requiredRow");
	for (let requiredRow of requiredRows) {
		let nextEntity = null;
		let category = categoryType[requiredRow.id]; //requiredRow.id is simple the category name. For items, it's either the array Property or Misc
		if (category == null) {
			continue;
		}

		// Once we have the array of items, skills or jobs through the category variable, we iterate through each item within the array
		// with the goal of finding the next entity within the array that has not met it's requirements.
		// So this for loop is responsible for choosing the row we use as the required row, and is a good target for changing the logic of
		// required row display.
		if (categoryType.Misc == undefined) {
			for (let i = 0; i < category.length; i++) {
				let entityName = category[i]; //first we grab the name, like "Beggar" or "Rag Clothing"
				if (i >= category.length - 1) break;
				let requirements = gameData.requirements[entityName]; //grab any requirements
				if (requirements && i == 0) {
					//if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
					if (!requirements.isCompleted()) {
						nextEntity = data[entityName];
						break;
					}
				}

				let nextIndex = i + 1;
				if (nextIndex >= category.length) {
					break;
				}
				let nextEntityName = category[nextIndex];
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
			for (let i = 0; i < category.length; i++) {
				let entityName = category[i]; //first we grab the name, like "Beggar" or "Rag Clothing"
				if (i >= category.length - 1) break;
				let requirements = gameData.requirements[entityName]; //grab any requirements
				if (requirements && i == 0) {
					//if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
					if (!requirements.isCompleted()) {
						nextEntity = data[entityName];
						break;
					}
				}

				let nextIndex = i + 1;
				if (nextIndex >= category.length) {
					break;
				}
				let nextEntityName = category[nextIndex];
				nextEntityRequirements = gameData.requirements[nextEntityName];

				if (!nextEntityRequirements.isCompleted()) {
					nextEntity = data[nextEntityName];
					break;
				}
			}
		}

		//If we didn't find an object within the array that has requirements left to fulfill, we don't display any
		//required row. We do this by setting the required row class to .hidden so it doesn't display.
		if (nextEntity == null) {
			requiredRow.classList.add("hidden");

			//Otherwise, we do have an object to display a required row for. This following code is the code
			//that decides what exactly gets displayed into the requiredRow template.
		} else {
			requiredRow.classList.remove("hidden");
			let requirementObject = gameData.requirements[nextEntity.name]; //grab the containing requirement object, like TaskRequirement or CoinRequirement
			let requirements = requirementObject.requirements; //get the inner object, like {task: Concentration, requirement: 85}

			//grab references to <span> elements within the template
			let coinElement = requiredRow.querySelector(".coins");
			let levelElement = requiredRow.querySelector(".levels");
			let evilElement = requiredRow.querySelector(".evil");

			//start by setting all spans to hidden
			coinElement.classList.add("hidden");
			levelElement.classList.add("hidden");
			evilElement.classList.add("hidden");

			let finalText = [];
			if (data == gameData.taskData) {
				//display logic for a Job or Skill required row
				if (requirementObject instanceof EvilRequirement) {
					evilElement.classList.remove("hidden");
					evilElement.textContent = formatNumberWithSuffix(requirements[0].requirement) + " evil";
				} else {
					levelElement.classList.remove("hidden");

					//for each mini-object, like {task: Concentration, requirement: 10} inside the containing object like TaskRequirement
					for (let requirement of requirements) {
						let task = gameData.taskData[requirement.task];
						if (requirementObject.satisfies(requirement)) continue;
						finalText.push(`${requirement.task} level ${task.level}/${formatNumberWithSuffix(requirement.requirement)}`);
					}
					levelElement.textContent = finalText.join(', ');
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
					coinElement.classList.remove("hidden");
					levelElement.classList.remove("hidden");
					formatCoins(requirements[0].requirement, coinElement);
				} else if (requirementObject instanceof TaskRequirement) {
					levelElement.classList.remove("hidden");
					for (let requirement of requirements) {
						let task = gameData.taskData[requirement.task];
						//why not just use the already-built requirement.isCompleted check?
						if (task.level >= requirement.requirement) continue;
						let text =
							" " +
							requirement.task +
							" level " +
							formatNumberWithSuffix(task.level) +
							"/" +
							formatNumberWithSuffix(requirement.requirement) +
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

function updateProgressBar(element, value, max) {
	element.style.width = (value / max) * 100 + "%";
}

function updateTaskRows() {
	let row, maxLevel, progressFill, valueElement;
	Object.values(gameData.taskData).forEach(task => {
		row = document.getElementById("row " + task.name);
		row.querySelector(".level").textContent = task.level;
		row.querySelector(".xpGain").textContent = formatNumberWithSuffix(task.getXpGain());
		row.querySelector(".xpLeft").textContent = formatNumberWithSuffix(task.getXpLeft());

		maxLevel = row.querySelector(".maxLevel");
		maxLevel.textContent = task.maxLevel;
		maxLevel.classList[gameData.rebirthOneCount > 0 ? "remove" : "add"]("hidden");

		progressFill = row.querySelector(".progress-bar-fill");
		updateProgressBar(progressFill, task.xp, task.getMaxXp());
		progressFill.classList[task == gameData.currentJob || task == gameData.currentSkill ? "add" : "remove"]("current");

		valueElement = row.querySelector(".value");
		valueElement.querySelector(".income").style.display = task instanceof Job;
		valueElement.querySelector(".effect").style.display = task instanceof Skill;

		row.querySelector(".skip-skill").style.display = task instanceof Skill && autoLearnElement.checked ? "block" : "none";

		if (task instanceof Job) {
			formatCoins(task.getIncome(), valueElement.querySelector(".income"));
		} else {
			valueElement.querySelector(".effect").textContent = task.getEffectDescription();
		}
	});
}

function updateItemRows() {
	let row, active, color;
	Object.values(gameData.itemData).forEach(item => {
		row = document.getElementById("row " + item.name);
		active = row.querySelector(".active");
		color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"];
		active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white";
		row.querySelector(".effect").textContent = item.getEffectDescription();
		formatCoins(item.getExpense(), row.querySelector(".expense"));	
	});
}

function updateHeaderRows(categories) {
	for (categoryName in categories) {
		let className = removeSpaces(categoryName);
		let headerRow = document.querySelector("." + className);
		let maxLevelElement = headerRow.querySelector(".maxLevel");
		maxLevelElement.classList[gameData.rebirthOneCount > 0 ? "remove" : "add"]("hidden");
		let skipSkillElement = headerRow.querySelector(".skip-skill");
		skipSkillElement.style.display =
			categories == skillCategories && autoLearnElement.checked
				? "block"
				: "none";
	}
}

function updateText() {
	//Sidebar
	document.getElementById("ageDisplay").textContent = daysToYears(gameData.days);
	document.getElementById("dayDisplay").textContent = getDayInYear();
	document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan());
	document.getElementById("pauseButton").textContent = gameData.isPaused ? "Play" : "Pause";

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
		let woodenHutButton = document.getElementById("Wooden Hut");
		woodenHutButton.children[0].innerHTML = townBaseData["Wooden Hut"].count;

		let farmButton = document.getElementById("Farm");
		farmButton.children[0].innerHTML = townBaseData["Farm"].count;

		let grainShedButton = document.getElementById("Grain Shed");
		grainShedButton.children[0].innerHTML = townBaseData["Grain Shed"].count;
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

function hideEntities() {
	let requirement, action;
	for (let key in gameData.requirements) {
		requirement = gameData.requirements[key];
		action = requirement.isCompleted() ? "remove" : "add";
		for (let element of requirement.elements) {
			element.classList[action]("hidden");
		}
	}
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
		text = formatNumberWithSuffix(String(x)) + tier + " ";
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

function autoFormatCoins() {
	document.querySelectorAll('[data-auto-format]').forEach(element => formatCoins(element.dataset.autoFormat, element));
}

function showDeathText(show) {
	document.getElementById("deathText").classList[show ? "remove" : "add"]("hidden");
}
//#endregion

//#region life events
function rebirthOne() {
	gameData.rebirthOneCount += 1;

	rebirthReset();
}

function rebirthTwo() {

	gameData.rebirthTwoCount += 1;
	gameData.evil += getEvilGain();

	rebirthReset();

	Object.values(gameData.taskData).forEach(task => task.maxLevel = 0);

	destroyTownWhileEmbracingEvil();
}

function rebirthReset() {
	switchSelectedTab(jobTabButton, "jobs");
	showDeathText(false);

	gameData.coins = 0;
	gameData.days = yearsToDays(14);
	gameData.currentJob = gameData.taskData["Beggar"];
	gameData.currentSkill = gameData.taskData["Concentration"];
	gameData.currentProperty = gameData.itemData["Homeless"];
	gameData.currentMisc = [];
	gameData.isDead = false;

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

function die() {
	gameData.days = getLifespan();
	gameData.isDead = true;
	showDeathText(true);
}

function goBankrupt() {
	gameData.coins = 0;
	gameData.currentProperty = gameData.itemData["Homeless"];
	gameData.currentMisc = [];
}

function getLifespan() {
	return baseLifespan * gameData.taskData["Immortality"].getEffect() * gameData.taskData["Super immortality"].getEffect();
}

function isAlive() {
	if (gameData.days < getLifespan()) {
		return true;
	}
	die();
	return false;
}
//#endregion

//#region frame update methods
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
	if (gameData.isPaused) {
		updateUI();
		return;
	}

	increaseDays();
	autoPromote();
	autoLearn();
	doCurrentTask(gameData.currentJob);
	doCurrentTask(gameData.currentSkill);
	applyExpenses();
	updateUI();
}
//#endregion

//#region init methods
function registerEventListeners() {
	let woodenHutButton = document.getElementById("Wooden Hut");
	woodenHutButton.addEventListener("click", e => townBaseData["Wooden Hut"].handleClick(e));
	woodenHutButton.addEventListener("mouseenter", updateTooltip);

	let farmButton = document.getElementById("Farm");
	farmButton.addEventListener("click", e => townBaseData["Farm"].handleClick(e));
	farmButton.addEventListener("mouseenter", updateTooltip);

	let grainShedButton = document.getElementById("Grain Shed");
	grainShedButton.addEventListener("click", e => townBaseData["Grain Shed"].handleClick(e));
	grainShedButton.addEventListener("mouseenter", updateTooltip);
}

// ok, def not a SIMPLE method
// TODO: this is a mess. Instead, let's assign tags to the final recipients, then tell a multiplier what it's fishing for, then fetch all recipients by a tag and make the multiplier apply itself to the tagged recipients
function addTaskMultipliers(data = gameData.taskData) {
	Object.values(data).forEach(task => {

		task.xpMultipliers = [
			task.getMaxLevelMultiplier.bind(task),
			getHappiness,
			getBoundTaskEffect("Dark influence"),
			getBoundTaskEffect("Demon training")
		];

		if (task instanceof Job) {
			task.incomeMultipliers = [
				task.getLevelMultiplier.bind(task),
				getBoundTaskEffect("Demon's wealth")
			];
			task.xpMultipliers.push(
				getBoundTaskEffect("Productivity"),
				getBoundItemEffect("Personal squire")
			);
		} else if (task instanceof Skill) {
			task.xpMultipliers.push(
				getBoundTaskEffect("Concentration"),
				getBoundItemEffect("Rag Clothing"),
				getBoundItemEffect("Book"),
				getBoundItemEffect("Study desk"),
				getBoundItemEffect("Library")
			);
		}

		if (jobCategories["Military"].includes(task.name)) {
			task.incomeMultipliers.push(
				getBoundTaskEffect("Strength")
			);
			task.xpMultipliers.push(
				getBoundTaskEffect("Battle tactics"),
				getBoundItemEffect("Steel longsword")
		);
		} else if (jobCategories["The Order of Discovery"].includes(task.name)) {
			task.xpMultipliers.push(
				getBoundTaskEffect("Novel Knowledge"),
				getBoundTaskEffect("Unusual Insight")
			);
		} else if (task.name == "Farmer") {
			//trying to make hand tools increase farmer income
			task.incomeMultipliers.push(
				getBoundItemEffect("Basic Farm Tools"),
				getBoundItemEffect("Small Field"),
				getBoundItemEffect("Ox-driven Plow"),
				getBoundItemEffect("Livestock-derived Fertilizer")
			);
			task.xpMultipliers.push(
				getBoundItemEffect("Small Field"),
				getBoundItemEffect("Ox-driven Plow")
			);
		} else if (task.name == "Fisherman") {
			// Fishing rod boosts both income and fishing xp (bigger fish baby!)
			task.incomeMultipliers.push(
				getBoundItemEffect("Cheap Fishing Rod")
			);
			task.xpMultipliers.push(
				getBoundItemEffect("Cheap Fishing Rod")
			);
		} else if (task.name == "Miner") {
			//lantern boosts income and miner xp by 1.5x
			task.incomeMultipliers.push(
				getBoundItemEffect("Miner's Lantern")
			);
			task.xpMultipliers.push(
				getBoundItemEffect("Miner's Lantern")
			);
		} else if (task.name == "Blacksmith") {
			//crappy anvil boosts income and xp of blacksmith by 1.5x
			task.incomeMultipliers.push(
				getBoundItemEffect("Crappy Anvil"),
				getBoundItemEffect("Breech Bellows")
			);
			task.xpMultipliers.push(
				getBoundItemEffect("Crappy Anvil"),
				getBoundItemEffect("Breech Bellows")
			);
		} else if (task.name == "Merchant") {
			task.incomeMultipliers.push(
				getBoundItemEffect("Pack Horse"),
				getBoundTaskEffect("Trade Psychology"),
				getBoundItemEffect("Small Shop"),
				getBoundItemEffect("Weapon Outlet")
			);
			task.xpMultipliers.push(
				getBoundItemEffect("Pack Horse"),
				getBoundItemEffect("Small Shop"),
				getBoundItemEffect("Weapon Outlet")
			);
		} else if (task.name == "Chairman") {
			task.incomeMultipliers.push(
				getBoundTaskEffect("Magical Engineering")
			);
			task.xpMultipliers.push(
				getBoundTaskEffect("Magical Engineering"),
				getBoundTaskEffect("Scales Of Thought"),
				getBoundTaskEffect("Magical Biology")
			);
		} else if (task.name == "Illustrious Chairman") {
			task.incomeMultipliers.push(
				getBoundTaskEffect("Magical Engineering")
			);
			task.xpMultipliers.push(
				getBoundTaskEffect("Magical Engineering"),
				getBoundTaskEffect("Scales Of Thought"),
				getBoundTaskEffect("Magical Biology")
			);
		} else if (task.name == "Strength") {
			task.xpMultipliers.push(
				getBoundTaskEffect("Muscle memory"),
				getBoundItemEffect("Dumbbells")
			);
		} else if (skillCategories["Magic"].includes(task.name)) {
			task.xpMultipliers.push(
				getBoundItemEffect("Sapphire charm"),
				getBoundTaskEffect("Novel Knowledge"),
				getBoundTaskEffect("Unusual Insight"),
				getBoundTaskEffect("Scales Of Thought")
			);
		} else if (skillCategories["Dark magic"].includes(task.name)) {
			task.xpMultipliers.push(
				getEvil
			);
		}
		if (jobCategories["The Arcane Association"].includes(task.name)) {
			task.xpMultipliers.push(
				getBoundTaskEffect("Mana control"),
				getBoundTaskEffect("Novel Knowledge"),
				getBoundTaskEffect("Unusual Insight")
			);
		}
		if (jobCategories["Nobility"].includes(task.name)) {
			//todo
		}
	});
}

function initCustomEffects(taskData) {
	let bargaining = taskData["Bargaining"];
	bargaining.getEffect = () => Math.max(0.1, 1 - getBaseLog(7, bargaining.level + 1) / 10);

	let intimidation = taskData["Intimidation"];
	intimidation.getEffect = () => Math.max(0.1, 1 - getBaseLog(7, intimidation.level + 1) / 10);

	//          ***    HISTORICAL NOTES    ***
	// All gamespeed modifying effects are currently combined into this single Time warping multiplier
	// for simplicity's sake. As of this writing, the two relevant skills are Time warping and Flow.
	// As of June 23rd 2021, gameSpeed effects are broken out into their respective effects and functions
	// to increase clarity for players. The old method of combining effects into Time Warping caused Flow
	// to change the Time Warping skill description, which led to confusion.

	// This re-defined getEffect() function is called in the getGameSpeed() function.

	let timeWarping = taskData["Time warping"];
	timeWarping.getEffect = () => 1 + getBaseLog(13, timeWarping.level + 1);

	let flow = taskData["Flow"];
	flow.getEffect = () => 1 + getBaseLog(100, flow.level + 1) / 1.3;

	let immortality = taskData["Immortality"];
	immortality.getEffect = () => 1 + getBaseLog(33, immortality.level + 1);
}

function addItemMultipliers(data = gameData.itemData) {
	Object.values(data).forEach(item => item.expenseMultipliers = [getBoundTaskEffect("Bargaining"), getBoundTaskEffect("Intimidation")]);
}

function createUI() {
	// create UI
	createAllRows(jobCategories, "jobTable");
	createAllRows(skillCategories, "skillTable");
	createAllRows(itemCategories, "itemTable");
}

function initializeUI() {
	// this only handles tooltip (mouseEnter) and purchase (click) methods for town buildings
	registerEventListeners();

	// initialize UI
	switchSelectedTab(jobTabButton, "jobs");
	showDeathText(gameData.isDead);
	autoFormatCoins();
}

document.addEventListener("DOMContentLoaded", () => {

	createUI();
	initializeGameState(gameData);
	initializeUI();

	// start game loops
	update();
	setInterval(update, 1000 / updateSpeed);
	setInterval(() => saveStateToLocalStorage(getFullGameState(gameData)), 6000);
	setInterval(setSkillWithLowestMaxXp, 1000);
});
//#endregion

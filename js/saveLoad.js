// TODO: remove and update the data when interacting with the elements themselves rather than doing it here on game save
function saveSkipSkillsAndDarkMode() {
	gameData.autoPromote = autoPromoteElement.checked;
	gameData.autoLearn = autoLearnElement.checked;
	gameData.skippedSkills = [];

	for (let skillName in gameData.taskData) {
		if (document.getElementById("row " + skillName).querySelector(".checkbox").checked) {
			gameData.skippedSkills.push(skillName);
		}
	}

	gameData.darkMode = document
		.getElementById("body")
		.classList.contains("dark");
}

function loadSkipSkillsAndDarkMode() {
	autoPromoteElement.checked = gameData.autoPromote;
	autoLearnElement.checked = gameData.autoLearn;

	for (let i = 0; i < gameData.skippedSkills.length; i++) {
		document.getElementById("row " + gameData.skippedSkills[i]).querySelector(".checkbox").checked = true;
	}

	if (!gameData.darkMode) toggleLightDarkMode();
}

function saveGameData() {
	saveSkipSkillsAndDarkMode();
	saveTownState();
	localStorage.setItem("gameDataSave", JSON.stringify(gameData));
}

function loadGameData() {
	let gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"));

	if (gameDataSave !== null) {
		let data = applyVersionMigrationsToData(gameDataSave);
		if (data == null) {
			console.error("Error loading game data");
			return;
		}

		gameData = data;
		loadSkipSkillsAndDarkMode();
	}

	loadTownState(gameData.townData);
	gameData.rawTownIncome = updateRawTownIncome();
	assignMethods();
}

function resetGameData() {
	//author: theSpuu
	let result = confirm("Are you sure you want to erase all game progress? This cannot be undone.");
	if (result) {
		localStorage.clear();
		location.reload();
	}
}

function importGameData() {
	let importExportBox = document.getElementById("importExportBox");
	let data = JSON.parse(window.atob(importExportBox.value));
	gameData = data;
	saveGameData();
	location.reload();
}

function exportGameData() {
	document.getElementById("importExportBox").value = window.btoa(JSON.stringify(gameData));
}

function loadGameDataFromFile() {
	let input = document.getElementById("uploadSaveInput");
	if (input.files.length === 0) {
		alert("No file selected. Please select a file to upload");
		return;
	}
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function () {
		let data = JSON.parse(window.atob(reader.result));
		gameData = data;
		saveGameData();
		location.reload();
	};
}

function downloadGameData() {
	let filename = "progressKnightReborn.sav";
	let data = window.btoa(JSON.stringify(gameData));
	let file = new Blob([data], { type: "text/plain" });

	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else {
		let saveFile = document.createElement("a");
		saveFile.download = filename;
		saveFile.href = URL.createObjectURL(file);
		saveFile.click();
		URL.revokeObjectURL(saveFile.href);
	}
}

//#region game state initialization methods
function createData(baseData) {
	return Object.values(baseData).reduce((obj, entity) =>
		Object.assign(
			obj,
			{ [entity.name]: createEntity(entity) }
		),
		{}
	);
}

function createEntity(entity) {
	let data;
	if ("income" in entity) {
		data = new Job(entity);
	} else if ("maxXp" in entity) {
		data = new Skill(entity);
	} else {
		data = new Item(entity);
	}
	data.id = "row " + entity.name;
	return data;
}

function createItemData(baseData) {
	for (let item of baseData) {
		gameData.itemData[item.name] = new ("happiness" in item ? Property : Misc)(task);
		gameData.itemData[item.name].id = "item " + item.name;
	}
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
//#endregion

// TODO: implement saving, loading and integrity checks
// currently unused
function getGameStateSnapshot() {
	return {
		taskData: getBasicTaskData(),
		townData: getBasicTownData(),
		coins: gameData.coins,
		days: gameData.days,
		evil: gameData.evil,
		paused: gameData.paused,
		timeWarpingEnabled: gameData.timeWarpingEnabled,
		rebirthOneCount: gameData.rebirthOneCount,
		rebirthTwoCount: gameData.rebirthTwoCount,
		currentJob: gameData.currentJob.name,
		currentSkill: gameData.currentSkill.name,
		currentProperty: gameData.currentProperty.name,
		currentMisc: gameData.currentMisc.map(misc => misc.name),
		requirements: getBasicRequirementsData(),
		totalCitizens: gameData.totalCitizens,
		assignedCitizens: gameData.assignedCitizens,
		idleCitizens: gameData.idleCitizens,
		autoPromote: gameData.autoPromote,
		autoLearn: gameData.autoLearn,
		// TODO: this can be derived if we just store the data in the skill itself, which would likely be preferred over keeping it in different places
		skippedSkills: gameData.skippedSkills,
		darkMode: gameData.darkMode,
		version: gameData.version
	}
}

function getBasicTaskData() {
	let jobs = Object.values(jobCategories).map(categoryEntries => 
		categoryEntries.map(getBasicJobData)
	);
	let skills = Object.values(skillCategories).map(categoryEntries => 
		categoryEntries.map(getBasicSkillData)
	);
	return Object.assign(...jobs, ...skills);
}

function getBasicTownData() {
	let town = Object.keys(gameData.townData).map(getBasicBuildingData);
	return Object.assign(...town);
}

function getBasicBuildingData(buildingKey) {
	return {
		[buildingKey]: {
			count: gameData.townData[buildingKey].count
		}
	}
}

function getBasicJobData(jobKey) {
	return {
		[jobKey]: {
			level: gameData.taskData[jobKey].level,
			maxLevel: gameData.taskData[jobKey].maxLevel,
			xp: gameData.taskData[jobKey].xp
		}
	}
}

function getBasicSkillData(skillKey) {
	return {
		[skillKey]: {
			level: gameData.taskData[skillKey].level,
			maxLevel: gameData.taskData[skillKey].maxLevel,
			xp: gameData.taskData[skillKey].xp
		}
	}
}

function getBasicMiscData() {
	return gameData.currentMisc.map(misc => misc.name);
}

function getBasicRequirementsData() {
	let requirements = Object.entries(gameData.requirements).map(([requirementKey, requirement]) => {
		return {
			[requirementKey]: {
				completed: requirement.completed
			}
		}
	});
	return Object.assign(...requirements);
}

function createGameStateFromSnapshot(snapshot) {
	let numberStates = {
		coins: Number(snapshot.coins),
		days: Number(snapshot.days),
		evil: Number(snapshot.evil),
		timeWarpingEnabled: snapshot.timeWarpingEnabled,
		rebirthOneCount: Number(snapshot.rebirthOneCount),
		rebirthTwoCount: Number(snapshot.rebirthTwoCount),
		totalCitizens: Number(snapshot.totalCitizens),
		assignedCitizens: Number(snapshot.assignedCitizens),
		idleCitizens: Number(snapshot.idleCitizens),
	}
	let boolStates = {
		paused: Boolean(snapshot.paused),
		autoPromote: Boolean(snapshot.autoPromote),
		darkMode: Boolean(snapshot.darkMode),
		autoLearn: Boolean(snapshot.autoLearn),
		// TODO: this can be derived if we just store the data in the skill itself, which would likely be preferred over keeping it in different places
		skippedSkills: snapshot.skippedSkills.slice(),
	}
	// Pass 1: create the objects
	let objectStates = {
		taskData: createTasks(snapshot.taskData),
		itemData: createItems(),
		townData: createTownBuildings(snapshot.townData),
		// in the current data structure requirements are created at the same time as they pull data from referenced tasks
		// requirements: createRequirements(),
	}
	// Pass 2: bind reference values
	objectStates = {
		taskData: bindTaskReferences(objectStates),
		itemData: bindItemReferences(objectStates),
		// in the current data structure nothing is referenced by a building as stored inside gameData.townData
		// townData: bindTownBuildingReferences(objectStates),
		// this also CREATES requirements, for now...
		requirements: bindRequirementReferences(objectStates),
	}
	
	let currentReferences = {
		currentJob: getTaskByName(snapshot.currentJob, objectStates.taskData),
		currentSkill: getTaskByName(snapshot.currentSkill, objectStates.taskData),
		currentMisc: snapshot.currentMisc.map(misc => getMiscByName(misc, objectStates.itemData)),
		currentProperty: getMiscByName(snapshot.currentProperty, objectStates.itemData),
	}

	return Object.assign(
		{
			version: snapshot.version,
			rawTownIncome: updateRawTownIncome()
		},
		numberStates,
		boolStates,
		objectStates,
		currentReferences
	);
}

function createTasks(taskData) {
	return createData(taskData);
}

function createItems() {
	return createData(itemBaseData);
}

function createTownBuildings(townData) {
	// TODO: temporary
	loadTownState(townData);
	return townData;
}

function bindTaskReferences(objects) {
	// TODO: temporarily calls old methods
	initCustomEffects(objects.taskData);
	addTaskMultipliers(objects.taskData);
	// for (let task of objects.taskData) {
		// 	// bind xp and income multipliers
	// }
	return objects.taskData;
}

function bindItemReferences(objects) {
	// TODO: temporarily calls old methods
	addItemMultipliers(objects.itemData);
	// for (let item of objects.taskData) {
	// 	// bind xp multipliers
	// }
	return objects.itemData;
}

function bindRequirementReferences(objects) {
	// TODO: this is temporary
	let requirements = initializeRequirements(objects);
	for (let requirement in objects.requirements) {
		requirements[requirement].completed = objects.requirements[requirement].completed;
	}
	return requirements;
}

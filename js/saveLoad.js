const STATE_SAVE_KEY = "gameDataSave";

function createInitialGameState(data) {
	
	data.taskData = {};
	Object.assign(data.taskData, createData(jobBaseData));
	Object.assign(data.taskData, createData(skillBaseData));
	data.itemData = {};
	Object.assign(data.itemData, createData(itemBaseData));

	data.currentJob = data.taskData["Beggar"];
	data.currentSkill = data.taskData["Concentration"];
	data.currentProperty = data.itemData["Homeless"];
	data.currentMisc = [];
	
	data.requirements = initializeRequirements(data);
	
	return data;
}

function bindGameStateMethods(data) {
	addTaskMultipliers(data.taskData);
	initCustomEffects(data.taskData);
	addItemMultipliers(data.itemData);
}

// TODO: this is still pretty bad, but at least now we can load without refreshing... I think
function initializeGameState(stateData) {
	
	gameData = createInitialGameState(stateData);
	gameData = loadStateFromLocalStorage(gameData);
	bindGameStateMethods(gameData);
}

// TODO: remove and update the data when interacting with the elements themselves rather than doing it here on game save
function saveSkipSkillsAndDarkMode(data) {
	data.autoPromote = autoPromoteElement.checked;
	data.autoLearn = autoLearnElement.checked;
	data.skippedSkills = [];

	for (let skillName in data.taskData) {
		if (document.getElementById("row " + skillName).querySelector(".checkbox").checked) {
			data.skippedSkills.push(skillName);
		}
	}

	data.darkMode = document
		.getElementById("body")
		.classList.contains("dark");
	
	return data;
}

function loadSkipSkillsAndDarkMode(data) {
	autoPromoteElement.checked = data.autoPromote;
	autoLearnElement.checked = data.autoLearn;

	for (let i = 0; i < data.skippedSkills.length; i++) {
		document.getElementById("row " + data.skippedSkills[i]).querySelector(".checkbox").checked = true;
	}

	if (!data.darkMode && document.getElementById("body").classList.contains("dark")) toggleLightDarkMode();

	return data;
}

// TODO: will be replaced by gameStateToSnapshot() when ready
function getFullGameState(data) {
	saveSkipSkillsAndDarkMode(data);
	saveTownState(data);
	return data;
}

function saveStateToLocalStorage(gameState) {
	try {
		new Serializable(gameState).toJSON().toLocalStorage(STATE_SAVE_KEY)
		ifVerboseLoggingSay("Game data saved to local storage", gameState);
	} catch (error) {
		console.error(error);
		console.error("Error saving game data to local storage");
	}
}

function loadStateFromLocalStorage(state) {
	let gameDataSave = Serializable.fromLocalStorage(STATE_SAVE_KEY).fromJSON().data;

	if (gameDataSave !== null) {
		let data = applyVersionMigrationsToData(gameDataSave);
		if (data == null) {
			console.error("Error loading game data");
			return;
		}
		
		loadSkipSkillsAndDarkMode(data);
		state = data;
	}

	loadTownState(state.townData);
	state.rawTownIncome = calculateRawTownIncome();
	assignMethods(state);

	return state;
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
	let data = document.getElementById("importExportBox").value;

	if (data === '') {
		ifVerboseLoggingSay("No data found in import box");
		return;
	}
	data = new Serializable(data).fromBase64().fromJSON().data;
	
	saveStateToLocalStorage(data);
	initializeGameState(data);
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
		saveStateToLocalStorage(gameData);
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

function assignMethods(data) {
	// TODO: switch job/skill/item by type, not by income field or data array
	Object.entries(data.taskData).forEach(([taskKey, task]) => {
		if (task.baseData.income) {
			data.taskData[taskKey] = Object.assign(new Job(jobBaseData[task.name]), task, { baseData: jobBaseData[task.name] });
		} else {
			data.taskData[taskKey] = Object.assign(new Skill(skillBaseData[task.name]), task, { baseData: skillBaseData[task.name] });
		}
	})

	Object.entries(data.itemData).forEach(([itemKey, item]) => {
		data.itemData[itemKey] = Object.assign(new Item(itemBaseData[item.name]), item, { baseData: itemBaseData[item.name] });
	});

	const REQUIREMENT_CLASS = {
		task: TaskRequirement,
		coins: CoinRequirement,
		age: AgeRequirement,
		evil: EvilRequirement
	}

	for (let key in data.requirements) {
		let requirement = data.requirements[key];
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
		data.requirements[key] = requirement;
	}

	data.currentJob = data.taskData[data.currentJob.name];
	data.currentSkill = data.taskData[data.currentSkill.name];
	data.currentProperty = data.itemData[data.currentProperty.name];
	data.currentMisc = data.currentMisc.map(misc => data.itemData[misc.name]);

	return data;
}
//#endregion

// TODO: implement saving, loading and integrity checks
// currently unused
function gameStateToSnapshot() {
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

function snapshotToGameState(snapshot) {
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
			rawTownIncome: calculateRawTownIncome()
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

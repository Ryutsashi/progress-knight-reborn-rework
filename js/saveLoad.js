// TODO: remove and update the data when interacting with the elements themselves rather than doing it here on game save
function saveSkipSkillsAndDarkMode() {
	gameData.autoPromote = autoPromoteElement.checked;
	gameData.autoLearn = autoLearnElement.checked;
	gameData.skippedSkills = [];

	for (skillName in gameData.taskData) {
		if (
			document
				.getElementById("row " + skillName)
				.getElementsByClassName("checkbox")[0].checked
		) {
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

	for (var x = 0; x < gameData.skippedSkills.length; x++) {
		document
			.getElementById("row " + gameData.skippedSkills[x])
			.getElementsByClassName("checkbox")[0].checked = true;
	}

	if (!gameData.darkMode) toggleLightDarkMode();
}

function saveGameData() {
	saveSkipSkillsAndDarkMode();
	saveTownState();
	localStorage.setItem("gameDataSave", JSON.stringify(gameData));
}

function loadGameData() {
	var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"));

	if (gameDataSave !== null) {
		let data = applyVersionMigrationsToData(gameDataSave);
		if (data == null) {
			console.error("Error loading game data");
			return;
		}
		// replaceSaveDict(gameData, data);
		// replaceSaveDict(gameData.requirements, data.requirements);
		// replaceSaveDict(gameData.taskData, data.taskData);
		// replaceSaveDict(gameData.itemData, data.itemData);
		//replaceSaveDict(gameData.townData, data.townData);

		gameData = data;
		loadSkipSkillsAndDarkMode();
	}

	loadTownState();
	gameData.rawTownIncome = updateRawTownIncome();
	assignMethods();
}

function resetGameData() {
	//author: theSpuu
	var result = confirm("Are you sure you want to erase all game progress? This cannot be undone.");
	if (result) {
		localStorage.clear();
		location.reload();
	}
}

function importGameData() {
	var importExportBox = document.getElementById("importExportBox");
	var data = JSON.parse(window.atob(importExportBox.value));
	gameData = data;
	saveGameData();
	location.reload();
}

function exportGameData() {
	var importExportBox = document.getElementById("importExportBox");
	importExportBox.value = window.btoa(JSON.stringify(gameData));
}

function loadGameDataFromFile() {
	var input = document.getElementById("uploadSaveInput");
	if (input.files.length === 0) {
		alert("No file selected. Please select a file to upload");
		return;
	}
	var file = input.files[0];
	var reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function () {
		var data = JSON.parse(window.atob(reader.result));
		gameData = data;
		saveGameData();
		location.reload();
	};
}

function downloadGameData() {
	var filename = "progressKnightReborn.sav";
	var data = window.btoa(JSON.stringify(gameData));
	var file = new Blob([data], { type: "text/plain" });

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
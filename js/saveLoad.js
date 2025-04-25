// TODO: remove and update the data when interacting with the elements themselves rather than doing it here on game save
function saveSkipSkillsAndDarkMode() {
	gameData.autoPromote = autoPromoteElement.checked;
	gameData.autoLearn = autoLearnElement.checked;
	gameData.skippedSkills = [];

	for (let skillName in gameData.taskData) {
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

	for (let x = 0; x < gameData.skippedSkills.length; x++) {
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

	loadTownState();
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
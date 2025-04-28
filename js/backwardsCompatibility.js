/**
 * Converts a version number into an integer
 * @param {string} version - eg. 1.23.4567 or undefined
 * @returns {number} (1 * 10e9) + (23 * 10e6) + 4567 -> 1,023,004,567
 */
function parseVersionNumber(version) {
	let result = (version == undefined ? "0.0.0" : version).split(".");
	return result[0] * 1000000000 + result[1] * 1000000 + result[2];
}

/**
 * Compares the current version with the version of the loaded save file.
 *
 * If the result is positive, the game is older than the save.
 * If the result is negative, the game is newer than the save.
 * If the result is zero, the game and the save are the same version.
 *
 * @param {string} currentVersion
 * @param {string} fileVersion
 * @returns {number} The difference between the versions.
 */
function loadedVersionDiffDirection(currentVersion, fileVersion) {
	return Math.sign(
		parseVersionNumber(fileVersion) -
			parseVersionNumber(currentVersion)
	);
}

function updateVersionNumber(data, newVersion) {
	data.version = newVersion;
}

function applyVersionMigrationsToData(saveData) {
	if (loadedVersionDiffDirection(gameData.version, saveData.version) > 0) {
		return;
	}
	else if (loadedVersionDiffDirection(gameData.version, saveData.version) == 0) {
		return saveData;
	}
	let saveDataClone = structuredClone(saveData);
	let parsedSaveVersion = parseVersionNumber(saveDataClone.version);
	let startVersionIndex = migrationsRecord.findIndex(update => parseVersionNumber(update.version) > parsedSaveVersion);
	for (let i = startVersionIndex; i < migrationsRecord.length; i++) {
		try {
			migrationsRecord[i].update(saveDataClone);
			updateVersionNumber(saveDataClone, migrationsRecord[i].version);
		}
		catch (e) {
			console.error(e);
			console.error(`Error updating from ${saveDataClone.version} to ${gameData.version}`);
			return false;
		}
	}
	if (parseVersionNumber(saveDataClone.version) > parseVersionNumber(gameData.version)) {
		console.warn(`Final migrationRecord's version is newer than game version. migrationRecord version: ${saveDataClone.version}, game version: ${gameData.version}. Update game version`);
	}
	else {
		updateVersionNumber(saveDataClone, gameData.version);
	}
	return saveDataClone;
}

const migrationsRecord = [
	{
		version: "0.4.0",
		update: (saveFileData) => {
			// this is the first recorded version, assuming v0.4 was the version I started with, according to CameronGott's unreleased off-main branch
		}
	},
	{
		version: "0.4.1",
		update: (saveFileData) => {
			// just a test update, the version bump in the file itself is handled automatically for each version
		}
	},
	// preparation for 0.4.2
	// {
	// 	version: "0.4.2",
	// 	update: (saveFileData) => {
	// 		return Object.assign(saveFileData, {
	// 			currentJob : saveFileData.currentJob.name,
	// 			currentSkill : saveFileData.currentSkill.name,
	// 			currentMisc : saveFileData.currentMisc.map(misc => misc.name),
	// 		}
	// 	}
	// }
]
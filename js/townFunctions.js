/*
    Contains global functions related to Town features
*/

// Purpose: calculate the amount of money a player makes from their town buildings.
//
// How: iterate through town building container. If 'income' is a property, multiply
//  the income * count and add it to the total income variable. Return the total income
//  variable.
function calculateRawTownIncome() {
	let totalIncome = 0;
	for (let building in townBaseData) {
		//building represents the key, so we use it to get a reference to the actual object
		let o_building = townBaseData[building];
		if ("income" in o_building) {
			/*
			 *   Description: if a building might have its income boosted by other buildings,
			 *   we iterate through all buildings to calculate the total income multiplier from all
			 *   buildings that boost it.
			 *
			 *   We also do a few checks to make sure the properties we rely on are defined.
			 *
			 *   This may become a performance bottleneck with large numbers of buildings
			 *   due to nested for loops and their O(n^2) behavior.
			 */
			if (o_building.name === "Farm") {
				let multiplier = 1.0;
				for (let building2 in townBaseData) {
					let o_building2 = townBaseData[building2];
					if (
						"role" in o_building2 &&
						o_building2.role.includes("Income Boost")
					) {
						if (
							o_building2.targets !== undefined &&
							o_building2.targets.includes("Farm")
						) {
							multiplier *= o_building2.calculateMultiplier();
						}
					}
				}
				totalIncome += o_building.getIncome() * multiplier;
			} else {
				totalIncome += o_building.getIncome();
			}
		}
	}
	return totalIncome;
}

/*
 *   Description: saves select building object properties into a saveObject
 *       and writes that saveObject into gameData.townData. This function is
 *       called right before gameData is saved to localStorage.
 */
function saveTownState(data = gameData) {
	ifVerboseLoggingSay("saving town state...");

	for (let building in townBaseData) {
		ifVerboseLoggingSay("key: ", building);
		let o_building = townBaseData[building];
		ifVerboseLoggingSay("value: ", o_building);
		let saveObject = {
			name: o_building.name,
			count: o_building.count
		};
		if (saveObject !== undefined) {
			ifVerboseLoggingSay("This is the save object we created: ", saveObject);
			data.townData[saveObject.name] = saveObject;
		}
	}
}

function loadTownState(townData) {
	for (let building in townBaseData) {
		townBaseData[building].count = townData[townBaseData[building].name]?.count;
	}
}

function destroyTownWhileEmbracingEvil() {
	//reset values in townBaseData to their base values
	//reset values in gameData.townData, if it is not null, to their base values
	if (gameData.townData) {
		for (let building in townBaseData) {
			let o_building = townBaseData[building];
			if (o_building.name in gameData.townData) {
				let savedBuilding = gameData.townData[o_building.name];
				savedBuilding.count = o_building.count = 0;
			}
		}
		gameData.rawTownIncome = 0;
	}
}

// temporary brute-force function to limit Town income until it is modulated by future feature interaction.
// the kingdom has spoken.
function regulateGrainMarkets() {
	if (gameData.rawTownIncome > 1000000000) {
		//1000 platinum
		gameData.rawTownIncome = 1000000000;
	}
}
setInterval(regulateGrainMarkets, 15000);

//Updates the Town page "Idle Citizens" label with the new number of idle citizens
function updateIdleCitizens() {
	elementToUpdate = document.querySelector("#idleCitizensCounter");
	ifVerboseLoggingSay(
		elementToUpdate,
		`Current number of idle citizens: ${gameData.idleCitizens}\n`,
		`Current number of total citizens: ${gameData.totalCitizens}\n`,
		`Current number of assigned citizens: ${gameData.assignedCitizens}`
	);

	gameData.idleCitizens = gameData.totalCitizens - gameData.assignedCitizens;
	
	ifVerboseLoggingSay(
		`New number of idle citizens: ${gameData.idleCitizens}\n`,
		`New number of total citizens: ${gameData.totalCitizens}\n`,
		`New number of assigned citizens: ${gameData.assignedCitizens}`
	);

	elementToUpdate.textContent = `Idle citizens: ${gameData.idleCitizens}`;
}

function calculateCostOfNextBuilding(building) {
	return building.baseCost * (building.costGrowthFactor ** building.count);
}
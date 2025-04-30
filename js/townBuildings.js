/*
 * Contains object definitions for Town Buildings.
 * Provides container object to allow easy tracking of new buildings
 * and automates some linking of new buildings to game logic.
 */

let o_townBuildingsContainer = {
	o_woodenHut: {
		name: "Wooden Hut",
		id: "woodenHut",
		count: 0,
		get baseCost() { return 100000000001 }, //treat as const.
		costOfNextBuilding: 100000000001,
		costGrowthFactor: 1.01,
		role: ["Housing"],
		citizenCapacity: 2,

		handleClick: function (eventObject) {
			if (gameData.coins < this.costOfNextBuilding) return;

			gameData.coins -= this.costOfNextBuilding;
			this.count++;
			this.costOfNextBuilding = this.costOfNextBuilding*(this.costGrowthFactor**this.count);

			gameData.totalCitizens += this.citizenCapacity;
			updateIdleCitizens();

			updateTooltip(eventObject);
		}
	},

	o_farm: {
		name: "Farm",
		id: "farm",
		count: 0,
		get baseCost() { return 1000000000001 }, //treat as const
		costOfNextBuilding: 1000000000001,
		costGrowthFactor: 1.05,
		role: ["Food", "Income", "Prestige", "Nobility xp"],
		xpMultiplier: 1.1,
		income: 150, //1s 50c

		handleClick: function (eventObject) {
			if (gameData.coins < this.costOfNextBuilding) return;

			
			gameData.coins -= this.costOfNextBuilding;
			this.count++;
			this.costOfNextBuilding = this.costOfNextBuilding*(this.costGrowthFactor**this.count);

			//global function, lives in townFunctions.js
			gameData.rawTownIncome = updateRawTownIncome();
			updateTooltip(eventObject);
		},

		getExperienceMultiplier: function () {
			return this.count * this.xpMultiplier;
		},

		getIncome: function () {
			return this.income * this.count;
		}
	},

	o_grainShed: {
		name: "Grain Shed",
		id: "grainShed",
		count: 0,
		get baseCost() { return 100000000001 }, //treat as const
		costOfNextBuilding: 100000000001,
		costGrowthFactor: 1.07,
		role: ["Food", "Income Boost"],
		targets: ["Farm"],
		incomeMultiplier: 1.06,

		handleClick: function (eventObject) {
			if (gameData.coins < this.costOfNextBuilding) return;

			gameData.coins -= this.costOfNextBuilding;
			this.count++;
			this.costOfNextBuilding = this.costOfNextBuilding*(this.costGrowthFactor**this.count);

			//global function, lives in townFunctions.js
			gameData.rawTownIncome = updateRawTownIncome();
			updateTooltip(eventObject);
		},

		calculateMultiplier: function () {
			return Math.pow(this.incomeMultiplier, this.count);
		}
	}
}; // container

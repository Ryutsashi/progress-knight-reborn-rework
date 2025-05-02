/*
 * Contains object definitions for Town Buildings.
 * Provides container object to allow easy tracking of new buildings
 * and automates some linking of new buildings to game logic.
 */


// TODO: make these into classes (or better, will explain below)
/*
	Since this isn't a class, we have to bind the handleClick methods as they are to the object.
	And since we have to do that, we can't initialize listeners until the origianl methods are replaced with bound methods.
	This is fine on its own, but it leads to more unique code that's hard to make reusable and leads to jumps
	in order of execution when it comes to initialization (construct UI, construct data, load data, initalize state,
	bind methods, bind listeners, etc. it's a bit of a mess). 

	If we make these into classes, the methods are bound by default. THAT SAID, there is a better way that requires
	a bigger rework:

	Jobs, skills, items and properties each have their own way of influencing game state. Game variables that are effected
	are coins, happiness, skill xp, job xp, expenses, levels, etc.
	By coming up with a unified way to define these relationships between these objects and game variables, we can
	likely skip binding methods and instead rely on generic dependency graphs and/or subscriptions to recalculate game
	variables and check requirements whenever any of them change, while allowing for static game data and game state to
	also be also decoupled.

	That would not only help in making everything more consistent and reusable, but would also allow decoupling the UI
	from the game logic further.

	But that would be a HUGE change to game logic.

	Currently, we overwrite snapshot data with game state when loading. I'm working on fixing that, but when I'm done
	the state will still be the same as data. The state will still be responsible for handling both data and some of the
	logic for updating itself.
*/
let townBaseData = {
	"Wooden Hut": {
		name: "Wooden Hut",
		id: "woodenHut",
		count: 0,
		get baseCost() { return 100000000001 },
		get costGrowthFactor() { return 1.01 },
		role: ["Housing"],
		citizenCapacity: 2,

		handleClick: function (eventObject) {
			let costOfNext = calculateCostOfNextBuilding(this);
			
			if (gameData.coins < costOfNext) return;

			gameData.coins -= costOfNext;
			this.count++;

			gameData.totalCitizens += this.citizenCapacity;
			updateIdleCitizens();

			updateTooltip(eventObject);
		}
	},

	"Farm": {
		name: "Farm",
		id: "farm",
		count: 0,
		get baseCost() { return 1000000000001 },
		get costGrowthFactor() { return 1.05 },
		role: ["Food", "Income", "Prestige", "Nobility xp"],
		xpMultiplier: 1.1,
		income: 150, //1s 50c

		handleClick: function (eventObject) {
			let costOfNext = calculateCostOfNextBuilding(this);
			if (gameData.coins < costOfNext) return;

			
			gameData.coins -= costOfNext;
			this.count++;

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

	"Grain Shed": {
		name: "Grain Shed",
		id: "grainShed",
		count: 0,
		get baseCost() { return 100000000001 },
		get costGrowthFactor() { return 1.07 },
		role: ["Food", "Income Boost"],
		targets: ["Farm"],
		incomeMultiplier: 1.06,

		handleClick: function (eventObject) {
			let costOfNext = calculateCostOfNextBuilding(this);
			if (gameData.coins < costOfNext) return;

			gameData.coins -= costOfNext;
			this.count++;

			//global function, lives in townFunctions.js
			gameData.rawTownIncome = updateRawTownIncome();
			updateTooltip(eventObject);
		},

		calculateMultiplier: function () {
			return this.incomeMultiplier**this.count;
		}
	}
}; // container

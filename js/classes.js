/* 

Task is a base class combining core functionality used in jobs and skills.

A task object stores: name, level, max level ever achieved, 
current experience (e.g. experience accumulated inside the current task level),
and an array of experience multipliplying effects from items and skills.

*/
class Task {
	constructor(baseData) {
		this.baseData = baseData;
		this.name = baseData.name;
		this.level = 0;
		this.maxLevel = 0;
		this.xp = 0;

		this.xpMultipliers = [];
	}

	getMaxXp() {
		return Math.round(
			this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level)
		);
	}

	getXpLeft() {
		return Math.round(this.getMaxXp() - this.xp);
	}

	getMaxLevelMultiplier() {
		return 1 + this.maxLevel * .1;
	}

	getXpGain() {
		return applyMultipliers(10, this.xpMultipliers);
	}

	increaseXp() {
		this.xp += applySpeed(this.getXpGain());
		if (this.xp >= this.getMaxXp()) {
			let excess = this.xp - this.getMaxXp();
			while (excess >= 0) {
				this.level += 1;
				excess -= this.getMaxXp();
			}
			this.xp = this.getMaxXp() + excess;
		}
	}
}

class Job extends Task {
	constructor(baseData) {
		super(baseData);
		this.incomeMultipliers = [];
	}

	getLevelMultiplier() {
		return 1 + Math.log10(this.level + 1);
	}

	getIncome() {
		return applyMultipliers(this.baseData.income, this.incomeMultipliers);
	}
}

class Skill extends Task {
	constructor(baseData) {
		super(baseData);
	}

	getEffect() {
		return 1 + this.baseData.effect * this.level;
	}

	getEffectDescription() {
		return "x" + String(this.getEffect().toFixed(2)) + " " + this.baseData.description;
	}
}

class Item {
	constructor(baseData) {
		this.baseData = baseData;
		this.name = baseData.name;
		this.expenseMultipliers = [];
	}

	getEffect() {
		if (gameData.currentProperty == this || gameData.currentMisc.includes(this))
			return this.baseData.effect;
		return 1;
	}

	getEffectDescription() {
		let description = itemCategories["Properties"].includes(this.name) ? "Happiness" : this.baseData.description;
		return "x" + this.baseData.effect.toFixed(1) + " " + description;
	}

	getExpense() {
		return applyMultipliers(this.baseData.expense, this.expenseMultipliers);
	}
}

class Requirement {
	constructor(elements, requirements) {
		this.elements = elements;
		this.requirements = requirements;
		this.completed = false;
	}

	isCompleted() {
		if (this.completed) {
			return true;
		}
		for (let requirement of this.requirements) {
			if (!this.getCondition(requirement)) {
				return false;
			}
		}
		this.completed = true;
		return true;
	}
}

class TaskRequirement extends Requirement {
	constructor(elements, requirements) {
		super(elements, requirements);
		this.type = "task";
	}

	getCondition(requirement) {
		return (
			gameData.taskData[requirement.task].level >= requirement.requirement
		);
	}
}

class CoinRequirement extends Requirement {
	constructor(elements, requirements) {
		super(elements, requirements);
		this.type = "coins";
	}

	getCondition(requirement) {
		return gameData.coins >= requirement.requirement;
	}
}

class AgeRequirement extends Requirement {
	constructor(elements, requirements) {
		super(elements, requirements);
		this.type = "age";
	}

	getCondition(requirement) {
		return gameData.days >= requirement.requirement;
	}
}

class EvilRequirement extends Requirement {
	constructor(elements, requirements) {
		super(elements, requirements);
		this.type = "evil";
	}

	getCondition(requirement) {
		return gameData.evil >= requirement.requirement;
	}
}

const autoLearnElement = document.getElementById("autoLearn");

function checkSkillSkipped(skill) {
	return document.getElementById("row " + skill.name).querySelector(".checkbox").checked;
}

function setSkillWithLowestMaxXp() {
	let enabledSkills = [];
	let skill, requirement;

	for (let skillName in gameData.taskData) {
		skill = gameData.taskData[skillName];
		requirement = gameData.requirements[skillName];
		/*
        Getting an autolearn error, and the dev console says there is an uncaught
        TypeError at this line of code below during the requirement.isCompleted() call. 
        I think the error is saying that when calling requirement.isCompleted, requirement is undefined.
        This would make sense if I have a skill that doesn't have any unlock requirements, which I think
        is true of Novel Knowledge for table rendering reasons. So the game logic assumes each skill has a requirement
        without actually checking if requirement is non-null. 
        */
		if (skill instanceof Skill) {
			//This check on the requirement variable is here to handle the case of a skill
			//having no requirements. By setting requirement equal to Concentration's requirements,
			//we prevent unchecked TypeErrors that have been breaking the auto learn feature.

			if ((!requirement || requirement.isCompleted()) && !checkSkillSkipped(skill)) {
				enabledSkills.push(skill);
			}
		}
	}

	if (enabledSkills.length == 0) {
		skillWithLowestMaxXp = gameData.taskData["Concentration"];
		return;
	}

	enabledSkills.sort((lhs, rhs) =>
		lhs.getMaxXp() / lhs.getXpGain() - rhs.getMaxXp() / rhs.getXpGain()
	);
	
	skillWithLowestMaxXp = gameData.taskData[enabledSkills[0].name];
}

function autoLearn() {
	if (!autoLearnElement.checked || !skillWithLowestMaxXp) return;
	gameData.currentSkill = skillWithLowestMaxXp;
}
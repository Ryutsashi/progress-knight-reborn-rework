const autoPromoteElement = document.getElementById("autoPromote");

function autoPromote() {
	if (!autoPromoteElement.checked) return;
	let nextEntity = getNextEntity(
		gameData.taskData,
		jobCategories,
		gameData.currentJob.name
	);
	if (nextEntity == null) return;
	let requirement = gameData.requirements[nextEntity.name];
	if (requirement.isCompleted()) gameData.currentJob = nextEntity;
}

function getNextEntity(data, categoryType, entityName) {
	let category = getCategoryFromEntityName(categoryType, entityName);
	let nextIndex = category.indexOf(entityName) + 1;
	if (nextIndex > category.length - 1) return null;
	let nextEntityName = category[nextIndex];
	let nextEntity = data[nextEntityName];
	return nextEntity;
}

function getCategoryFromEntityName(categoryType, entityName) {
	let category;
	for (let categoryName in categoryType) {
		category = categoryType[categoryName];
		if (category.includes(entityName)) {
			return category;
		}
	}
}

{
	function AutoPromote() {
		let _onPromote = () => {};
		let _onToggle = () => {};
		let _isActive = false;

		function getNextEntity(entity) {
			let category = CATEGORY_MAP_REVERSE[entity.ENTITY];
			let nextIndex = category.indexOf(entity.ENTITY) + 1;
			if (nextIndex < category.length && category[nextIndex].isUnlocked)
				return category[nextIndex];
		}

		function autoPromote() {
			if (!autoPromote.isActive) return;
			let nextEntity = getNextEntity(gameData.currentJob.ENTITY);
			if (!nextEntity || !gameData.requirements[nextEntity].isCompleted) {
				return;
			}
			switchCurrentJob(nextEntity);
			_onPromote(returnObject);
		}

		const returnObject = {
			onPromote: {
				set: fn => (_onPromote = fn)
			},
			onToggle: {
				set: fn => (_onToggle = fn)
			},
			isActive: {
				get: () => _isActive,
				set: value => {
					if (autoPromoteElement.checked != value) {
						_isActive = value;
						_onToggle(returnObject);
					}
				}
			},
			autoPromote
		};

		return returnObject;
	}
}

function updateTooltip(eventObject) {
	let key = eventObject.currentTarget.dataset.tooltipId;
	let newBuildingCost = calculateCostOfNextBuilding(townBaseData[key]);
	let coinSpan = document.getElementById(`coins-${key}`);

	formatCoins(newBuildingCost, coinSpan);
}

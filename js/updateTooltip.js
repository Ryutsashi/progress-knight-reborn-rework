function updateTooltip(eventObject) {
	let key = eventObject.currentTarget.dataset.tooltipId;
	
	let newBuildingCost = townBaseData[key].costOfNextBuilding;

	let coinSpan = document.getElementById(`coins-${key}`);

	formatCoins(newBuildingCost, coinSpan);
}

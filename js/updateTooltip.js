function updateTooltip(eventObject) {
	let tooltipId = `tooltip-${eventObject.currentTarget.id}`;
	var tooltipElement = document.querySelector("#" + tooltipId);
	
	let newBuildingCost =
		townBaseData[`o_${eventObject.currentTarget.id}`]
			.costOfNextBuilding;
			
	let buildingID = tooltipId.replace("tooltip-", "");
	let coinSpanId = `#coins-${buildingID}`;
	let coinSpan = document.querySelector(coinSpanId);
	formatCoins(newBuildingCost, coinSpan);
}

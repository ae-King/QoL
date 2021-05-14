exports.mod = (mod_info) => {
    logger.logInfo(`   [MOD] Loading: ${mod_info.name} (${mod_info.version}) by ${mod_info.author}`);

	//Load Settings from settings.json
	const settings = require("../settings.js");
	let locationfile = fileIO.readParsed(db.user.cache.locations); //var to store cache.locations.json
	let itemfile = fileIO.readParsed(db.user.cache.items); //var to store cache.items.json
	
	//Location.json Loop
	for (let map in locationfile){ //store locationfile data
		
		if (settings.RaidTimer.EditRaidTimer == true) { 	//Extract Timer for All Maps
			//Find In-Raid Timer and Edit to NewRaidTimerTime
			locationfile[map].base.exit_access_time = settings.RaidTimer.NewRaidTimerTime;
			locationfile[map].base.escape_time_limit = settings.RaidTimer.NewRaidTimerTime;
		}
		//Access Exfil parameters
		for (let exf in locationfile[map].base.exits){ //store base/exits parameters
				if (settings.ExfilTimer.EditExfilTimer == true){

					if (settings.ExfilTimer.RealisticExfilTimers == true){
						if (locationfile[map].base.exits[exf].ExfiltrationTime >= 5 && locationfile[map].base.exits[exf].ExfiltrationTime <= 10){
							locationfile[map].base.exits[exf].ExfiltrationTime = 5;
						}
						if (locationfile[map].base.exits[exf].ExfiltrationTime >= 15 && locationfile[map].base.exits[exf].ExfiltrationTime <= 60){
							locationfile[map].base.exits[exf].ExfiltrationTime = 15;
						} 
					} else {
						//find ExfiltrationTime and change it to NewExfiltrationTimerTime
						locationfile[map].base.exits[exf].ExfiltrationTime = settings.ExfilTimer.NewExfilTimerTime;
					}
					
				}
				if (settings.UnlockExfils.UnlockExfiltrationType == true){
					if (locationfile[map].base.exits[exf].PassageRequirement !== "WorldEvent"){ //if ExfilType is not WorldEvent then
						locationfile[map].base.exits[exf].ExfiltrationType = "Individual";
					}
				}
				if (settings.RemovePassageRequirement == true || locationfile[map].base.exits[exf].PassageRequirement !== "WorldEvent"){
					//Edit and Empty Exfil Item Requirements
							locationfile[map].base.exits[exf].Id = "";
							locationfile[map].base.exits[exf].PassageRequirement = "None"
							locationfile[map].base.exits[exf].Count = 0;
							locationfile[map].base.exits[exf].RequirementTip = "";
					}					
				//Chance for Exfil to be Open
				if (settings.UnlockExfils.AlwaysExfil.EditExfilChance == true){
					//Edit Chance for Extract to be Open
					locationfile[map].base.exits[exf].Chance = settings.UnlockExfils.AlwaysExfil.NewExfilChancePercentage
				}
			}
		}

	//Loop Checks
	if (settings.ExfilTimer.EditExfilTimer == true){
		logger.logInfo(`   [MOD] -- Exfil Timers: Editable`);
		if (settings.ExfilTimer.RealisticExfilTimers == true){
			logger.logInfo(`   [MOD] -- Realistic Exfil Timers: Set`);
		} else 
			logger.logInfo(`   [MOD] -- User Set Exfil Timers: Set`);
		}
		if (settings.UnlockExfils.UnlockExfiltrationType == true){
			logger.logInfo(`   [MOD] -- Exfils: Unlocked`);
			}else {
			logger.logInfo(`   [MOD] -- Exfils: Default`);
		}
		if (settings.RemovePassageRequirement == true){
			logger.logInfo(`   [MOD] -- Passages: Unlocked`);
		}					



	//Item.json Loop
	for (let ez in itemfile.data) { //Remove Item Nodes to Access _props

		let itemData = itemfile.data[ez];
		let propsData = itemfile.data[ez]._props;

		// if (itemfile.data[ez]._type != "Node") { //If _type isn't Node }

		//Remove Item Filters for Secure Containers and Backpacks based on _parentID
		if (settings.RemoveContainerRestrictions == true){
			if (itemData._parent === "5448bf274bdc2dfc2f8b456a" 
								|| itemData._parent === "5448e53e4bdc2d60728b4567") {
			propsData.Grids[0]._props.filters = []; //0 = 1
			}
		}
		
			
		//Remove BlocksFolding from Items
		if (settings.UnblockFoldables == true) {
			if(propsData.BlocksFolding == true){
				propsData.BlocksFolding = false;
			}
		}
			
		//Remove BlocksArmorVest parameters
		if (settings.UnblockArmorVest == true){
			if (propsData.BlocksArmorVest == true){
				propsData.BlocksArmorVest = false;
			}
		}
	}

	//Item Loop Checks

	if (settings.RemoveContainerRestrictions == true){
		logger.logInfo(`   [MOD] -- Container Restrictions: Removed`);
	} else {
		logger.logInfo(`   [MOD] -- Container Restrictions: Default`);
	}
	if (settings.UnblockFoldables == true) {
		logger.logInfo(`   [MOD] --  Weapon Folding: Unblocked`);
	} else{
		logger.logInfo(`   [MOD] -- Weapon Folding: Default`);
	}
	if (settings.UnblockArmorVest == true){
		logger.logInfo(`   [MOD] -- Armor Stacking: Unlocked`);
	} else {
		logger.logInfo(`   [MOD] -- Armor Stacking: Default`);
	}


	
	//ExfiltrationType = Individual, SharedTimer, Manual
	//PassageRequirement = None, Empty, TransferItem, WorldEvent, ScavCooperation
		//TransferItem requires you put itemID of item needed for PassageRequirement, Count is Amount of Item
		//RequirementTip = Tooltip that tells you what you need


	fileIO.write(db.user.cache.locations, locationfile);
	fileIO.write(db.user.cache.items, itemfile);
	logger.logInfo(`   [MOD] Loaded: ${mod_info.name} (${mod_info.version}) by ${mod_info.author}`);
}


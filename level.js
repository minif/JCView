LevelData = {
	LevelXML: "",
}
LevelData.SoftBodies = { //Potentially will be unused
	SoftBodyXML: "",
}

//Universal method to get a list of Objects in the level
LevelData.getObjects = function() {
	return LevelData.LevelXML.getElementsByTagName("Objects")[0].getElementsByTagName("Object");
}

//Universal method to get a list of SoftBodies in the level
LevelData.getSoftBodies = function() {
	rt = LevelData.LevelXML.getElementsByTagName("SoftBody");
	return rt;
}
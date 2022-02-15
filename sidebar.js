var lineColor = "#000000"
var selectedLineColor = "#008FFF"
const lineSpacing = 25;
Sidebar = {
	selectedObject: -1,
	scroll:0,
	width: 0,
	minWidth: 200,
	padding: 10,
}

//Universal method to get a list of Objects in the level
Sidebar.draw = function() {
	Sidebar.width = canvas.width/5;
	if (Sidebar.minWidth > Sidebar.width) Sidebar.width = Sidebar.minWidth;
	CanvasManager.drawRect(0, Sidebar.width, 0, canvas.height, "#888888");
	Sidebar.writeObjects();
}

Sidebar.writeObjects = function() {
	sceneObjects = LevelData.getObjects();
	//Loop through each object in the level and draw that object
	for (var i=0; i<sceneObjects.length; i++) {
		//Get information of object
		var name = sceneObjects[i].getAttribute("name");
		//Reused code artifacts just in case
		/*
		var xPos = sceneObjects[i].getAttribute("posX");
		var yPos = sceneObjects[i].getAttribute("posY");
		var xScale = sceneObjects[i].getAttribute("scaleX");
		var yScale = sceneObjects[i].getAttribute("scaleY");
		var angle = sceneObjects[i].getAttribute("angle");
		var body = this.getSoftbodyByName(sceneSoftBodies,name);
		*/ 
		var colorToDraw = lineColor;
		if (Sidebar.selectedObject == i) colorToDraw = selectedLineColor;

		CanvasManager.write(Sidebar.padding,(Sidebar.padding*2+(i*lineSpacing)-this.scroll),name,colorToDraw,Sidebar.width-(Sidebar.padding*2));
	}	
}
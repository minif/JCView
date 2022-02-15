var cameraDragX;
var cameraDragY;
var lineColor = "#000000"
var selectedLineColor = "#008FFF"

var CameraView = {
	//Camera Control
	cameraX: 0,
	cameraY: 0,
	cameraZoom : 4,
	minZoom : 1,
	maxZoom : 10000,

	lowestX : Infinity,
	highestX : -Infinity,
	lowestY: Infinity,
	highestY: -Infinity,
}

//Main update function. Called whenever any change is made.
CameraView.update = function() {
	if (sceneFile==null) return;
	//Clear Canvas for drawing
	CanvasManager.resizeCanvas()
	CanvasManager.erase()
	//Get objects to draw
	var sceneObjects = LevelData.getObjects();
	var sceneSoftBodies = LevelData.getSoftBodies();

	//Prepare for bounds checking
	CameraView.lowestX = 444
	CameraView.highestX = -Infinity
	CameraView.lowestY = Infinity
	CameraView.highestY = -Infinity

	//Loop through each object in the level and draw that object
	for (var i=0; i<sceneObjects.length; i++) {
		//Get information of object
		var name = sceneObjects[i].getAttribute("name");
		var xPos = sceneObjects[i].getAttribute("posX");
		var yPos = sceneObjects[i].getAttribute("posY");
		var xScale = sceneObjects[i].getAttribute("scaleX");
		var yScale = sceneObjects[i].getAttribute("scaleY");
		var angle = sceneObjects[i].getAttribute("angle");
		var body = CameraView.getSoftbodyByName(sceneSoftBodies,name);

		var colorToDraw = lineColor;
		if (Sidebar.selectedObject == i) colorToDraw = selectedLineColor;
		//Draw it!
		CameraView.drawSoftBody(body, xPos, yPos, xScale, yScale,angle, colorToDraw);
	}	
	Sidebar.draw();
	//SoftBody Drawing should have reported the hightest and lowest bounds, so we can set the camera to CameraView.
	//CameraView.setCameraBounds(lowestX, highestX, lowestY, highestY)
}

CameraView.cameraHandleInput = function(evtType,x,y) {
	switch(evtType) {
			case MouseEvents.downEvent: 
				cameraDragX = x;
				cameraDragY = y;	
				break;
			case MouseEvents.scrollEvent: 
				if (controlStyle == 0||shifting) CameraView.zoomView(y/100)
				else if (controlStyle == 1) CameraView.panCamera(x/CameraView.cameraZoom,y/CameraView.cameraZoom);
				break;
			case MouseEvents.moveEvent:
				if (dragging) {
					CameraView.panCamera((x-cameraDragX)/CameraView.cameraZoom,(y-cameraDragY)/CameraView.cameraZoom);
					cameraDragX = x;
					cameraDragY = y;	
				}
				break;
		}
}

//Change zoom size based on a value
CameraView.zoomView = function(value) {
	CameraView.cameraZoom+=value*(CameraView.cameraZoom/10);
	if (CameraView.cameraZoom<CameraView.minZoom) CameraView.cameraZoom = CameraView.minZoom;
	if (CameraView.cameraZoom>CameraView.maxZoom) CameraView.cameraZoom = CameraView.maxZoom;
	CameraView.update();
}

//Pan camera based on a change of x and y
CameraView.panCamera = function(x,y) {
	CameraView.cameraX+=x;
	if (CameraView.cameraX>CameraView.highestX) CameraView.cameraX=CameraView.highestX;
	if (CameraView.cameraX<CameraView.lowestX) CameraView.cameraX=CameraView.lowestX;
	CameraView.cameraY+=y;
	if (CameraView.cameraY>CameraView.highestY) CameraView.cameraY=CameraView.highestY;
	if (CameraView.cameraY<CameraView.lowestY) CameraView.cameraY=CameraView.lowestY;
	CameraView.update();
}

//Set minimums and maximums for sliders (1 unit on slider = 1 unit in camera)
CameraView.setCameraBounds = function(lX,hX,lY,hY) {
	lowestCameraX = lX
	highestCameraX = hX
	lowestCameraY = lY
	highestCameraY = hY
}

//Method to get a softbody by its name. If multiple softbodies exist with the same name, it gets the first one.
CameraView.getSoftbodyByName= function(bodies,name) {
	for (var i=0; i<bodies.length; i++) {
		if (bodies[i].getAttribute("name")==name) return bodies[i];
	}
	return null;
}

//WIP Method which gets a list of all softbodies, and creates a list of them.
CameraView.drawSoftbodyList= function(scene) {
	var softbodies = getSoftBodies();
	for (var i=0; i<softbodies.length; i++) {
		console.log(softbodies[i].getAttribute("name"))
	}
}

//Method in which convers points (In format [x,y]) from level format to canvas format for drawing.
CameraView.convertSceneToCanvas=function(x,y) {
	midX = canvas.width/2; 
	midY = canvas.height/2;
	cvX = (x+CameraView.cameraX)*CameraView.cameraZoom;
	cvY = (y+CameraView.cameraY)*CameraView.cameraZoom;
	cvX +=midX;
	cvY +=midY;
	return [cvX, cvY];
}

//Math based method in which rotates points. Origin is defined relative to the SoftBody. 
//X,Y are SoftBody coords. Angle is in radians
//(Example: A softbody with a point at (1,1) will end up at (-1,-1) after a π rotation.) 
CameraView.rotate = function(x, y, angle) {
	cos = Math.cos(angle),
	sin = Math.sin(angle),
	nx = (cos * (x)) + (sin * (y)),
	ny = (cos * (y)) - (sin * (x));
	return [nx, ny];
}

//The main Softbody Drawing function. 
//Accepts the softBody object to draw with valid points, as well as the x, y, scale and rotation in the level. 
CameraView.drawSoftBody=function(softBody, xPos, yPos, xScale, yScale, rotation, color) {
	//Gets the points from the softbody
	var points = softBody.getElementsByTagName("Points")[0].children;
	//Canvas points to plot
	var pointsToRender = [[]];
	//Converts rotation degrees to radians
	rotation = rotation*(Math.PI/180);
	//Loop through all points in the softbody
	for (var i=0; i<points.length; i++) {
		//Obtain the coordinates relative to SoftBody Origin
		var x = points[i].getAttribute("x");
		var y = points[i].getAttribute("y");
		//Conversion of x,y from relative to softbody to relative to level.
		//Scale the Softbody per level's specifications
		x*=xScale;
		y*=-yScale;
		//Rotate as per level specifications.
		pts = CameraView.rotate(x, y, rotation);
		x=pts[0];
		y=pts[1];
		//Move the Softbody to where it should be in the level
		x+=parseFloat(xPos);
		y-=parseFloat(yPos);
		//x,y should now be relative to level.
		//First, determine if the coords are extremena 
		if (-x < CameraView.lowestX) CameraView.lowestX=-x;
		if (-x > CameraView.highestX) CameraView.highestX=-x;
		if (-y < CameraView.lowestY) CameraView.lowestY=-y;
		if (-y > CameraView.highestY) CameraView.highestY=-y;

		//Convert points from relative to level to relative to canvas and add to list
		pts = CameraView.convertSceneToCanvas(x,y);
		pointsToRender.push(pts)
		//Also draw the point itself
		CanvasManager.drawPoint(pts[0],pts[1], color)
	}
	//Once the list has been made, send it off to the canvas to render
	CanvasManager.connectPoints(pointsToRender,color);
}
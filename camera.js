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

//Setup listener for window resizing
window.addEventListener('resize', CameraView.update);

//Main update function. Called whenever any change is made.
CameraView.update = function() {
	if (sceneFile==null) return;
	//Clear Canvas for drawing
	resizeCanvas()
	erase()
	//Get objects to draw
	var sceneObjects = getObjects();
	var sceneSoftBodies = getSoftBodies();

	//Prepare for bounds checking
	this.lowestX = 444
	this.highestX = -Infinity
	this.lowestY = Infinity
	this.highestY = -Infinity

	//Loop through each object in the level and draw that object
	for (var i=0; i<sceneObjects.length; i++) {
		//Get information of object
		var name = sceneObjects[i].getAttribute("name");
		var xPos = sceneObjects[i].getAttribute("posX");
		var yPos = sceneObjects[i].getAttribute("posY");
		var xScale = sceneObjects[i].getAttribute("scaleX");
		var yScale = sceneObjects[i].getAttribute("scaleY");
		var angle = sceneObjects[i].getAttribute("angle");
		var body = this.getSoftbodyByName(sceneSoftBodies,name);
		//Draw it!
		this.drawSoftBody(body, xPos, yPos, xScale, yScale,angle);
	}	

	//SoftBody Drawing should have reported the hightest and lowest bounds, so we can set the camera to this.
	//this.setCameraBounds(lowestX, highestX, lowestY, highestY)
}

var cameraDragX;
var cameraDragY;

CameraView.cameraHandleInput = function(evtType,x,y) {
	switch(evtType) {
			case MouseEvents.downEvent: 
				cameraDragX = x;
				cameraDragY = y;	
				break;
			case MouseEvents.scrollEvent: 
				if (controlStyle == 0||shifting) this.zoomView(y/100)
				else if (controlStyle == 1) this.panCamera(x/this.cameraZoom,y/this.cameraZoom);
				break;
			case MouseEvents.moveEvent:
				if (dragging) {
					this.panCamera((x-cameraDragX)/this.cameraZoom,(y-cameraDragY)/this.cameraZoom);
					cameraDragX = x;
					cameraDragY = y;	
				}
				break;
		}
}

//Change zoom size based on a value
CameraView.zoomView = function(value) {
	this.cameraZoom+=value*(this.cameraZoom/10);
	if (this.cameraZoom<this.minZoom) this.cameraZoom = this.minZoom;
	if (this.cameraZoom>this.maxZoom) this.cameraZoom = this.maxZoom;
	this.update();
}

//Pan camera based on a change of x and y
CameraView.panCamera = function(x,y) {
	this.cameraX+=x;
	if (this.cameraX>this.highestX) this.cameraX=this.highestX;
	if (this.cameraX<this.lowestX) this.cameraX=this.lowestX;
	this.cameraY+=y;
	if (this.cameraY>this.highestY) this.cameraY=this.highestY;
	if (this.cameraY<this.lowestY) this.cameraY=this.lowestY;
	this.update();
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
	cvX = (x+this.cameraX)*this.cameraZoom;
	cvY = (y+this.cameraY)*this.cameraZoom;
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
CameraView.drawSoftBody=function(softBody, xPos, yPos, xScale, yScale, rotation) {
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
		pts = this.rotate(x, y, rotation);
		x=pts[0];
		y=pts[1];
		//Move the Softbody to where it should be in the level
		x+=parseFloat(xPos);
		y-=parseFloat(yPos);
		//x,y should now be relative to level.
		//First, determine if the coords are extremena 
		if (-x < this.lowestX) this.lowestX=-x;
		if (-x > this.highestX) this.highestX=-x;
		if (-y < this.lowestY) this.lowestY=-y;
		if (-y > this.highestY) this.highestY=-y;

		//Convert points from relative to level to relative to canvas and add to list
		pts = this.convertSceneToCanvas(x,y);
		pointsToRender.push(pts)
		//Also draw the point itself
		drawPoint(pts[0],pts[1])
	}
	//Once the list has been made, send it off to the canvas to render
	connectPoints(pointsToRender);
}
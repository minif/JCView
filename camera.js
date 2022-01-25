//Camera Control
var cameraX = 0;
var cameraY = 0;
var cameraZoom = 4;

//Camera Bounds control
var lowestX = Infinity
var highestX = -Infinity
var lowestY = Infinity
var highestY = -Infinity

//Setup Sliders
var xPanSlider = document.getElementById("xPan");
xPanSlider.value = cameraX
var yPanSlider = document.getElementById("yPan");
yPanSlider.value = cameraY
var zoomSlider = document.getElementById("zoom");
zoomSlider.value = 3000;
setZoom(zoomSlider.value)

//Setup listener for window resizing
window.addEventListener('resize', update);

//Setup functions upon using sliders
xPanSlider.oninput = function() {
  cameraX = parseFloat(this.value);
	update();
}
yPanSlider.oninput = function() {
  cameraY = parseFloat(this.value);
	update();
}
zoomSlider.oninput = function() {
  setZoom(this.value)
	update();
}

//Deal with zoom math (Squares the camera zoom to make the slider slower at higher zooms.)
function setZoom(value) {
	cameraZoom = parseFloat(value)/2000;
	cameraZoom*=cameraZoom
}

//Set minimums and maximums for sliders (1 unit on slider = 1 unit in camera)
function setCameraBounds(lX,hX, lY, hY) {
	console.log(lX+" "+hX)
	xPanSlider.setAttribute("min",lX);
	xPanSlider.setAttribute("max",hX);
	yPanSlider.setAttribute("min",lY);
	yPanSlider.setAttribute("max",hY);
}

//Main update function. Called whenever any change is made.
function update() {
	if (sceneFile==null) return;
	//Clear Canvas for drawing
	resizeCanvas()
	erase()
	//Get objects to draw
	sceneObjects = getObjects();
	sceneSoftBodies = getSoftBodies();

	//Prepare for bounds checking
	lowestX = Infinity
	highestX = -Infinity
	lowestY = Infinity
	highestY = -Infinity

	//Loop through each object in the level and draw that object
	for (var i=0; i<sceneObjects.length; i++) {
		//Get information of object
		var name = sceneObjects[i].getAttribute("name");
		var xPos = sceneObjects[i].getAttribute("posX");
		var yPos = sceneObjects[i].getAttribute("posY");
		var xScale = sceneObjects[i].getAttribute("scaleX");
		var yScale = sceneObjects[i].getAttribute("scaleY");
		var angle = sceneObjects[i].getAttribute("angle");
		var body = getSoftbodyByName(sceneSoftBodies,name);
		//Draw it!
		drawSoftBody(body, xPos, yPos, xScale, yScale,angle);
	}	

	//SoftBody Drawing should have reported the hightest and lowest bounds, so we can set the camera to this.
	setCameraBounds(lowestX, highestX, lowestY, highestY)
}

//Method to get a softbody by its name. If multiple softbodies exist with the same name, it gets the first one.
function getSoftbodyByName(bodies, name) {
	for (var i=0; i<bodies.length; i++) {
		if (bodies[i].getAttribute("name")==name) return bodies[i];
	}
	return null;
}

//WIP Method which gets a list of all softbodies, and creates a list of them.
function drawSoftbodyList(scene) {
	var softbodies = getSoftBodies();
	for (var i=0; i<softbodies.length; i++) {
		console.log(softbodies[i].getAttribute("name"))
	}
}

//Method in which convers points (In format [x,y]) from level format to canvas format for drawing.
function convertSceneToCanvas(x,y) {
	midX = canvas.width/2; 
	midY = canvas.height/2;
	cvX = (x+cameraX)*cameraZoom;
	cvY = (y+cameraY)*cameraZoom;
	cvX +=midX;
	cvY +=midY;
	return [cvX, cvY];
}

//Math based method in which rotates points. Origin is defined relative to the SoftBody. 
//X,Y are SoftBody coords. Angle is in radians
//(Example: A softbody with a point at (1,1) will end up at (-1,-1) after a π rotation.) 
function rotate(x, y, angle) {
	cos = Math.cos(angle),
	sin = Math.sin(angle),
	nx = (cos * (x)) + (sin * (y)),
	ny = (cos * (y)) - (sin * (x));
	return [nx, ny];
}

//The main Softbody Drawing function. 
//Accepts the softBody object to draw with valid points, as well as the x, y, scale and rotation in the level. 
function drawSoftBody(softBody, xPos, yPos, xScale, yScale, rotation) {
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
		pts = rotate(x, y, rotation);
		x=pts[0];
		y=pts[1];
		//Move the Softbody to where it should be in the level
		x+=parseFloat(xPos);
		y-=parseFloat(yPos);
		//x,y should now be relative to level.
		//First, determine if the coords are extremena 
		if (-x < lowestX) lowestX=-x;
		if (-x > highestX) highestX=-x;
		if (-y < lowestY) lowestY=-y;
		if (-y > highestY) highestY=-y;

		//Convert points from relative to level to relative to canvas and add to list
		pts = convertSceneToCanvas(x,y);
		pointsToRender.push(pts)
		//Also draw the point itself
		drawPoint(pts[0],pts[1])
	}
	//Once the list has been made, send it off to the canvas to render
	connectPoints(pointsToRender);
}
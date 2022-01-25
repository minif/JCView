var cameraX = 0;
var cameraY = 0;
var cameraZoom = 4;

var lowestX = Infinity
var highestX = -Infinity
var lowestY = Infinity
var highestY = -Infinity

var xPanSlider = document.getElementById("xPan");
xPanSlider.value = cameraX
var yPanSlider = document.getElementById("yPan");
yPanSlider.value = cameraY
var zoomSlider = document.getElementById("zoom");
zoomSlider.value = 3000;
cameraZoom = parseFloat(zoomSlider.value)/2000;
cameraZoom*=cameraZoom

window.addEventListener('resize', update);

xPanSlider.oninput = function() {
  cameraX = parseFloat(this.value);
	update();
}

yPanSlider.oninput = function() {
  cameraY = parseFloat(this.value);
	update();
}
zoomSlider.oninput = function() {
  cameraZoom = parseFloat(this.value)/2000;
	cameraZoom*=cameraZoom
	update();
}

function setCameraBounds(lX,hX, lY, hY) {
	console.log(lX+" "+hX)
	xPanSlider.setAttribute("min",lX);
	xPanSlider.setAttribute("max",hX);
	yPanSlider.setAttribute("min",lY);
	yPanSlider.setAttribute("max",hY);
}

function update() {
	if (sceneFile==null) return;
	resizeCanvas()
	erase()
	sceneObjects = getObjects();
	sceneSoftBodies = getSoftBodies();

	lowestX = Infinity
	highestX = -Infinity
	lowestY = Infinity
	highestY = -Infinity

	for (var i=0; i<sceneObjects.length; i++) {
		var name = sceneObjects[i].getAttribute("name");
		var xPos = sceneObjects[i].getAttribute("posX");
		var yPos = sceneObjects[i].getAttribute("posY");
		var xScale = sceneObjects[i].getAttribute("scaleX");
		var yScale = sceneObjects[i].getAttribute("scaleY");
		var angle = sceneObjects[i].getAttribute("angle");
		var body = getSoftbodyByName(sceneSoftBodies,name);
		drawSoftBody(body, xPos, yPos, xScale, yScale,angle);
	}

	setCameraBounds(lowestX, highestX, lowestY, highestY)
}

function getSoftbodyByName(bodies, name) {
	for (var i=0; i<bodies.length; i++) {
		if (bodies[i].getAttribute("name")==name) return bodies[i];
	}
	return null;
}

function drawSoftbodyList(scene) {
	var softbodies = getSoftBodies();
	for (var i=0; i<softbodies.length; i++) {
		console.log(softbodies[i].getAttribute("name"))
	}
	return softbodies;
}

function convertSceneToCanvas(x,y) {
	midX = canvas.width/2; 
	midY = canvas.height/2;
	cvX = (x+cameraX)*cameraZoom;
	cvY = (y+cameraY)*cameraZoom;
	cvX +=midX;
	cvY +=midY;
	return [cvX, cvY];
}

function test(x,y) {
	midY = canvas.height/2;
	cvX = (x+cameraX)*cameraZoom;
	cvY = (y+cameraY)*cameraZoom;
	return [cvX, cvY];
}

function rotate(x, y, angle) {
	cos = Math.cos(angle),
	sin = Math.sin(angle),
	nx = (cos * (x)) + (sin * (y)),
	ny = (cos * (y)) - (sin * (x));
	return [nx, ny];
}

function drawSoftBody(softBody, xPos, yPos, xScale, yScale, rotation) {
	var points = softBody.getElementsByTagName("Points")[0].children;
	var pointsToRender = [[]];
	rotation = rotation*(Math.PI/180);
	cosA = Math.cos(rotation);
	sinA = Math.sin(rotation)
	for (var i=0; i<points.length; i++) {
		var x = points[i].getAttribute("x");
		var y = points[i].getAttribute("y");
		x*=xScale;
		y*=-yScale;
		//rotate
		pts = rotate(x, y, rotation);
		x=pts[0];
		y=pts[1];
		x+=parseFloat(xPos);
		y-=parseFloat(yPos);

		if (-x < lowestX) lowestX=-x;
		if (-x > highestX) highestX=-x;
		if (-y < lowestY) lowestY=-y;
		if (-y > highestY) highestY=-y;

		pts = convertSceneToCanvas(x,y);
		pointsToRender.push(pts)
		drawPoint(pts[0],pts[1])
	}
	connectPoints(pointsToRender);
}
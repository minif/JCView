//Init canvas
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var menuDiv = document.getElementById("menu");

var CanvasManager = {};

//Resize canvas, that way the canvas is always the same size as the window
CanvasManager.resizeCanvas = function() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight-menuDiv.offsetHeight;
}

//Clear the canvas for drawing
CanvasManager.erase = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

//Draw a green dot (Currently used for SoftBody points)
CanvasManager.drawPoint = function(x, y,color) {
	let r=3;
	context.beginPath();
	context.fillStyle = color; 
	context.strokeStyle = color; 
	context.arc(x, y, r, 0, Math.PI * 2, true); 
	context.fill();
	context.stroke();
}

//Draw a black line connecting a 2D array of points in form [x,y]
CanvasManager.connectPoints = function(points,color) {
	context.lineWidth = 2;
	context.beginPath();
	context.strokeStyle = color; 
	for (var i=0; i<=points.length+1; i++) {
		x = points[i%points.length][0];
		y = points[i%points.length][1];
		context.lineTo(x, y);
	}
	context.stroke();
}

CanvasManager.drawRect = function(x1, x2, y1, y2, color) {
	context.fillStyle = color; 
	context.strokeStyle = color; 
	context.beginPath();
	context.fillRect(x1, y1, x2-x1, y2-y1);
	context.stroke();
}

CanvasManager.write = function(x,y,message,color, maxWidth) {
	context.fillStyle = color; 
	context.strokeStyle = color; 
	context.font = "20px Georgia";
	var metrics = context.measureText(message);
	if (metrics.width>maxWidth) {
		context.fillText(message.substring(0,10) + "...", x, y);
	} else {
		context.fillText(message, x, y);
	}
	
}
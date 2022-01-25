//Init canvas
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

//Resize canvas, that way the canvas is always the same size as the window
function resizeCanvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

//Clear the canvas for drawing
function erase() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

//Draw a green dot (Currently used for SoftBody points)
function drawPoint(x, y) {
	let r=3;
	context.beginPath();
	context.fillStyle = "green"; 
	context.arc(x, y, r, 0, Math.PI * 2, true); 
	context.fill();
	context.stroke;
}

//Draw a black line connecting a 2D array of points in form [x,y]
function connectPoints(points) {
	context.lineWidth = 2;
	context.beginPath();
	context.strokeStyle = "#000000"; 
	for (var i=0; i<=points.length+1; i++) {
		x = points[i%points.length][0];
		y = points[i%points.length][1];
		context.lineTo(x, y);
	}
	context.stroke();
}
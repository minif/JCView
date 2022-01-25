var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

function erase() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPoint(x, y) {
	let r=3;
	context.beginPath();
	context.fillStyle = "green"; 
	context.arc(x, y, r, 0, Math.PI * 2, true); 
	context.fill();
	context.stroke;
}

function connectPoints(points) {
	context.lineWidth = 2;
	context.beginPath();
	context.strokeStyle = "#000000"; 
	for (var i=0; i<=points.length+1; i++) {
		x = points[i%points.length][0];
		y = points[i%points.length][1];
		context.lineTo(x, y);
		//drawPoint(x,y)
	}
	context.stroke();
}
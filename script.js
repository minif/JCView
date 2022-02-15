const sceneFile = 1;
const softBodies = 2;
var fullDoc //Debug purposes

var controlStyle = 0;
var controlMessage = document.getElementById("controls");
updateControlMessage()

//Setup listener for window resizing
window.addEventListener('resize', CameraView.update);

//Button Hanling
function download() {
	downloadXML(sceneFile, "test.scene", "text/plain")	
}
function test() {
	sceneFile.children[1].setAttribute("test","tttt")
}

//Upload .scene file and parse with XML parser
function upload() {
	//Upload file
	var selectedFile = document.getElementById('input').files[0];
	console.log(selectedFile);
	var reader = new FileReader();
	reader.onload = function(e) {
			//After reading, parse as XML
			readXml=e.target.result;
			var parser = new DOMParser();
			var doc = parser.parseFromString(readXml, "application/xml");
			fullDoc=doc;//For Debug Purposes
			finishedLoading(doc.firstChild)
	}
	parser = new DOMParser();
	reader.readAsText(selectedFile);
}

//When loading has finished, Set up level editor.
function finishedLoading(scene) {
	LevelData.LevelXML=scene //For Public/Debug Access
	//softBodies = CameraView.drawSoftbodyList(scene);
	CameraView.update();
}

var dragging = false;
var dragX = 0;
var dragY = 0;

//Mouse tracking for canvas
var mtt = new MouseTouchTracker(canvas,
  function(evtType, x, y) {
		//Handle Dragging
		switch (evtType) {
			case MouseEvents.upEvent:
				dragging=false;
				break;
			case MouseEvents.downEvent:
				dragging=true;
				dragX = x;
				dragY = y;	
				console.log(x+" "+y);
				break;
		}
		//Will be used for mouse detection on multiple views. For now it is just the canvas.
		CameraView.cameraHandleInput(evtType,x,y)
});

//Deal with a change in control style
function changeControlStyle() {
	controlStyle++;
	if (controlStyle==2) controlStyle=0;
	updateControlMessage()
}

function updateControlMessage() {
	switch (controlStyle) {
		case 0:
			controlMessage.innerHTML="Drag to pan, Scroll to Zoom.";
			break;
		case 1:
			controlMessage.innerHTML="Scroll to pan, Shift + Scroll to Zoom. (Experimental)";
			break;
	}
}

//Download XML as .scene
function downloadXML(content, fileName, contentType) {
	let xml = new XMLSerializer().serializeToString(sceneFile);
	var a = document.createElement("a");
	var file = new Blob([xml], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
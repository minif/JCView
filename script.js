var sceneFile
var softBodies
var fullDoc //Debug purposes

var controlStyle = 0;

//Button Hanling
function download() {
	downloadXML(sceneFile, "test.scene", "text/plain")	
}
function test() {
	sceneFile.children[1].setAttribute("test","tttt")
}

//Universal method to get a list of Objects in the level
function getObjects() {
	return sceneFile.getElementsByTagName("Objects")[0].getElementsByTagName("Object");
}

//Universal method to get a list of SoftBodies in the level
function getSoftBodies() {
	rt = sceneFile.getElementsByTagName("SoftBody");
	softBodies = rt;
	return rt;
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
	sceneFile=scene //For Public/Debug Access
	softBodies = drawSoftbodyList(scene);
	update();
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
		cameraHandleInput(evtType,x,y)
});

//Download XML as .scene
function downloadXML(content, fileName, contentType) {
	let xml = new XMLSerializer().serializeToString(sceneFile);
	var a = document.createElement("a");
	var file = new Blob([xml], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
var sceneFile
var softBodies



function download() {
	downloadXML(sceneFile, "test.scene", "text/plain")	
}
function test() {
	sceneFile.children[1].setAttribute("test","tttt")
}

function getObjects() {
	return sceneFile.getElementsByTagName("Objects")[0].getElementsByTagName("Object");
}

function getSoftBodies() {
	rt = sceneFile.getElementsByTagName("SoftBody");
	softBodies = rt;
	return rt;
}

function upload() {
	var selectedFile = document.getElementById('input').files[0];
	console.log(selectedFile);
	var reader = new FileReader();
	reader.onload = function(e) {
			readXml=e.target.result;
			//console.log(readXml);
			var parser = new DOMParser();
			var doc = parser.parseFromString(readXml, "application/xml");
			//console.log(doc);
			finishedLoading(doc.firstChild)
	}
	parser = new DOMParser();
	reader.readAsText(selectedFile);
}
function finishedLoading(scene) {
	sceneFile=scene //For Public/Debug Access
	softBodies = drawSoftbodyList(scene);
	//drawSoftBody(softBodies[softBodies.length-6]);
	update();
}

function downloadXML(content, fileName, contentType) {
	let xml = new XMLSerializer().serializeToString(sceneFile);
	var a = document.createElement("a");
	var file = new Blob([xml], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
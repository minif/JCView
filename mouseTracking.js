//Code belongs to https://codeboxsystems.com/tutorials/en/how-to-drag-and-drop-objects-javascript-canvas/

const MouseEvents = {
	moveEvent: 0,
	downEvent: 1,
	upEvent: 2,
	scrollEvent: 3,
}

var MouseTouchTracker = function(canvas, callback){

  function processEvent(evt) {
    var rect = canvas.getBoundingClientRect();
    var offsetTop = rect.top;
    var offsetLeft = rect.left;

    if (evt.touches) {
      return {
        x: evt.touches[0].clientX - offsetLeft,
        y: evt.touches[0].clientY - offsetTop
      }
    } else {
      return {
        x: evt.clientX - offsetLeft,
        y: evt.clientY - offsetTop
      }
    }
  }

	function onScroll(evt) {
    evt.preventDefault();
    debugScrollEvent = evt;
    callback(MouseEvents.scrollEvent, evt.wheelDeltaX, evt.wheelDeltaY);
  }

  function onDown(evt) {
    evt.preventDefault();
    var coords = processEvent(evt);
    callback(MouseEvents.downEvent, coords.x, coords.y);
  }

  function onUp(evt) {
    evt.preventDefault();
    callback(MouseEvents.upEvent);
  }

  function onMove(evt) {
    evt.preventDefault();
    var coords = processEvent(evt);
    callback(MouseEvents.moveEvent, coords.x, coords.y);
  }

  canvas.ontouchmove = onMove;
  canvas.onmousemove = onMove;

  canvas.ontouchstart = onDown;
  canvas.onmousedown = onDown;
  canvas.ontouchend = onUp;
  canvas.onmouseup = onUp;

	canvas.onscroll = onScroll;
	canvas.onwheel = onScroll;
}
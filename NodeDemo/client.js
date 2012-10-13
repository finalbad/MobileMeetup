function main() {
  bindElementsToIds($);
  bindCanvasContext();
  addEventListeners();
  adjustElementPositions();
  makeIdentity();

  log('Ready to roll.');

  jsonRequest('/connect', 'GET');
  establishNotifier();
}

// Container to hold all static elements in the document we're going to work with.
var $ = {
  body: null,
  clearCanvasButton: null,
  column2: null,
  drawing: null,
  drawingContainer: null,
  messageEntry: null,
  namebox: null,
  entryContainer: null,
  output: null,
  outputContainer: null
};

// Timeout for requests.
var xhrTimeoutSecs = 5;

var css = {
  standard: 'standardOutput',
  debug: 'debugOutput',
  log: 'standardOutput'
};

var brushRadius = 3;
var brushColor = 'rgba(0, 0, 64, 0.4)';

// Holds client's identifier (should probably use a cookie instead).
var identity;

// Is the mouse button down?
var mousedown;

// Graphics context for drawing to the canvas.
var context;

// Invoke main after objects have been set up.
main();

// Adds event listeners to interesting objects in the DOM.
function addEventListeners() {
  $.messageEntry.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      handleMessageEntry();
      event.preventDefault();
    }

  }, false);

  // Adjust things that can't be targeted by CSS when the window resizes.
  window.addEventListener('resize', function(event) {
    adjustElementPositions();
  });

  // Send user's name when 'Enter' is pressed.
  $.namebox.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      jsonRequest('/name', 'POST', {name: $.namebox.value});
    }
  });

  // Track mouse movement over the canvas.
  $.drawing.addEventListener('mousemove', function(event) {
    var x = event.pageX - $.drawing.offsetLeft
    var y = event.pageY - $.drawing.offsetTop;
    if (mousedown) {
      drawPoint(x, y);
      postPoint(x, y);
      event.preventDefault();
    }
  });

  // Clear the canvas when the Clear Canvas button is clicked.
  $.clearCanvasButton.addEventListener('click', function(event) {
    jsonRequest('/clearDrawing', 'GET');
  });

  // Prevent selection of things when dragging with the mouse down.
  $.body.addEventListener('selectstart', function(event) {
    event.preventDefault();
  });

  // Track mouse button up/down status.
  $.body.addEventListener('mouseup', function(event) {
    mousedown = false;
  });
  $.body.addEventListener('mousedown', function(event) {
    mousedown = true;    
  });
}

// Send a point to the server.
function postPoint(x, y) {
  jsonRequest('/point', 'POST', {point: {x: x, y: y} }, null);
}

// Draw a point on screen.
function drawPoint(x, y) {
  // Generate a radial gradient to make the point look nice.
  var gradient = context.createRadialGradient(x, y, 1, x, y, brushRadius);
  gradient.addColorStop(0, brushColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(x - brushRadius + 1, y - brushRadius + 1, brushRadius * 2 + 2, brushRadius * 2 + 2);
}

function bindCanvasContext() {
  context = $.drawing.getContext('2d');
  context.strokeStyle = "#000";
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
}

function makeIdentity() {
  identity = 'id' + parseInt(Math.random() * 1000000);
}

function defaultHandler(err, json) {
  if (json.queue) {
    json.queue.forEach(function(msg) {
      defaultHandler(null, msg);
    });
  }

  if (json.message) {
    if (json.presentation == 'log') {
      log(json.message);
    }
    else {
      log(json.message);
    }
  }

  if (json.drawPoint) {
    drawPoint(json.drawPoint.x, json.drawPoint.y);
  }

  if (json.clearCanvas) {
    context.clearRect(0, 0, 320, 320);
  }

}

function jsonRequest(path, method, dataObj, cb) {
  var xhrTimeout = setTimeout(requestTimedOut, xhrTimeoutSecs * 1000);
  var xhr = new XMLHttpRequest();  
  xhr.open(method, path, true);
  xhr.setRequestHeader('user-identity', identity);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      clearTimeout(xhrTimeout);
      if (!xhr.responseText) {
        return;
      }
      var json = JSON.parse(xhr.responseText);

      defaultHandler(null, json);
      if (cb) {
        cb(null, json);
      }
    }
  }

  if (dataObj) {
    var data = JSON.stringify(dataObj);
  }

  xhr.send(data);

  function requestTimedOut() {
    xhr.abort();
    if (cb) cb('Request to server timed out.');
  }
}

function establishNotifier() {
  jsonRequest('/notifier', 'GET', null, function(err, json) {
    establishNotifier();
  });
}

function bindElementsToIds(obj) {
  // Look up all static elements by their key names.
  for (var key in obj) {
    var el = document.getElementById(key);
    if (!el) {
      alert('Could not find element for ' + key);
    }
    obj[key] = el;
  }
}

function adjustElementPositions() {
  var columnHeight = $.column2.scrollHeight;
  var entryHeight = $.entryContainer.scrollHeight;
  $.outputContainer.style.height = columnHeight - entryHeight - 10 + 'px';

  $.outputContainer.scrollTop = $.outputContainer.scrollHeight;
}

function handleMessageEntry() {
  var text = $.messageEntry.value;
  $.messageEntry.value = "";

  var el = output('Sending: ' + text, css.standard);
  jsonRequest('/message', 'POST', {text: text}, function(err, json) {
    if (json.ok) {
      el.parentNode.removeChild(el);
    }
  });
}

function debug(str) {
  return output(str, css.debug);
}

function log(str) {
  return output(str, css.log);
}

function output(str, className) {
  var div = document.createElement('div');
  div.className = className;
  div.innerHTML = str;
  $.output.appendChild(div);
  $.outputContainer.scrollTop = $.outputContainer.scrollHeight;
  return div;
}
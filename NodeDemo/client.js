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


var pointSendInterval = 10;
var xhrTimeoutSecs = 5;
var pointsToSendQueue = [];

var css = {
  standard: 'standardOutput',
  debug: 'debugOutput',
  log: 'standardOutput'
};

var identity;
var mousedown;
var context;

// Invoke main after objects have been set up.
main();

function addEventListeners() {
  $.messageEntry.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      handleMessageEntry();
      event.preventDefault();
    }

  }, false);

  window.addEventListener('resize', function(event) {
    adjustElementPositions();
  });

  $.namebox.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      jsonRequest('/name', 'POST', {name: $.namebox.value});
    }
  });

  $.drawing.addEventListener('mousemove', function(event) {
    var x = event.pageX - $.drawing.offsetLeft
    var y = event.pageY - $.drawing.offsetTop;
    if (mousedown) {
      drawPoint(x, y);
      postPoint(x, y);
      event.preventDefault();
    }
  });

  $.clearCanvasButton.addEventListener('click', function(event) {
    jsonRequest('/clearDrawing', 'GET');
  });

  $.body.addEventListener('selectstart', function(event) {
    event.preventDefault();
  });

  $.body.addEventListener('mouseup', function(event) {
    mousedown = false;
  });
  $.body.addEventListener('mousedown', function(event) {
    mousedown = true;    
  });
}

function postPoint(x, y) {
  jsonRequest('/point', 'POST', {point: {x: x, y: y} }, null);
}

function drawPoint(x, y) {
  var gradient = context.createRadialGradient(x, y, 1, x, y, 3);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(x - 5, y - 5, 10, 10);
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
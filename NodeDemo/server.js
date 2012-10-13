// Include libraries.
var http = require('http');
var util = require('util');
var fs = require('fs');
var debug = require('./happydojo-util').debug;

var listenOnPort = 7373;

var appHtmlPath = './client.html';
var appJsPath = './client.js';
var appCssPath = './client.css';

var httpServer = http.createServer(handleRequest);

httpServer.listen(listenOnPort, function(err) {
  if (err) {
    debug(err);
  }
});

var clients = {};

function makeClient(identity) {
  return {
    id: identity,
    name: 'Anon' + parseInt(Math.random() * 100),
    requestCount: 0,
    messageQueue: [],
    response: null
  };
}

var currentPoints = [];

function handleRequest(req, res) {
  var endpoints = {
    '/': handleAppHtml,
    '/appjs': handleAppJs,
    '/appcss': handleAppCss,
    '/clearDrawing': handleClearDrawing,
    '/connect': handleConnect,
    '/favicon.ico': handleFavicon,
    '/name': handleName,
    '/message': handleMessage,
    '/notifier': handleNotifier,
    '/point': handlePoint
  };

  var id = req.headers['user-identity'];
  if (id) {
    var client = clients[id];
    if (!client) {
      client = makeClient(id);
      clients[id] = client;
    }
    client.requestCount++;
  }

  callHandler();

  function callHandler() {
    var handler = endpoints[req.url];
    if (handler) {
      debug('Handling ', req.url);

      if (req.method == 'POST') {
        parseIncomingJson(function(err, obj) {
          if (!err) {
            handler(obj);
          }
          else {
            emitJson({error: true, message: 'Server error handling request.'});
          }
        });
      }
      else {
        handler();
      }      
    }
    else {
      handlerNotFound();
    }    
  }

  function handlerNotFound() {
    debug('Handler not found for ', req.url);
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('These are not the droids you are looking for: ' + req.url);
  }

  // --- begin handlers ---

  function handleAppCss() {
    emitFile(appCssPath, 'text/css');
  }

  function handleAppHtml() {
    emitFile(appHtmlPath, 'text/html');
  }

  function handleAppJs() {
    emitFile(appJsPath, 'application/javascript');
  }

  function handleClearDrawing() {
    currentPoints = [];
    notifyAllClients({message: client.name + ' cleared the canvas.'});
    notifyAllClients({clearCanvas: true});
    emitJson({ok: true});
  }

  function handleConnect() {
    var msg = {ok: true, message: 'Connected to server as ' + client.name, presentation: 'log'};
    if (currentPoints.length) {
      msg.queue = [];
      currentPoints.forEach(function(point) {
        msg.queue.push({drawPoint: point});
      });
    }
    emitJson(msg);
    notifyAllClients({message: client.name + ' connected!'});
  }

  function handleFavicon() {
    // Just emit a simple 404 when the browser requests favicon.ico.
    res.writeHead(404);
    res.end();
  }

  function handleMessage(obj) {
    var notifyText = '<b>' + client.name + '</b>: ' + obj.text;
    emitJson({ok: true});
    notifyAllClients({message: notifyText});
  }

  function handleName(obj) {
    var oldName = client.name;
    client.name = obj.name;
    emitJson({ok: true});
    notifyAllClients({message: oldName + ' is now known as ' + client.name});
  }

  function handleNotifier() {
    client.response = res;
    processMessageQueue(client);
  }

  function handlePoint(obj) {
    emitJson({ok: true});
    currentPoints.push(obj.point);
    notifyAllClients({drawPoint: obj.point}, client);
  }

  // --- end handlers ---

  // --- begin output helpers ---

  function emitFile(filename, mimetype) {
    fs.readFile(filename, function(err, data) {
      res.writeHead(200, {'content-type': mimetype});
      res.end(data);
    });
  }

  function emitJson(obj) {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(obj));
  }

  function notifyAllClients(obj, except) {
    //debug('Notifying all clients: ', obj);

    for (var key in clients) {
      var cli = clients[key];
      if (cli === except) {
        cli.messageQueue.push('{}');
      }
      else {
        cli.messageQueue.push(obj);
      }
      processMessageQueue(cli);
    }
  }

  function processMessageQueue(cli) {    
    if (cli.response && cli.messageQueue.length > 0) {
      if (cli.messageQueue.length == 1) {
        var msg = cli.messageQueue[0];
        cli.messageQueue = [];
      }
      else {
        var msg = {queue: cli.messageQueue};
        cli.messageQueue = [];
      }

      debug('Notifying ', cli.id, ' that ', msg);

      cli.response.writeHead({'content-type': 'application/json'});
      cli.response.end(JSON.stringify(msg));
      cli.response = null;
    }
  }

  // --- end output helpers ---

  // --- begin other helpers ---
  function parseIncomingJson(cb) {
    var data = '';

    req
      .on('data', function(chunk) {
        data += chunk;
      })
      .on('end', function() {
        debug('Data: ', data);
        try {
          cb(null, JSON.parse(data));
        }
        catch(e) {          
          debug('Error parsing incoming JSON data: ', data);
          cb('Error parsing incoming JSON data');
        }
      });

  }
}


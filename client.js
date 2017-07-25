var fs = require('fs');
var net = require('net');
var urlParse = require('url').parse;
var WebSocket = require('hyco-websocket');
var WebSocketServer = require('hyco-websocket').relayedServer;

process.chdir(__dirname);

var argv = require('optimist').argv;
var pidfile;

//kill an already running instance
if (argv.kill) {
  pidfile = argv.kill;
  if (!pidfile.match(/\.pid$/i))
    pidfile += '.pid';
  try {
    var pid = fs.readFileSync(pidfile, 'utf8');
    fs.unlinkSync(pidfile);
    process.kill(parseInt(pid, 10));
    console.log('Killed process ' + pid);
  } catch (e) {
    console.log('Error killing process ' + (pid || argv.kill));
  }
  process.exit();
}

//write pid to file so it can be killed with --kill
if (argv.pidfile) {
  pidfile = argv.pidfile;
  if (!pidfile.match(/\.pid$/i))
    pidfile += '.pid';
  fs.writeFileSync(pidfile, process.pid);
}


if (argv._.length < 6) {
  console.log('server.js [namespace] [path] [key-rule] [key] [host] [port]')
  process.exit(1);
}

var ns = argv._[0];
var path = argv._[1];
var keyrule = argv._[2];
var key = argv._[3];
var host = argv._[4];
var port = argv._[5];

var wsServer = new WebSocketServer({
  server: WebSocket.createRelayListenUri(ns, path),
  token: function () {
    return WebSocket.createRelayToken('https://' + ns, keyrule, key);
  }
});

wsServer.on('request', function (request) {
  var url = urlParse(request.resource, true);
  var args = url.pathname.split('/').slice(1);
  var action = args.shift();
  var params = url.query;

  console.log(request);
  // if (action == 'tunnel') {
  console.log('tunnel');
  //createTunnel(request, params.port, params.host);
  createTunnel(request, port, host);
  /* } else {
     request.reject(404);
   }*/
});


function createTunnel(request, port, host) {
  request.accept(null, null, null, function (webSock) {
    console.log(webSock.remoteAddress + ' connected - Protocol Version ' + webSock.webSocketVersion);

    var tcpSock = new net.Socket();

    tcpSock.on('error', function (err) {
      webSock.send(JSON.stringify({ status: 'error', details: 'Upstream socket error; ' + err }));
    });

    tcpSock.on('data', function (data) {
      console.log('data');
      webSock.send(data);
    });

    tcpSock.on('close', function () {
      webSock.close();
    });
    console.log('connection on ' + host + ": " + port);
    tcpSock.connect(port, host || '127.0.0.1', function () {
      webSock.on('message', function (msg) {
        if (msg.type === 'utf8') {
          console.log('received utf message: ' + msg.utf8Data);
        } else {
          console.log('received binary message of length ' + msg.binaryData.length);
          tcpSock.write(msg.binaryData);
        }
      });
      webSock.send(JSON.stringify({ status: 'ready', details: 'Upstream socket connected' }));
    });

    webSock.on('close', function () {
      tcpSock.destroy();
      console.log(webSock.remoteAddress + ' disconnected');
    });
  });
}
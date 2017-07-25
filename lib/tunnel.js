var net = require('net');
var WebSocketClient = require('hyco-websocket').client;

exports.createTunnel = function(wsServerAddr, token, listenport, callback) {
    var server = net.createServer(function(tcpSock) {

    var wsClient = new WebSocketClient();

    var webSock, buffer = [];

    tcpSock.on('data', function(data) {      
      if (!webSock || buffer.length) {
        //console.log('data');
        buffer.push(data);
      } else {
        webSock.send(data);
      }
    });

    tcpSock.on('close', function() {
      log('TCP socket closed');
      if (webSock) {
        webSock.close();
      } else {
        webSock = null;
      }
    });

    tcpSock.on('error', function(err) {
      log('TCP socket closed');
      if (webSock) {
        webSock.close();
      } else {
        webSock = null;
      }
    });

    wsClient.on('connect', function(connection) {
      log('WebSocket connected');

      //flush buffer
      while (buffer.length) {
        connection.send(buffer.shift());
      }

      //check if tcpSock is already closed
      if (webSock === null) {
        connection.close();
        return;
      }

      webSock = connection;
      webSock.on('message', function(msg) {
        if (msg.type == 'utf8') {
          //log('Received UTF8 message');
          var data = JSON.parse(msg.utf8Data);
          if (data.status == 'error') {
            log(data.details);
            webSock.close();
          }
        } else {
          //log('Received binary message');
          tcpSock.write(msg.binaryData);
        }
      });

      webSock.on('close', function(reasonCode, description) {
        log('WebSocket closed; ' + reasonCode + '; ' + description);
        tcpSock.destroy();
      });

    });

    wsClient.on('connectFailed', function(err) {
      log('WebSocket connection failed: ' + err);
      tcpSock.destroy();
    });

    var url = wsServerAddr;// + '&port=' + forward.port + '&host=' + forward.host;
    wsClient.connect(url, null, null,
      { 'ServiceBusAuthorization' : token
      //  'Authorization': 'Basic ' + new Buffer(credentials).toString('base64')
      });

  });

  server.on('error', function(err) {
    callback(err);
  });

  server.listen(listenport, function() {
    var addr = server.address();
    log('listening on ' + addr.address + ':' + addr.port);
    if (callback) callback(null, server);
  });

};

function log(s) {
  if (global.shell) {
    global.shell.echo(s);
  } else {
    console.log(s);
  }
}
 
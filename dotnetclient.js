module.exports = function (data, callback) {    
    var net = require('net');
    var urlParse = require('url').parse;
    var WebSocket = require('hyco-websocket');
    var WebSocketServer = require('hyco-websocket').relayedServer;

    
    var wsServer = new WebSocketServer({
        server: WebSocket.createRelayListenUri(data.ns, data.path),
        token: function () {
            return WebSocket.createRelayToken('https://' + data.ns, data.keyrule, data.key);
        }
    });
  
    wsServer.on('request', function (request) {
        var url = urlParse(request.resource, true);
        var args = url.pathname.split('/').slice(1);
        var action = args.shift();
        var params = url.query;
        data.onMessage(request, function(err, res){
            
        });
        console.log(request);
        // if (action == 'tunnel') {
        console.log('tunnel');
        //createTunnel(request, params.port, params.host);
        createTunnel(request, data.port, data.host);
        /* } else {
           request.reject(404);
         }*/
    });


    function createTunnel(request, port, host) {
        console.log('authentictted');
        // if (!authenticate(request.httpRequest)) {

        //   request.reject(403);
        //   return;
        // }
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
} 
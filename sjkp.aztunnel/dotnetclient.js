// var ns = argv._[0];
// var path = argv._[1];
// var keyrule = argv._[2];
// var key = argv._[3];
// var host = argv._[4];
// var port = argv._[5];

module.export = function (ns, path, keyrule, key, host, port) {
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
} 
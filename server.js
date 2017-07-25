var https = require('https');
var tunnel = require('./lib/tunnel');
var WebSocket = require('hyco-websocket');

var argv = require('optimist').argv;


var ns = process.env.RELAYNAMESPACE;
var path = process.env.RELAYPATH;
var keyrule = process.env.RELAYRULENAME;
var key = process.env.RELAYKEY;

var host = process.env.PORT;

var credentials, tunnels = [];

if ((!ns && !path && !keyrule && !host)) {
  if (argv._.length < 4) {
    console.log('connect.js [namespace] [path] [key-rule] [key] [port]')
    process.exit(1);
  }
  else {
    ns = argv._[0];
    path = argv._[1];
    keyrule = argv._[2];
    key = argv._[3];
    host = argv._[4];
  }
}

var server = WebSocket.createRelaySendUri(ns, path);
var token = WebSocket.createRelayToken('https://' + ns, keyrule, key);

tunnel.createTunnel(server, token, host, function (err, server) {
  if (err) {
    log(String(err));
  } else {
    var id = tunnels.push(server);
    log('Tunnel created with id: ' + id);
  }
});


log('Remote Host: ' + ns);



function log(s) {
  if (global.shell) {
    global.shell.echo(s);
  } else {
    console.log(s);
  }
}
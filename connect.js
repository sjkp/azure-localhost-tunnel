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
  if (argv._.length < 4)
  {
  console.log('connect.js [namespace] [path] [key-rule] [key] [hostport]')
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

//var shell = global.shell = require('./lib/shell');

 tunnel.createTunnel(server, token, host, function(err, server) {
      if (err) {
        log(String(err));
      } else {
        var id = tunnels.push(server);
        log('Tunnel created with id: ' + id);
      }
      //shell.prompt();
    });

// shell.on('command', function(cmd, args) {
//   if (cmd == 'help') {
//     shell.echo('Commands:');
//     shell.echo('tunnel [localhost:]port [remotehost:]port');
//     shell.echo('close [tunnel-id]');
//     shell.echo('exit');
//     shell.prompt();
//   } else
//   if (cmd == 'tunnel') {
   
//   } else
//   if (cmd == 'close') {
//     var id = parseInt(args[0], 10) - 1;
//     if (tunnels[id]) {
//       tunnels[id].close();
//       tunnels[id] = null;
//       shell.echo('Tunnel ' + (id + 1) + ' closed.');
//     } else {
//       shell.echo('Invalid tunnel id.');
//     }
//     shell.prompt();
//   } else
//   if (cmd == 'exit') {
//     shell.exit();
//   } else {
//     shell.echo('Invalid command. Type `help` for more information.');
//     shell.prompt();
//   }
// });

log('WebSocket Tunnel Console v0.1');
log('Remote Host: ' + ns);

// authenticate(function() {
//   shell.prompt();
// });

// function authenticate(callback) {
//   shell.prompt('Username: ', function(user) {
//     shell.prompt('Password: ', function(pw) {
//       credentials = user + ':' + pw;
//       callback();
//     }, {passwordMode: true});
//   });
// }


function log(s) {
  if (global.shell) {
    global.shell.echo(s);
  } else {
    console.log(s);
  }
}
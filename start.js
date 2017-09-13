var sys = require('util')
var exec = require('child_process').exec;

var exporterService = require('./exporter.js');
var address = process.argv[2];
var block = process.argv[3];
var wallet = process.argv[4];
process.setMaxListeners(0);

try {
    var exporter = new exporterService(address, block, wallet, exec);
} catch(e) {
    alert('error: ' + e.name + ":" + e.message + "\n" + e.stack);
    throw e;
}

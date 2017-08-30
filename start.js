var sys = require('util')
var exec = require('child_process').exec;

var exporterService = require('./exporter.js');
var address = process.argv[2];
var block = process.argv[3];
var wallet = process.argv[4];
process.setMaxListeners(0);

var exporter = new exporterService(address, block, wallet, exec);

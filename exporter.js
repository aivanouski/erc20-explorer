var async = require('async');
var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
function getWallet() {
    try {
        return require('fs').readFileSync("./wallet.json", "utf8").trim();
    } catch (err) {
        return "";
    }
}

var exporter = function (address, block, wallet, exec) {
    var self = this;

    self.web3 = new Web3();
    self.provider = new HDWalletProvider(getWallet(), 'QWEpoi123', 'https://mainnet.infura.io/');
    self.web3.setProvider(self.provider);
    self.erc20ABI = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];

    self.contract = self.web3.eth.contract(self.erc20ABI).at(address); //PASS Contract address here
    self.allEvents = self.contract.Transfer({fromBlock: block, toBlock: "latest"}); //PASS Block to start here
    self.newEvents = self.contract.Transfer();

    // Processes new events
    self.newEvents.watch(function (err, log) {
        if (err) {
            console.log("Error receiving new log:", err);
            return;
        }


        if (log.event === "Transfer") {
            if (log.args._to == wallet) {
                console.log("New log received:", log);
                console.log(JSON.stringify(log));
                console.log("exec: php ../yii api-transaction/tokens '" + JSON.stringify(log) + "'");
                exec("php ../yii api-transaction/tokens '" + JSON.stringify(log) + "'", function (err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(stdout);
                });
            }
        }
    });

    // Retrieves historical events and processed them
    self.allEvents.get(function (err, logs) {
        console.log("Historical events received");
        if (err) {
            console.log("Error receiving historical events:", err);
            return;
        }

        logs.forEach(function (log) {
            if (log.event === "Transfer") {
                if (log.args._to == wallet) {
                    exec("php ../yii api-transaction/tokens '" + JSON.stringify(log) + "'", function (err, stdout, stderr) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(stdout);
                    });
                }
            }
        })
    });

    console.log("Exporter initialized, waiting for historical events...");
};

module.exports = exporter;
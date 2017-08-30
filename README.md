# ERC20-Exporter
### Lightweight explorer for ERC20 based Ethereum tokens

ERC20-Exporter is an explorer built with NodeJS, Express and Parity. It does not require an external database and retrieves all information on the fly from a backend Ethereum node.

## Getting started

1. npm install
2. edit start.js
3. node start.js

Please note that for large tokens the initial data export can take up to 30 minutes. Once completed it is recommended to change the exportStartBlock parameter in the config file to a block number that is around 30.000 blocks behind the current tip of the chain and restart the exporter.

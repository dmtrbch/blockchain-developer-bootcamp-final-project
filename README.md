# Final project - RoulETH

## Deployed version url

https://61a3e98960728c67faa57e97--rouleth.netlify.app/

## Project Description

Decentralized Application that allows the user to deposit/withdraw funds, to/from the casino, and place bets, depending if the number chosen by the roulette is red or black.
User must deposit a funds first in order to be able to place bets. 
If the user wins he gets betAmount*2 (the coefficient on betting on black or red is 2), and the same amount is withdrawn from the Casino reserve. 
In the opposite case the the funds are deposited to the Casino reserve and withdrawn from the user.

For generating a random number we are using Chainlink VRF as a source of randomness.
Please be aware that it takes time for the bet to be processed, since the generation of the number is a separate transaction. 
Sometimes it might take up to 2 minutes.

This is a European style roulette which means there are 37 numbers, from 0 to 36, with only one 0.
This project is scafolded using "truffle unbox react".

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed on the Kovan testnet.
- `migrations`: Migration files for deploying the contracts from `contracts` directory.
- `test`: Unit tests for the smart contract Rouleth.sol.

## Installing dependencies

- Node.js v16.13.0
- Truffle v5.4.19 (npm i -g truffle)
- HDWallet provider (npm i @truffle/hdwallet-provider)
- ChainLink contracts (npm i @chainlink/contracts)
- OpenZeppelin contracts (npm i @openzeppelin/contracts)

## Running the project locally

- Install MetaMask.
- Change the network to Kovan Test Network (you might need to turn Show/Hide test networks in MetaMask to be able to change to Kovan).
- Import LINK token on Kovan (Token Contract Address: )
- Go to https://faucets.chain.link/kovan?_ga=2.192180079.492937002.1638112081-623395727.1637539020 and send yourself some LINK (and ETH).
- Clone this repo.
- Navigate to the project directory.
- Create .secret file inside the main project directory and copy the mnemonic (seed phrase) from MetaMask to this file.
- Run "npm install".
- Run "truffle develop"
- Inside the truffle(develop) console, run "compile".
- Note that this application can not be tested on a local development network or Ganache, this is because of the use of Chainlink VRF Contract. More info here: https://docs.chain.link/docs/faq/#can-i-use-a-local-chainlink-node-with-ganache.
- Create new ethereum project on infura.io. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Go to the Settings of the project in Infura.io, change the endpoint to Kovan and copy the https link. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Inside truffle-config.js file, paste the copied link from Infura to the infuraURL variable. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Inside getWeb3.js file, on line 29 change "http://127.0.0.1:8545" with the copied link from Infura. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Open new terminal (I am using PowerShell) & navigate to the project directory. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Run "truffle migrate --reset --network kovan". (For migration and deploying new version of the contract on Kovan testnet, not required)
- Copy the contract address for the Rouleth contract, it will be shown in the terminal. (For migration and deploying new version of the contract on Kovan testnet, not required)
- Open MetaMask and send some LINK to the contract address you've just copied (this is important since the Chainlik VRF requires a service fee everytime random number is generated), we must have some LINK in our contract. (For migration and deploying new version of the contract on Kovan testnet, not required)
- To add some ETH to the contract (casinoReserve), navigate to the project directory.
- In the terminal (main project directory) run "truffle console --network kovan", from the Truffle console run "let rInstance = await Rouleth.deployed()" & lastly run "rInstance.topUpCasinoReserve({ from: accounts[0], value: '1000000000000000000' })".
- Open new terminal navigate to the project directory & after that navigate to the "client" folder.
- Inside the "client" folder, run "npm install" & after that run "npm install react-scripts --save".
- From the "client" folder run "npm run start" & your application should start running on http://localhost:3000/.

## Additional Information for running the project locally

- When running the truffle (truffle develop, truffle compile, truffle test, truffle console) commands, run them from the Visual Studio Code terminal.
- When running the migration script (truffle migrate --reset --network kovan), open up new terminal (PowerShell), navigate to the project directory and run the command from there. This is because there was an issue running this command from VSC.
- When running the frontend (npm run start), open up new terminal (PowerShell), navigate to the project client directory and run the command from there.

## Running the unit tests for the project

 - Navigate to the project directory.
 - Run "truffle develop".
 - From the truffle(develop) console run "test".

## Public Ethereum wallet for certification

`0x2202146408E03d7209CA38CC4bB060Ce6197Cc01`

## Screencast walking through the project



# Final project - RoulETH

## Deployed version url

https://61a3e98960728c67faa57e97--rouleth.netlify.app/

## Project Description

Decentralized Application that allows the user to deposit/withdraw funds, to/from the casino, and place bets, depending on the number chosen by the roulette (whether it's red or black).

NOTE: Only the Owner of the contract can add funds to the Casino Reserve

User must deposit funds first in order to be able to place bets. 
If the user wins he gets betAmount*2 (the coefficient on betting on black or red is 2), and the same amount is withdrawn from the Casino reserve. 
In the opposite case the the funds are deposited to the Casino reserve and withdrawn from the user.

For generating a random number we are using Chainlink VRF as a source of randomness. We pay a service fee to the Chainlink Oracle everytime number is generated.
Please be aware that it takes time for the bet to be processed, since the generation of the number is a separate transaction handled by ChainLink. 
Sometimes it might take up to 2-3 minutes.

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

- NOTE: Points 2 through 4 and 10 through 15 are not required, but we need them in case we want to redeploy the contract and be able to deposit funds to the casinoReserve (become an owner of the casino).

1. Install MetaMask.
2. Change the network to Kovan Test Network (you might need to turn on Show/Hide test networks in MetaMask to be able to change to Kovan).
3. Import LINK token on Kovan Test Network (Token Contract Address: 0xa36085F69e2889c224210F603D836748e7dC0088).
4. Go to https://faucets.chain.link/kovan?_ga=2.192180079.492937002.1638112081-623395727.1637539020 and send yourself some LINK (and ETH).
5. Clone this repo.
6. Navigate to the project directory.
7. Run "npm install".
8. Create .secret file inside the main project directory and copy the mnemonic (seed phrase) from MetaMask to this file.
9. This application can not be tested on a local development network or Ganache, this is because of the use of Chainlink VRF Contract. More info here: https://docs.chain.link/docs/faq/#can-i-use-a-local-chainlink-node-with-ganache.
10. Open new terminal (CMD, PowerShell...) & navigate to the project directory.
11. Run "truffle migrate --reset --network kovan". This is not required, it should be run only if one wants to redeploy the contract and be able to add funds to the casino reserve. If this is skipped, go directly to point 15).
12. Copy the contract address for the Rouleth contract, it will be shown in the terminal.
13. Open MetaMask and send some LINK to the contract address you've just copied (this is important since the Chainlik VRF requires a service fee everytime random number is generated), we must have some LINK in our contract.
14. To add some ETH to the contract (casinoReserve), navigate to the project directory.
15. In the terminal (main project directory) run "truffle console --network kovan", from the Truffle console run "let rInstance = await Rouleth.deployed()" & lastly run "rInstance.topUpCasinoReserve({ from: accounts[0], value: '1000000000000000000' })".
16. Open new terminal navigate to the project directory & after that navigate to the "client" folder.
17. From the "client" folder run "npm install" & after that run "npm install react-scripts --save".
18. From the "client" folder run "npm run start" & your application should start running on http://localhost:3000/.

## Additional Information for running the project locally

- When running the truffle (truffle develop, truffle compile, truffle test, truffle console) commands, run them from the Visual Studio Code terminal.
- When running the migration script (truffle migrate --reset --network kovan), open up new terminal (PowerShell), navigate to the project directory and run the command from there. This is because there might be an issue running this command from VSC.
- When running the frontend (npm run start), open up new terminal (PowerShell), navigate to the project client directory and run the command from there.

## Running the unit tests for the project

 - Navigate to the project directory.
 - Run "truffle develop".
 - From the truffle(develop) console run "test".

## Environment variables

const infuraURL = 'https://kovan.infura.io/v3/8a0dace21eb24ff791487262cea3b2c3'

## Public Ethereum wallet for certification

`0x2202146408E03d7209CA38CC4bB060Ce6197Cc01`

## Screencast walking through the project

https://www.loom.com/share/f9c2bd8598ea4517bba2e4c1515db34f

Video is shortened. Bet might be in progress for 2+ minutes due to the generation of random number by Chainlink VRF

## TODO & future improvements

- Add functionality to bet on specific number
- Add functionality to bet on odd or even number
- Add functionality to place multiple bets in one game round
- Add functionality for the gambler to top up casino reserve (add liquidity to the casino) and get rewards
- Bets to be placed with native casino token (ERC-20) instead of ETH


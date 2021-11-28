import React, { Component } from "react";
import RoulethContract from "./contracts/Rouleth.json";
import Web3 from "web3";
import BetModal from "./BetModal";
import TransactionModal from "./TransactionModal";
import ResultModal from "./ResultModal";

import "./App.css";

class App extends Component {
  isNumberRed = [false, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, true, false, true, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, true, false, true];
  state = { 
    web3: null,
    accounts: null,
    contract: null,
    casinoReserve: null,
    casinoOwner: null,
    fundsOverview: null,
    depositWithdrawAmount: '',
    betAmount: '',
    colorChoice: null,
    betInProgress: false,
    transactionPending: false,
    resultPending: false,
    resultText: ''
  };

  connectWallet = async () => {
    try {
      const web3 = new Web3(window.ethereum);
    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      let networkId = await web3.eth.net.getId();
      if(networkId !== 42) {
        try {
          await web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2a" }]
          });
          networkId = 42;
        } catch (error) {
          alert(error.message)
        }
      }
    
      const deployedNetwork = RoulethContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RoulethContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance }, this.runRouleth);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
    }
  }

  runRouleth = async () => {
    const { web3, accounts, contract } = this.state;

    const casinoReserve = await contract.methods.casinoReserve().call();
    this.setState({ casinoReserve: web3.utils.fromWei(casinoReserve) });

    const fundsOverview = await contract.methods.fundsOverview(accounts[0]).call();
    this.setState({ fundsOverview: web3.utils.fromWei(fundsOverview) });

    const casinoOwner = await contract.methods.owner().call();
    this.setState({ casinoOwner: casinoOwner });
  }

  deposit = async () => {
    const { web3, accounts, contract } = this.state;

    let walletBalance = await web3.eth.getBalance(accounts[0]);
    walletBalance = web3.utils.fromWei(walletBalance)
 
    let depositAmount = web3.utils.toWei(this.state.depositWithdrawAmount);

    if(( walletBalance - this.state.depositWithdrawAmount) < 0) {
      this.setState({depositWithdrawAmount: ''});
      alert('Go easy Gambler, you don\'t have enough ETH in your MetaMask wallet, lower the amount you want to deposit!!!');
      return;
    }
    this.setState({depositWithdrawAmount: ''});

    this.showTransactionModal();
    try {
      await contract.methods.depositFunds().send({ from: accounts[0], value: depositAmount });
      
      const fundsOverview = await contract.methods.fundsOverview(accounts[0]).call();
      this.setState({ fundsOverview: web3.utils.fromWei(fundsOverview) });
      
      this.hideTransactionModal();
    } catch {
      this.hideTransactionModal();
      alert('Transaction Failed or Canceled by Gambler');
    }
  }

  withdraw = async () => {
    const { web3, accounts, contract } = this.state;

    let withdrawAmount = web3.utils.toWei(this.state.depositWithdrawAmount);

    if(this.state.fundsOverview - this.state.depositWithdrawAmount < 0) {
      this.setState({depositWithdrawAmount: ''});
      alert('Go easy Gambler, you don\'t have enough ETH in the Casino, lower the amount you want to withdraw!!!');
      return;
    }
    this.setState({depositWithdrawAmount: ''});

    this.showTransactionModal();
    try {
      await contract.methods.withdrawFunds(withdrawAmount).send({ from: accounts[0] });
      
      const fundsOverview = await contract.methods.fundsOverview(accounts[0]).call();
      this.setState({ fundsOverview: web3.utils.fromWei(fundsOverview) });

      this.hideTransactionModal();
    } catch {
      this.hideTransactionModal();
      alert('Transaction Failed or Canceled by Gambler');
    }
  }

  placeBet = async () => { 
    const { web3, accounts, contract } = this.state;

    let betAmount = web3.utils.toWei(this.state.betAmount);

    if(this.state.fundsOverview - this.state.betAmount < 0) {
      this.setState({betAmount: ''});
      this.setState({colorChoice: null});
      alert('Go easy Gambler, you don\'t have enough deposits in the Casino to place such a bet. Deposit some ETH first, or lower the bet!!!');
      return;
    }

    if(this.state.casinoReserve - this.state.betAmount*2 < 0) {
      this.setState({betAmount: ''});
      this.setState({colorChoice: null});
      alert('Calm down Gambler, the Casino doesn\'t have enough reserves to pay if you win the bet. Please lower the bet or wait for the reserves to be filled up!!!');
      return;
    }

    this.setState({betAmount: ''});

    this.showTransactionModal();
    try {
      await contract.methods.placeBetOnColor(this.state.colorChoice, betAmount).send({ from: accounts[0] });
      this.hideTransactionModal();
      this.showBetModal();

      contract.events.BetFinished()
        .on('data', async (event) => {
          let resultText = '';
          let resultColor = this.isNumberRed[event.returnValues.result] ? "Red" : "Black";
          if(event.returnValues.result == 0) {
            resultText = 'RoulETH number is 0. It is neither Red or Black. Sorry you lost :(';
          }
          else if(this.state.colorChoice == this.isNumberRed[event.returnValues.result]) {
            resultText = `RoulETH number is ${event.returnValues.result} ${resultColor}. Congratulations you won :)`;
          } else {
            resultText = `RoulETH number is ${event.returnValues.result} ${resultColor}. Sorry you lost :(`;
          }

          this.setState({ resultText: resultText });
          resultText = '';
          resultColor = '';
          this.hideBetModal();
          this.showResultModal();

          const casinoReserve = await contract.methods.casinoReserve().call();
          this.setState({ casinoReserve: web3.utils.fromWei(casinoReserve) });
        
          const fundsOverview = await contract.methods.fundsOverview(accounts[0]).call();
          this.setState({ fundsOverview: web3.utils.fromWei(fundsOverview) });
        
          this.setState({colorChoice: null});
          setTimeout(() => {this.hideResultModal()}, 7000);
        })
        .on('error', err => {
          console.log(err);
        })
    } catch {
      this.hideTransactionModal();
      alert('Transaction Failed or Canceled by Gambler');
    }
  }

  showBetModal = () => {
    this.setState({ betInProgress: true });
  }

  hideBetModal = () => {
    this.setState({ betInProgress: false })
  }

  showTransactionModal = () => {
    this.setState({ transactionPending: true });
  }

  hideTransactionModal = () => {
    this.setState({ transactionPending: false })
  }

  showResultModal = () => {
    this.setState({ resultPending: true });
  }

  hideResultModal = () => {
    this.setState({ resultPending: false });
  }

  updateDepositWithdrawInputAmount(evt) {
    this.setState({
      depositWithdrawAmount: evt.target.value
    });
  }

  updateBetInputAmount(evt) {
    this.setState({
      betAmount: evt.target.value
    });
  }

  chooseColor = (value) => {
    this.setState({
      colorChoice: value
    });
  }

  render() {
    if(typeof window.ethereum === 'undefined') {
      return (
        <div className="App">
          <div className="Container">
          <h2>MetaMask is not detected... Please install MetaMask to be able to access the Dapp!</h2>
          </div>
        </div>
      )
    }
    else if (!this.state.web3) {
      return (
        <div className="App">
          <header className="Header">
            <div className="Header-container">
              <div className="Header-items-left">
                <div>
                  <h1 className="Header-name">RoulETH</h1>
                </div>
              </div>
              <div className="Header-items-right">
                <div className="Header-login">
                  <div className="Button-login">
                    <button onClick={this.connectWallet} className="Login">
                      <span className="Connect">
                        Connect Wallet
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="Container">
            <h2>Connect your MetaMask wallet to be able to interact with the Dapp!</h2>
          </div>
        </div>
      )
    } else {
      return (
        <div className="App">
          <header className="Header">
            <div className="Header-container">
              <div className="Header-items-left">
                <div>
                  <h1 className="Header-name">RoulETH</h1>
                </div>
              </div>
              <div className="Header-items-right">
                <div className="Header-login">
                  <div className="Button-login">
                    <button className="Login">
                      <span className="Connect">
                      {this.state.accounts[0]}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="Container">          
            <div className="tw-flex">
              <div className="tw-split-width">
                <div className="tw-rounded">
                  <div className="tw-text-center">
                    <div className="tw-header">
                      Funds Overview
                    </div>
                    <div className="tw-content">
                      {this.state.fundsOverview} ETH
                    </div>
                    <div className="tw-flex mt-2">
                      <div className="tw-input-wrapper">
                        <input 
                          value={this.state.depositWithdrawAmount} 
                          onChange={evt => this.updateDepositWithdrawInputAmount(evt)} 
                          type="number" className="tw-input" 
                          placeholder="Enter Amount"
                        />
                        <div className="tw-input-append">
                          <span className="tw-input-flex">
                            <span className="eth-symbol">ETH</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="tw-buttons mt-1">
                      <button 
                        onClick={this.deposit} 
                        disabled={!this.state.depositWithdrawAmount} 
                        className="tw-btn-trade tw-btn-deposit"
                      >
                        Deposit
                      </button>
                      <button 
                        onClick={this.withdraw} 
                        disabled={!this.state.depositWithdrawAmount} 
                        className="tw-btn-trade tw-btn-withdraw"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tw-split-width">
                <div className="tw-rounded">
                  <div className="tw-text-center">
                    <div className="tw-header">
                      Casino Reserve
                    </div>
                    <div className="tw-content">
                        {this.state.casinoReserve} ETH
                    </div>
                    <div className="tw-header mt-1">
                      Casino Owner
                    </div>
                    <div className="tw-content tw-owner">
                        {this.state.casinoOwner}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex">
              <div className="Bet-header">
                Pick A Color
              </div>
            </div>
            <div className="tw-flex justify-center mt-2">
              <div 
                onClick={() => this.chooseColor(0)}
                className={this.state.colorChoice == 0 ? 'tw-color black mr-1 choosed': 'tw-color black mr-1'} 
              >
              </div>
              <div 
                onClick={() => this.chooseColor(1)}
                className={this.state.colorChoice == 1 ? 'tw-color red ml-1 choosed': 'tw-color red ml-1'} 
              >
              </div>
            </div>
            <div className="tw-flex mt-2">
              <div className="tw-input-wrapper">
                <input
                  value={this.state.betAmount} 
                  onChange={evt => this.updateBetInputAmount(evt)} 
                  type="number" 
                  className="tw-input" 
                  placeholder="Enter Amount"/>
                <div className="tw-input-append">
                  <span className="tw-input-flex">
                    <span className="eth-symbol">ETH</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="tw-flex mt-2">
              <button 
                onClick={this.placeBet}
                disabled={!this.state.betAmount || this.state.colorChoice === null} 
                className="tw-btn-trade tw-btn-placebet"
              >
                Place your Beth
              </button>
            </div>
            <BetModal onClose={this.hideBetModal} show={this.state.betInProgress} />
            <TransactionModal onClose={this.hideTransactionModal} show={this.state.transactionPending} />
            <ResultModal resultText={this.state.resultText} onClose={this.hideResultModal} show={this.state.resultPending} />
          </div>
        </div>
      );
    }
  }
}

export default App;

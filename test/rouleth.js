const Rouleth = artifacts.require("Rouleth");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Rouleth", (accounts) => {
  describe("Initial deployment", async () => {

    it("should assert true", async function () {
      await Rouleth.deployed();
      assert.isTrue(true);
    });

    it("Rouleth contract was deployed and casinoReserve intial value is 0", async () => {

      const rInstance = await Rouleth.deployed();

    
      const casinoReserve = await rInstance.casinoReserve.call();
      assert.equal(casinoReserve, 0, `casinoReserve should be zero`);
    });

    it("Should return the owner of the Casino", async () => {
      const rInstance = await Rouleth.deployed();

      const owner = await rInstance.owner.call();

      assert.equal(owner, accounts[0], `Could not retrieve owner`);
    });

  });


  describe("Functionality", () => {

    it("Casino should not let anyone else other than the owner to top up casinoReserve", async () => {
      const rInstance = await Rouleth.deployed();

      const badJoe = accounts[1];
      try {
        await rInstance.topUpCasinoReserve({ from: badJoe, value: '1000000000000000000' });
      } catch (err) {}

      const casinoReserve = await rInstance.casinoReserve.call();
      assert.equal(casinoReserve, 0, `Only owner should be able to top up casinoReserve`);
    });

    it("Owner should be able to deposit 4 ETH to the casinoReserve", async () => {

      const rInstance = await Rouleth.deployed();

      await rInstance.topUpCasinoReserve({ from: accounts[0], value: '4000000000000000000' });

      let casinoReserve = await rInstance.casinoReserve.call();
      casinoReserve = web3.utils.fromWei(casinoReserve)
      assert.equal(casinoReserve, '4', `4 ETH was not deposited to the casinoReserve!`);
    });

    it("Gambler should be able to withdraw funds from the Casino", async () => {

      const rInstance = await Rouleth.deployed();

      let ammount = '4000000000000000000';

      await rInstance.depositFunds({ from: accounts[3], value: ammount });

      await rInstance.withdrawFunds(ammount, { from: accounts[3] });

      let fundsOverview = await rInstance.fundsOverview.call(accounts[3]);
      fundsOverview = web3.utils.fromWei(fundsOverview)
      assert.equal(fundsOverview, 0, `Gambler did not withdraw funds from the Casino`);
    });

    it("Gambler should be able to deposit funds in the Casino", async () => {

      const rInstance = await Rouleth.deployed();

      await rInstance.depositFunds({ from: accounts[3], value: '4000000000000000000' });

      let fundsOverview = await rInstance.fundsOverview.call(accounts[3]);
      fundsOverview = web3.utils.fromWei(fundsOverview)
      assert.equal(fundsOverview, '4', `4 ETH was not successfully deposited to the gambler with address: ${accounts[3]}`);
    });

    it("Gambler should not be able to withdraw more funds than he/she has in the Casino", async () => {

      const rInstance = await Rouleth.deployed();

      let ammount = '4000000000000000000';

      await rInstance.depositFunds({ from: accounts[3], value: ammount });

      let fundsBeforeWithdraw = await rInstance.fundsOverview.call(accounts[3]);

      try {
        let biggertWithdraw = '40000000000000000000'
        await rInstance.withdrawFunds(biggertWithdraw, { from: accounts[3] });
      } catch (err) {}

      let fundsAfterWithdraw = await rInstance.fundsOverview.call(accounts[3]);

      assert.equal(fundsBeforeWithdraw.toString(), fundsAfterWithdraw.toString(), `Gambler was able to withdraw more than what he/she has in the Casino!`)
    });

    it("Gambler should not be able to deposit more funds than he/she has in the wallet", async () => {

      const rInstance = await Rouleth.deployed();

      let fundsBeforeDeposit = await rInstance.fundsOverview.call(accounts[3]);
      let tooBiggAmmount = '400000000000000000000000'

      try {
        await rInstance.depositFunds({ from: accounts[3], value: tooBiggAmmount });
      } catch (err) {}

      let fundsAfterDeposit = await rInstance.fundsOverview.call(accounts[3]);

      assert.equal(fundsBeforeDeposit.toString(), fundsAfterDeposit.toString(), `Gambler was able to deposit more than what he/she has in the wallet!`)
    });

    /**
    * I was not sure how to test the placeBetOnColor function, since I am using
    * Chainlink VRF and I don't know the result beforehand.
    * I don't change any of the state variables inside this function, so I am not sure
    * what can I use in assert.equal to compare with.
    * Any suggestion is appreciated.
    */
  });
});

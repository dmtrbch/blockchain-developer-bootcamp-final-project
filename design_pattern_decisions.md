# Design patterns

## Access Control Design Patterns

- `Ownable` design pattern is used in `topUpCasinoReserve()`. This means that only the owner of the contract will be able to deposit funds in the Casino Reserve

## Inheritance and Interfaces

- `Rouleth` contract inherits the OpenZeppelin `Ownable`, OpenZeppelin `ReentrancyGuard` and ChainLink `VRFConsumerBase`.

## Inter-Contract execution

- Inside `Rouleth` we make a call to `requestRandomness()` and `fulfillRandomness()` functions which are part of the `VRFConsumerBase.sol` contract.

## Oracles

- `Rouleth` contract uses the ChainLink VRF oracle for securely generating random numbers.
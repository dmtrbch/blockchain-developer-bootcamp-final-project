# Avoiding Common Pitfalls & Attacks

## Re-entrancy

`withdrawFunds()` is protected with OpenZeppelin `ReentrancyGuard`'s `nonReentrant` modifier.

## Modifiers used only for validation

All modifiers in contract(s) only validate data with `require` statements.

## Pull over push

All functions that modify state are based on receiving calls rather than making contract calls.
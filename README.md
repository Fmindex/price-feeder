# price-feeder

### Overview

A scheduled function which keep the price in oracle contract updated.

#### Key concepts

- The function will periodically fetch current price from oracle contract and determine whether we need to update the price in oracle or not.

- The logic is separated to be modules (`priceClient`, `terraClient`, `oracleService`, `priceFeeder`). all the modules will be injected to `priceFeeder` as its dependencies. When we want to test the service, we can inject the mocked service instead.

### Quick Start

1. Install: `yarn`
2. Run: `yarn start`
3. Test: `yarn test`

### how to add new symbol

in the `src/feeder.ts`, add new symbol to `symbols`

### Potential improvement plans

1. Make symbols to be configurable.
2. Add logging service to keep the error, warning and info logs.
3. If we have logs, we can have the alarm to alert us when the API call's error rate is too high. Or some logic errors are too high.
4. Create env for it (dev, prod) so we can make all the configs to be env (chainUrl, chainID, contractAddress, wallet keys, Price server endpoint)
5. Can add some integrate test or even more unit test cases.
6. Code coverage, Linter, and CI/CD are also good to be added.
7. Can dockerize it to make local testing portable for others.
8. Add alarm to check if the feeder is still running even if no error logs. (can implement health check service/have another metric to check if there is no executing logs for a long time)

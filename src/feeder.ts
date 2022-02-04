import { Price } from "./client/price";
import { Oracle } from "./service/oracle";

// IMPROVEMENT: add this symbols to config
const symbols = ["BTC", "LUNA", "ETH"];
const updatingThreshold = 0.1;

export async function executeFeeder(
  priceClient: Price,
  oracleClient: Oracle
): Promise<void> {
  try {
    console.log("\nfeed price start to execute");

    // get existing price in contract
    const prices = await priceClient.getPrice();

    // run updatePrice asynchronously
    updatePrice(oracleClient, prices);
  } catch (e) {
    // IMPROVEMENT: add alarm if error late is too high
    console.log((e as Error).message);
  }
}

async function updatePrice(oracleClient: Oracle, prices: any): Promise<void> {
  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        // get current price from contract
        const oldPrice = await oracleClient.getCurrentPrice(symbol);

        // skip if the symbol is not available from price server
        if (!prices[symbol]) return;

        console.log(
          `update ${symbol} from old = ${oldPrice} to new = ${prices[symbol]}`
        );

        // if existing price > 0, need to check different percentage
        if (oldPrice > 0.0) {
          let diff = Math.abs(prices[symbol] - oldPrice);
          let percent = (diff / oldPrice) * 100.0;
          console.log(`diff is ${percent}%`);

          // if diff <= 0.1%, no need to update
          if (percent <= updatingThreshold) return;
        }

        // update price in contract
        console.log(`update is executed`);
        await oracleClient.updatePrice(symbol, prices[symbol]);
      } catch (e) {
        // IMPROVEMENT: add alarm if error late is too high
        console.log((e as Error).message);
      }
    })
  );
}

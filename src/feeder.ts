import { Price } from "./client/price";
import { Oracle } from "./service/oracle";

// IMPROVEMENT: add this currencies to config
const currencies = ["BTC", "LUNA", "ETH"];

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
    currencies.map(async (currency) => {
      try {
        // get current price from contract
        const oldPrice = await oracleClient.getCurrentPrice(currency);

        // skip if the symbol is not available from price server
        if (!prices[currency]) return;

        console.log(
          `update ${currency} from old = ${oldPrice} to new = ${prices[currency]}`
        );

        // if existing price > 0, need to check different percentage
        if (oldPrice > 0.0) {
          let diff = Math.abs(prices[currency] - oldPrice);
          let percent = (diff / oldPrice) * 100.0;
          console.log(`diff is ${percent}%`);

          // if diff <= 0.1%, no need to update
          if (percent <= 0.1) return;
        }

        // update price in contract
        console.log(`update is executed`);
        await oracleClient.updatePrice(currency, prices[currency]);
      } catch (e) {
        // IMPROVEMENT: add alarm if error late is too high
        console.log((e as Error).message);
      }
    })
  );
}

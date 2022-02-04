
import { Price } from './client/price'
import { Oracle } from './service/oracle'

const currencies = ["BTC", "LUNA", "ETH"]

export async function executeFeeder(priceClient: Price, oracleClient: Oracle): Promise<void> {
    try {
      console.log("\nfeed price start to execute")
      const prices = await priceClient.getPrice()
      // run updatePrice asynchronously
      updatePrice(oracleClient, prices)
    } catch (e) {
      // IMPROVEMENT: add alarm if error late is too high
      console.log((e as Error).message)
    }
  }

  async function updatePrice(oracleClient: Oracle, prices: any): Promise<void> {
    await Promise.all(currencies.map(async(currency) => {
      try {
        const oldPrice = await oracleClient.getCurrentPrice(currency)
        if (!prices[currency]) return
        console.log(`update ${currency} from old = ${oldPrice} to new = ${prices[currency]}`)
        if (oldPrice > 0.0) {
          let diff = Math.abs(prices[currency] - oldPrice)
          let percent = diff / oldPrice * 100.0
          console.log(`diff is ${percent}%`)
          if (percent <= 0.1) return
        }
        console.log(`update is executed`)
        await oracleClient.updatePrice(currency, prices[currency])
      } catch (e) {
        console.log((e as Error).message)
      }
    }))
  }
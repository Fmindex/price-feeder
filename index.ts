import { Price } from './client/price'
import { LocalTerra } from './client/terra'
import { Oracle } from './service/oracle'

const currencies = ["BTC", "LUNA", "ETH"]
// IMPROVEMENT: add this to config
const oracleContractAddress = 'terra1tndcaqxkpc5ce9qee5ggqf430mr2z3pefe5wj6'

async function main(): Promise<void> {
  // define const
  const minutes = 1 / 2
  const interval = minutes * 60 * 1000

  // init
  const priceClient = new Price()
  const terra = new LocalTerra()
  const oracleClient = new Oracle(terra, terra.wallets.validator, oracleContractAddress)

  console.log("price feeder is running...")
  setInterval(async () => {
    try {
      console.log("\nfeed price start to execute")
      const prices = await priceClient.getPrice()

      // run updatePrice asynchronously
      updatePrice(oracleClient, prices)
    } catch (e) {
      // IMPROVEMENT: add alarm if error late is too high
      console.log((e as Error).message)
    }
  }, interval);
}

async function updatePrice(oracleClient: Oracle, prices: any): Promise<void> {
  await Promise.all(currencies.map(async(currency) => {
    try {
      const oldPrice = await oracleClient.getCurrentPrice(currency)
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

main()

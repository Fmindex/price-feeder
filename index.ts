import axios from "axios";

const currencies = ["BTC", "LUNA", "ETH"]

async function main(): Promise<void> {
  const minutes = 5
  const interval = minutes * 60 * 1000
  console.log("price feeder is running...")
  setInterval(async () => {
    try {
      console.log("\nfeed price start to execute")
      const prices = await getPrice()
      updatePrice(prices)
    } catch (e) {
      console.log((e as Error).message)
      // IMPROVEMENT: add alarm if error late is too high
    }
  }, interval);
}

async function getPrice(): Promise<any> {
  // IMPROVEMENT: add env for API endpoint
  const res = await axios.get("http://localhost:8888/latest")
  return res.data?.prices
}

async function updatePrice(prices: any): Promise<void> {
  await Promise.all(currencies.map(async(courrency) => {
    console.log(`update price ${courrency} to be ${prices[courrency]}`)
  }))
}

main()

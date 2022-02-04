import axios from "axios";

// IMPROVEMENT: add env for API endpoint
const host = "http://localhost:8888"

export class Price {
  public async getPrice(): Promise<any> {
    const res = await axios.get(`${host}/latest`)
    return res.data?.prices
  }
}

import axios from "axios";

const host = "http://localhost:8888"

export class Price {
  public async getPrice(): Promise<any> {
    // IMPROVEMENT: add env for API endpoint
    const res = await axios.get(`${host}/latest`)
    return res.data?.prices
  }
}

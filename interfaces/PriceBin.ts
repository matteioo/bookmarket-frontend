import type { Book } from "./Book";

export interface PriceBin {
  binRange: {
    min: number,
    max: number,
  },
  count: {
    active: number,
    inactive: number,
  },
}

export interface BookPriceBins {
  book: Book,
  offerStats: {
    totalCount: {
      active: number,
      inactive: number,
    },
    averagePrice: number,
    medianPrice: number,
  }
  priceBins: PriceBin[],
}
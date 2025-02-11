import type { Book } from "./Book";

export interface PriceBin {
  binRange: {
    min: number,
    max: number,
  },
  count: number,
}

export interface BookPriceBins {
  book: Book,
  priceBins: PriceBin[],
}
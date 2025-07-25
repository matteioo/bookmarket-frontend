import type { Seller } from "./Seller";
import type { Book } from "./Book";
import type { Member } from "./Member";

export interface Offer {
  id?: number;
  book: Book;
  price: number;
  seller: Seller;
  member?: Member;
  active: boolean;
  createdAt: Date;
  modified: Date;
  marked: boolean;
  location: string;
}
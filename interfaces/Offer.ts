import type { Seller } from "./Seller";

export interface Offer {
  id: number;
  seller: Seller;
  isbn: string;
  price: string;
  active: boolean;
  marked: boolean;
  location: string;
  member: number;
  createdAt: string;
  modified: string;
}
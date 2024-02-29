import type { Exam } from "./Exam";

export interface Book {
  isbn: string;
  title: string;
  authors: string;
  maxPrice: number;
  edition: string;
  publisher: string;
  exam: Exam | null;
}
import type { Exam } from "./Exam";

export interface Book {
  "isbn": string;
  "exam": Exam;
  "title": string;
  "authors": string;
  "maxPrice": string;
  "edition": string;
  "publisher": string;
}
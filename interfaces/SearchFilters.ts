export interface Filter<T> {
  active: boolean;
  value: T;
}

export interface PriceFilter {
  min: number | undefined;
  max: number | undefined;
}

export interface MarkedFilter {
  marked: boolean | undefined;
}

export interface ExamFilter {
  exam: string | undefined;
}
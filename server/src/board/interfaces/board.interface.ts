import { RegExForMongoose } from "src/common/interfaces/regex.interface";

export interface getFormListQuery {
  title?: string;
  category?: string;
  orderBy?: string;
  page?: string;
}

export interface SearchQuery {
  title?: string | RegExForMongoose;
  category?: string;
}

export interface SearchQueryForRepository {
  title?: string | RegExForMongoose;
  category?: string;
  on_board: boolean;
}

export interface SortQuery {
  orderBy?: "latestAsc" | "responseAsc" | "responseDesc";
}

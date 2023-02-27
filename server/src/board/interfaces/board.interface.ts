import { RegExForMongoose } from "src/common/interfaces/regex.interface";

export interface getFormListQuery {
  title?: string;
  category?: string;
  orderBy?: string;
  page?: string;
}

export interface SearchQuery {
  title?: string | RegExForMongoose;
  form_title?: string | RegExForMongoose;
  category?: string;
  form_category?: string;
}

export interface SearchQueryForRepository {
  form_title?: string | RegExForMongoose;
  form_category?: string;
  on_board: true;
}

export interface SortQuery {
  orderBy?: "latestAsc" | "responseAsc" | "responseDesc";
}

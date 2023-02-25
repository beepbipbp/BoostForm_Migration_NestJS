import { Injectable } from "@nestjs/common";
import { filterByObjectKeys } from "src/common/utils/filterByObjectKyes";
import { pipe } from "src/common/utils/pipe";
import { FormRepository } from "src/form/form.repository";
import { SEARCH_KEY_LIST, SORT_KEY_LIST } from "./consts/board.consts";
import { getFormListQuery, SearchQuery, SearchQueryForRepository, SortQuery } from "./interfaces/board.interface";
import { SortQueryForRepository } from "./types/board.type";

@Injectable()
export class BoardService {
  constructor(private readonly formRepository: FormRepository) {}

  async getFormList(query: getFormListQuery) {
    const searchQuery = filterByObjectKeys(query, SEARCH_KEY_LIST);
    const sortQuery = filterByObjectKeys(query, SORT_KEY_LIST);
    const pageNumber = query.page ? Number(query.page) : 1;

    const cacheKey = `board:${JSON.stringify(searchQuery)},${sortQuery}`;
    const pageCacheKey = `${cacheKey},{page:${pageNumber}}`;
    const countCacheKey = `${cacheKey},{count}`;

    const searchQueryForRepository = this.setSearchQueryOptions(searchQuery);
    const sortQueryForRepository = this.setSortQueryOptions(sortQuery);

    const formList = await this.formRepository.findFormListForBoard(
      searchQueryForRepository,
      sortQueryForRepository,
      pageNumber,
    );

    const formListForResponse = formList.map((form) => {
      return {
        formId: form._id,
        title: form.form_title,
        category: form.form_category,
        responseCount: form.response_count,
        acceptResponse: form.accept_response,
      };
    });
  }

  setOnBoard(searchQuery: SearchQuery) {
    return { ...searchQuery, on_board: true };
  }

  setCategory(searchQuery: SearchQuery) {
    if (searchQuery.category === "전체") {
      const newSearchQuery = searchQuery;
      delete newSearchQuery.category;
      return newSearchQuery;
    } else {
      return searchQuery;
    }
  }

  setTitleRegEx(searchQuery: SearchQuery) {
    if (!searchQuery.title) {
      return searchQuery;
    }
    const { title } = searchQuery;

    const titleRegEx = { $regex: `${title}`, $options: "i" };

    return { ...searchQuery, title: titleRegEx };
  }

  setSearchQueryOptions = pipe(this.setOnBoard, this.setCategory, this.setTitleRegEx);

  setSortQueryOptions(sortQuery: SortQuery) {
    const { orderBy } = sortQuery;
    switch (orderBy) {
      case "latestAsc":
        return "-createdAt";
      case "responseAsc":
        return "-response_count";
      case "responseDesc":
        return "response_count";
    }
  }
}

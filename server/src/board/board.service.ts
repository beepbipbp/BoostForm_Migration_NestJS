import { Injectable } from "@nestjs/common";
import { filterByObjectKeys } from "src/common/utils/filterByObjectKyes";
import { pipe } from "src/common/utils/pipe";
import { FormRepository } from "src/form/form.repository";
import { PAGE_SIZE, SEARCH_KEY_LIST, SORT_KEY_LIST } from "./consts/board.consts";
import { getFormListQuery, SearchQuery, SortQuery } from "./interfaces/board.interface";
import { RegExForMongoose } from "../common/interfaces/regex.interface";

@Injectable()
export class BoardService {
  constructor(private readonly formRepository: FormRepository) {}

  async getFormList(query: getFormListQuery) {
    const searchQuery = filterByObjectKeys(query, SEARCH_KEY_LIST);
    const sortQuery = filterByObjectKeys(query, SORT_KEY_LIST);
    const pageNumber = query.page ? Number(query.page) : 1;

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

    const totalCount = await this.formRepository.getTotalCountForBoard(searchQueryForRepository);
    const lastPage = Math.ceil(totalCount / PAGE_SIZE);

    return { form: formListForResponse, lastPage };
  }

  setOnBoard(searchQuery: SearchQuery) {
    return { ...searchQuery, on_board: true };
  }

  setCategory(searchQuery: SearchQuery) {
    const updatedSearchQuery = { ...searchQuery };

    if (updatedSearchQuery.category === "전체") {
      delete updatedSearchQuery.category;
      return updatedSearchQuery;
    } else {
      updatedSearchQuery.form_category = updatedSearchQuery.category;
      delete updatedSearchQuery.category;
      return updatedSearchQuery;
    }
  }

  setTitleRegEx(searchQuery: SearchQuery) {
    if (!searchQuery.title) {
      return searchQuery;
    }
    const { title } = searchQuery;
    const titleRegEx: RegExForMongoose = { $regex: `${title}`, $options: "i" };

    const updatedSearchQuery = { ...searchQuery };
    delete updatedSearchQuery.title;
    updatedSearchQuery.form_title = titleRegEx;

    return updatedSearchQuery;
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

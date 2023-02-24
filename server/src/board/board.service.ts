import { Injectable } from "@nestjs/common";
import { filterByObjectKeys } from "src/common/utils/filterByObjectKyes";
import { searchKeyList, sortKeyList } from "./consts/board.consts";
import { getFormListQuery } from "./interfaces/board.interface";

@Injectable()
export class BoardService {
  async getFormList(query: getFormListQuery) {
    const searchQuery = filterByObjectKeys(query, searchKeyList);
    const sortQuery = filterByObjectKeys(query, sortKeyList);
    const pageNumber = query.page ? Number(query.page) : 1;

    const cacheKey = `board:${JSON.stringify(searchQuery)},${sortQuery}`;
    const pageCacheKey = `${cacheKey},{page:${pageNumber}}`;
    const countCacheKey = `${cacheKey},{count}`;
  }
}

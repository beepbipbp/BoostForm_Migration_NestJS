import { Controller, Get, Query } from "@nestjs/common";
import { BoardService } from "./board.service";

@Controller("api/board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getFormList(@Query() query: any) {
    const result = await this.boardService.getFormList(query);

    return result;
  }
}

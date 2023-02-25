import { Module } from "@nestjs/common";
import { FormModule } from "src/form/form.module";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";

@Module({
  imports: [FormModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}

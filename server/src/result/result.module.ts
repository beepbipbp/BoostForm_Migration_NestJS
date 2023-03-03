import { Module } from "@nestjs/common";
import { FormResponseModule } from "src/form-response/form-response.module";
import { FormModule } from "src/form/form.module";
import { ResultController } from "./result.controller";
import { ResultService } from "./result.service";

@Module({
  imports: [FormModule, FormResponseModule],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}

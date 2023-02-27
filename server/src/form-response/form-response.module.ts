import { Module } from "@nestjs/common";
import { FormResponseController } from './form-response.controller';
import { FormResponseService } from './form-response.service';

@Module({
  controllers: [FormResponseController],
  providers: [FormResponseService]
})
export class FormResponseModule {}

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { FormResponseController } from "./form-response.controller";
import { FormResponseService } from "./form-response.service";
import { FormResponse, FormResponseSchema } from "./schemas/form-response.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FormResponse.name, schema: FormResponseSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return { secret: config.get("JWT_SECRET") };
      },
    }),
  ],
  controllers: [FormResponseController],
  providers: [FormResponseService],
})
export class FormResponseModule {}

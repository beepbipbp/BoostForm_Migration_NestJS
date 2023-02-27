import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "src/common/middlewares/auth.middleware";
import { UserModule } from "src/user/user.module";
import { FormResponseController } from "./form-response.controller";
import { FormResponseRepository } from "./form-response.repository";
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
    UserModule,
  ],
  controllers: [FormResponseController],
  providers: [FormResponseService, FormResponseRepository],
})
export class FormResponseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/responses/isSubmitted/:formId", method: RequestMethod.GET });
  }
}

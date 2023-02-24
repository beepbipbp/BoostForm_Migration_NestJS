import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "src/common/middlewares/auth.middleware";
import { UserModule } from "src/user/user.module";
import { FormController } from "./form.controller";
import { FormRepository } from "./form.repository";
import { FormService } from "./form.service";
import { FormCachingMiddleware } from "./middlewares/form-caching.middleware";
import { Form, FormSchema } from "./schemas/form.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return { secret: config.get("JWT_SECRET") };
      },
    }),
    UserModule,
  ],
  controllers: [FormController],
  providers: [FormService, FormRepository],
})
export class FormModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/forms/", method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/forms/", method: RequestMethod.POST });
    consumer.apply(FormCachingMiddleware).forRoutes({ path: "api/forms/:formId", method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/forms/:formId", method: RequestMethod.PATCH });
  }
}

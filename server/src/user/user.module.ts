import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "src/common/middlewares/auth.middleware";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return { secret: config.get("JWT_SECRET") };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/users/", method: RequestMethod.GET });
  }
}

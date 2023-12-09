import {Module} from "@nestjs/common";
import {GatewayService} from "./gateway.service";
import {MessageBody, SubscribeMessage} from "@nestjs/websockets";

@Module({
  providers: [GatewayService],
  exports: [GatewayService]
})
export class GatewayModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpreadService } from './spread/services/spread.service';
import { ApiService } from './api/services/api.service';
import { SpreadController } from './spread/spread.controller';
import { BudaGatewayService } from './buda-gateway/services/buda-gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, SpreadController],
  providers: [AppService, SpreadService, ApiService, BudaGatewayService],
})
export class AppModule {}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SpreadService } from './services/spread.service';
import { CreateSpreadAlertDto } from './dtos/create-spread-alert.dto';
import { CheckSpreadAlertResponseDto } from './dtos/check-spread-alert-response.dto';
import { MarketSpreadsResponseDto } from './dtos/market-spreads-response.dto';
import { MarketSpreadDto } from './dtos/market-spread.dto';
import { SpreadAlertResponseDto } from './dtos/spread-alert-response.dto';

@Controller('spreads')
export class SpreadController {
    constructor(private readonly spreadService: SpreadService ) {}

    @Get()
    async getAllSpreads(): Promise<MarketSpreadsResponseDto> {
        return this.spreadService.calculateAllSpreads();
    }

    @Get(':marketId')
    async getMarketSpread(
        @Param('marketId') marketId: string
    ): Promise<MarketSpreadDto> {
        return this.spreadService.calculateSpread(marketId);
    }

    @Post(':marketId/alert')
    createSpreadAlert(
        @Param('marketId') marketId: string, 
        @Body() body: CreateSpreadAlertDto
    ): SpreadAlertResponseDto {
        return this.spreadService.createSpreadAlert(marketId, body.spread);
    }

    @Get(':marketId/alert')
    checkSpreadAlert(@Param('marketId') marketId: string): Promise<CheckSpreadAlertResponseDto> {
        return this.spreadService.checkSpreadAlert(marketId);
    }
}

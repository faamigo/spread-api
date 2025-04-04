import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { BudaGatewayService } from '../../buda-gateway/services/buda-gateway.service';
import { SpreadAlertStatus } from '../enums/spread-alert-status.enum';
import { MarketSpreadsResponseDto } from '../dtos/market-spreads-response.dto';
import { CheckSpreadAlertResponseDto } from '../dtos/check-spread-alert-response.dto';
import { MarketSpreadDto } from '../dtos/market-spread.dto';
import { SpreadAlertResponseDto } from '../dtos/spread-alert-response.dto';


@Injectable()
export class SpreadService {
    private spreadAlerts = new Map<string, number>();
    private readonly logger = new Logger('SpreadService');

    constructor(private readonly budaGatewayService: BudaGatewayService) {}

    async calculateSpread(marketId: string): Promise<MarketSpreadDto> {
        try {
            const response = await this.budaGatewayService.getMarketTicker(marketId);
            const maxBid = Number(response.ticker.max_bid[0]);
            const minAsk = Number(response.ticker.min_ask[0]);
            const spread = minAsk - maxBid;
            this.logger.log(`Spread for market ${marketId}: ${spread}`);

            return { marketId, spread } as MarketSpreadDto;
        } catch (error) {
            this.logger.error(`Error calculating spread for market ${marketId}: ${error.message}`, error.stack);
            if (error.response.status === 404) {
                throw new NotFoundException(`Market ${marketId} not found`);
            }
            throw new InternalServerErrorException(`Error fetching market spread for ${marketId}: ${error.message}`);
        }
    } 
    
    async calculateAllSpreads(): Promise<MarketSpreadsResponseDto> {
        try {
            const response = await this.budaGatewayService.getTickers();
            const marketIds = response.tickers.map(ticker => ticker.market_id);
    
            const spreads = await Promise.allSettled(
                marketIds.map(async marketId => {
                    try {
                        const spreadDto = await this.calculateSpread(marketId);
                        return {
                            marketId,
                            spread: spreadDto.spread
                        };
                    } catch (error) {
                        return {
                            marketId,
                            spread: null,
                            error: error.message
                        };
                    }
                })
            );

            const validSpreads = spreads
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value)
                .filter(spread => spread.spread !== null);

            return {
                spreads: validSpreads,
            } as MarketSpreadsResponseDto;
        } catch (error) {
            this.logger.error(`Error fetching all spreads: ${error.message}`);
            throw new InternalServerErrorException(`Error fetching market spreads: ${error.message}`);
        }
    }

    async checkSpreadAlert(marketId: string): Promise<CheckSpreadAlertResponseDto> {
        try {
            const spreadDto = await this.calculateSpread(marketId);
            const spreadValue = spreadDto.spread;
            const spreadAlert = this.spreadAlerts.get(marketId);
            
            if (spreadAlert === undefined) {
                throw new NotFoundException(`No alert set for ${marketId}`);
            }

            let status: SpreadAlertStatus;
            if (spreadValue === spreadAlert) {
                status = SpreadAlertStatus.EQUALS;
            } else if (spreadValue > spreadAlert) {
                status = SpreadAlertStatus.HIGHER;
            } else {
                status = SpreadAlertStatus.LOWER;
            }
        
            return {
              marketId,
              currentSpread: spreadValue,
              spreadAlert,
              status
            } as CheckSpreadAlertResponseDto;
        } catch (error) {
            if (error.status === 404) {
                throw new NotFoundException(`Market alert for ${marketId} not found`);
            }
            throw new InternalServerErrorException(`Error checking spread alert for ${marketId}: ${error.message}`);
        }

    }

    createSpreadAlert(marketId: string, spread: number): SpreadAlertResponseDto {
        this.spreadAlerts.set(marketId, spread);
        return {
            message: 'Spread alert created successfully',
            alert: {
                marketId,
                spread
            }
        } as SpreadAlertResponseDto;
    }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiService } from '../../api/services/api.service';
import { MarketTickerDto } from '../dtos/market-ticker.dto';
import { TickersDto } from '../dtos/market-ticker.dto';
import { BUDA_CONFIG } from '../../constants/buda.constants';

@Injectable()
export class BudaGatewayService {
    private readonly baseUrl = BUDA_CONFIG.baseUrl;

    constructor(private readonly apiService: ApiService) {}

    async getMarketTicker(marketId: string): Promise<MarketTickerDto> {
        const endpoint = `${this.baseUrl}/markets/${marketId}/ticker`;
        return this.apiService.get<MarketTickerDto>(endpoint);
    }

    async getTickers(): Promise<TickersDto> {
        const endpoint = `${this.baseUrl}/tickers`;
        return this.apiService.get<TickersDto>(endpoint);
    }
}

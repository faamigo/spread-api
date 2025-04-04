import { Test, TestingModule } from '@nestjs/testing';
import { BudaGatewayService } from './buda-gateway.service';
import { ApiService } from '../../api/services/api.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

const mockApiService = {
    get: jest.fn()
};

describe('BudaGatewayService', () => {
    let budaGatewayService: BudaGatewayService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BudaGatewayService,
                { provide: ApiService, useValue: mockApiService }
            ]
        }).compile();

        budaGatewayService = module.get<BudaGatewayService>(BudaGatewayService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(budaGatewayService).toBeDefined();
    });

    describe('getMarketTicker', () => {
        it('should call apiService.get with correct URL', async () => {
            const marketId = 'BTC-CLP';
            const mockResponse = { ticker: { max_bid: 100, min_ask: 105 } };
            mockApiService.get.mockResolvedValue(mockResponse);

            const result = await budaGatewayService.getMarketTicker(marketId);
            expect(mockApiService.get).toHaveBeenCalledWith(`https://www.buda.com/api/v2/markets/${marketId}/ticker`);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getTickers', () => {
        it('should call apiService.get with correct URL', async () => {
            await budaGatewayService.getTickers();
            expect(mockApiService.get).toHaveBeenCalledWith('https://www.buda.com/api/v2/tickers');
        });
    });
});

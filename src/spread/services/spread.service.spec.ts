import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SpreadService } from './spread.service';
import { BudaGatewayService } from '../../buda-gateway/services/buda-gateway.service';

const mockTicker = {
    ticker: {
        market_id: 'BTC-CLP',
        price_variation_24h: '0',
        price_variation_7d: '0',
        last_price: ['1000000', 'CLP'],
        max_bid: ['999000', 'CLP'],
        min_ask: ['1001000', 'CLP'],
        volume: ['10000000', 'CLP'],
    },
};

const mockBudaGatewayService = {
    getMarketTicker: jest.fn().mockResolvedValue(mockTicker),
    getTickers: jest.fn(),
};

describe('SpreadService', () => {
    let spreadService: SpreadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SpreadService,
                { provide: BudaGatewayService, useValue: mockBudaGatewayService },
            ],
        }).compile();

        spreadService = module.get<SpreadService>(SpreadService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkSpreadAlert', () => {
        it('should throw InternalServerErrorException', async () => {
            mockBudaGatewayService.getMarketTicker.mockRejectedValueOnce(new Error());
            await expect(spreadService.checkSpreadAlert('BTC-CLP')).rejects.toThrow(InternalServerErrorException)  
        });

        it('should throw NotFoundException if no alert is set', async () => {
            await expect(spreadService.checkSpreadAlert('BTC-CLP'))
                .rejects.toThrow(NotFoundException);
        });
        
        it('should return the alert status when spread equals alert', async () => {
            spreadService.createSpreadAlert('BTC-CLP', 2000);
            const result = await spreadService.checkSpreadAlert('BTC-CLP');
            expect(result).toEqual({
                marketId: 'BTC-CLP',
                currentSpread: 2000,
                spreadAlert: 2000,
                status: 'equals'
            });
        });

        it('should return the alert status when spread is above alert', async () => {
            spreadService.createSpreadAlert('BTC-CLP', 1000);
            const result = await spreadService.checkSpreadAlert('BTC-CLP');
            expect(result).toEqual({
                marketId: 'BTC-CLP',
                currentSpread: 2000,
                spreadAlert: 1000,
                status: 'higher'
            });
        });

        it('should return the alert status when spread is below alert', async () => {
            spreadService.createSpreadAlert('BTC-CLP', 3000);
            const result = await spreadService.checkSpreadAlert('BTC-CLP');
            expect(result).toEqual({
                marketId: 'BTC-CLP',
                currentSpread: 2000,
                spreadAlert: 3000,
                status: 'lower'
            });
        });
    });

    describe('calculateMarketSpread', () => {

        it('should return the market spread', async () => {
            const spread = await spreadService.calculateSpread('BTC-CLP');
            expect(spread).toStrictEqual({marketId: 'BTC-CLP', spread: 2000});
        });

        it('should throw InternalServerErrorException on failure', async () => {
            const apiError = {
                response: {
                  status: 500,
                  data: 'API error',
                },
              };

            mockBudaGatewayService.getMarketTicker.mockRejectedValue(apiError);

            await expect(spreadService.calculateSpread('BTC-CLP'))
                .rejects.toThrow(InternalServerErrorException);
        });

        it('should throw NotfoundException when resource does not exists', async () => {
            const notfoundError = {
                response: {
                  status: 404,
                  data: 'Not found error',
                },
              };

            mockBudaGatewayService.getMarketTicker.mockRejectedValue(notfoundError);

            await expect(spreadService.calculateSpread('BTC-XYZ'))
                .rejects.toThrow(NotFoundException);
        });


    });

    describe('calculateAllSpreads', () => {
        describe('when calculateSpread fails', () => {
            const mockError = {
                response: {
                  status: 500,
                  data: 'API error',
                },
              };
            
            it('should throw InternalServerErrorException when getTickers fails', async () => {
                mockBudaGatewayService.getTickers.mockRejectedValueOnce(mockError);
                await expect(spreadService.calculateAllSpreads()).rejects.toThrow(
                    InternalServerErrorException,
                );
            });

            it('should continue with remaining markets when one fails', async () => {
                mockBudaGatewayService.getTickers.mockResolvedValue({
                    tickers: [
                        {
                            market_id: 'BTC-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['1000000', 'CLP'],
                        },
                        {
                            market_id: 'ETH-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['500000', 'CLP'],
                        },
                    ],
                });

                mockBudaGatewayService.getMarketTicker
                    .mockRejectedValueOnce(new Error('API Error'))
                    .mockResolvedValueOnce({
                        ticker: {
                            market_id: 'ETH-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['500000', 'CLP'],
                            max_bid: ['499000', 'CLP'],
                            min_ask: ['501000', 'CLP'],
                            volume: ['5000000', 'CLP'],
                        },
                    });

                const spreads = await spreadService.calculateAllSpreads();
                expect(spreads).toEqual({
                    spreads: [
                        { marketId: 'ETH-CLP', spread: 2000 },
                    ],
                });
            });
        });

        describe('when calculateSpread succeeds', () => {
            it('should return spreads for all markets', async () => {
                mockBudaGatewayService.getTickers.mockResolvedValue({
                    tickers: [
                        {
                            market_id: 'BTC-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['1000000', 'CLP'],
                        },
                        {
                            market_id: 'ETH-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['500000', 'CLP'],
                        },
                    ],
                });

                mockBudaGatewayService.getMarketTicker
                    .mockResolvedValueOnce({
                        ticker: {
                            market_id: 'BTC-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['1000000', 'CLP'],
                            max_bid: ['999000', 'CLP'],
                            min_ask: ['1001000', 'CLP'],
                            volume: ['10000000', 'CLP'],
                        },
                    })
                    .mockResolvedValueOnce({
                        ticker: {
                            market_id: 'ETH-CLP',
                            price_variation_24h: '0',
                            price_variation_7d: '0',
                            last_price: ['500000', 'CLP'],
                            max_bid: ['499000', 'CLP'],
                            min_ask: ['501000', 'CLP'],
                            volume: ['5000000', 'CLP'],
                        },
                    });

                const spreads = await spreadService.calculateAllSpreads();
                expect(spreads).toEqual({
                    spreads: [
                        { marketId: 'BTC-CLP', spread: 2000 },
                        { marketId: 'ETH-CLP', spread: 2000 },
                    ],
                });
            });
        });
    });

    describe('createSpreadAlert', () => {
        it('should save an alert and return a confirmation message', () => {
            const response = spreadService.createSpreadAlert('BTC-CLP', 10);
            expect(response).toEqual({
                message: 'Spread alert created successfully',
                alert: {
                    marketId: 'BTC-CLP',
                    spread: 10,
                }
            });
        });
    });
});

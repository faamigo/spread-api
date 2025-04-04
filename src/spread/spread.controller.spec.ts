import { Test, TestingModule } from '@nestjs/testing';
import { SpreadController } from './spread.controller';
import { SpreadService } from './services/spread.service';
import { NotFoundException } from '@nestjs/common';


const mockSpreadService = {
    calculateAllSpreads: jest.fn(),
    calculateSpread: jest.fn(),
    createSpreadAlert: jest.fn(),
    checkSpreadAlert: jest.fn()
};

describe('SpreadController', () => {
    let spreadController: SpreadController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SpreadController],
            providers: [{ provide: SpreadService, useValue: mockSpreadService }],
        }).compile();

        spreadController = module.get<SpreadController>(SpreadController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(spreadController).toBeDefined();
    });

    describe('getAllMarketsSpread', () => {
        it('should return spreads for all markets', async () => {
            const mockResponse = { 'BTC-CLP': 10, 'ETH-CLP': 20 };
            mockSpreadService.calculateAllSpreads.mockResolvedValue(mockResponse);

            const result = await spreadController.getAllSpreads();
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getMarketSpread', () => {
        it('should return the spread for a market', async () => {
            mockSpreadService.calculateSpread.mockResolvedValue(15);
            const result = await spreadController.getMarketSpread('BTC-CLP');
            expect(result).toBe(15);
        });
    });

    describe('createSpreadAlert', () => {
        it('should create a spread alert and return correct response', () => {
            const mockResponse = {marketId: 'BTC-CLP', spread: 10 };
            mockSpreadService.createSpreadAlert.mockReturnValue(mockResponse);

            const result = spreadController.createSpreadAlert('BTC-CLP', { spread: 10 });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('checkSpreadAlert', () => {
        it('should return the alert status', async () => {
            const mockResponse = { currentSpread: 15, spreadAlert: 10, status: 'above' };
            mockSpreadService.checkSpreadAlert.mockResolvedValue(mockResponse);

            const result = await spreadController.checkSpreadAlert('BTC-CLP');
            expect(result).toEqual(mockResponse);
        });

        it('should throw NotFoundException if no alert is set', async () => {
            mockSpreadService.checkSpreadAlert.mockRejectedValue(new NotFoundException('No alert set for BTC-CLP'));

            await expect(spreadController.checkSpreadAlert('BTC-CLP'))
                .rejects.toThrow(NotFoundException);
        });
    });
});

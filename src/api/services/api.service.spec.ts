import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Logger } from '@nestjs/common';


const mockHttpService = {
  get: jest.fn(),
};

describe('ApiService', () => {
    let service: ApiService;
    let httpService: HttpService;
    let loggerSpy: jest.SpyInstance;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApiService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<ApiService>(ApiService);
        httpService = module.get<HttpService>(HttpService);
        loggerSpy = jest.spyOn(Logger.prototype, 'error');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('get', () => {
        it('should return data from the get method with correct typing', async () => {
            const mockResponse: AxiosResponse<{ message: string }> = {
                data: { message: 'Success' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

            const result = await service.get<{ message: string }>('https://www.buda.com/api/v2');
            expect(result).toEqual(mockResponse.data);
            expect(httpService.get).toHaveBeenCalledWith('https://www.buda.com/api/v2', {
                params: undefined,
            });
        });

        it('should handle params correctly', async () => {
            const mockResponse: AxiosResponse<{ message: string }> = {
                data: { message: 'Success' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

            const params = { key: 'value' };
            await service.get<{ message: string }>('https://www.buda.com/api/v2', params);
            
            expect(httpService.get).toHaveBeenCalledWith('https://www.buda.com/api/v2', {
                params,
            });
        });

        it('should log error and rethrow when request fails', async () => {
            const error = new Error('Request failed');
            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

            try {
                await service.get('https://www.buda.com/api/v2');
            } catch (e) {
                expect(e).toBe(error);
            }

            expect(loggerSpy).toHaveBeenCalledWith(
                'GET request failed for https://www.buda.com/api/v2: Request failed'
            );
        });
    });
});

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ApiService {
    private readonly logger = new Logger(ApiService.name);

    constructor(private readonly httpService: HttpService) {}

    async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        try {
            const response = await firstValueFrom(
                this.httpService.get<T>(url, { params })
            );
            return response.data;
        } catch (error) {
            this.logger.error(`GET request failed for ${url}: ${error.message}`);
            throw error;
        }
    }
}

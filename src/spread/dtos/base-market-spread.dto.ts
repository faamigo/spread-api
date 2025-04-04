import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class BaseMarketSpreadDto {
    @IsString()
    @IsNotEmpty()
    marketId: string;

    @IsNumber()
    @IsNotEmpty()
    spread: number;
} 
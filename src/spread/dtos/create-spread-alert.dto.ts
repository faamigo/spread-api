import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseMarketSpreadDto } from './base-market-spread.dto';

export class CreateSpreadAlertDto {
    @IsNumber()
    @IsNotEmpty()
    spread: number;
}
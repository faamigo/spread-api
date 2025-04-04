import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { BaseMarketSpreadDto } from './base-market-spread.dto';
import { Type } from 'class-transformer';

export class SpreadAlertResponseDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => BaseMarketSpreadDto)
    alert: BaseMarketSpreadDto;
}
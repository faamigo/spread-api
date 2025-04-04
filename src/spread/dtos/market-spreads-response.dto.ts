import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMarketSpreadDto } from './base-market-spread.dto';

export class MarketSpreadsResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BaseMarketSpreadDto)
    spreads: BaseMarketSpreadDto[];
}

import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { MarketSpreadDto } from './market-spread.dto';


export class MarketSpreadsResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MarketSpreadDto)
    spreads: MarketSpreadDto[];
}

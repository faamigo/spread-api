import { IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';


export class BaseTickerDto {
    @IsString()
    market_id: string;

    @IsString()
    price_variation_24h: string;

    @IsString()
    price_variation_7d: string;

    @IsArray()
    @IsString({ each: true })
    last_price: [string, string];
}

export class DetailedTickerDto extends BaseTickerDto {
    @IsArray()
    @IsString({ each: true })
    max_bid: [string, string];

    @IsArray()
    @IsString({ each: true })
    min_ask: [string, string];

    @IsArray()
    @IsString({ each: true })
    volume: [string, string];
}

export class MarketTickerDto {
    @IsObject()
    @ValidateNested()
    @Type(() => DetailedTickerDto)
    ticker: DetailedTickerDto;
}

export class TickersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BaseTickerDto)
    tickers: BaseTickerDto[];
}

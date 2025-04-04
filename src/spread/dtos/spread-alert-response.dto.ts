import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MarketSpreadDto } from './market-spread.dto';


export class SpreadAlertResponseDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => MarketSpreadDto)
    alert: MarketSpreadDto;
}

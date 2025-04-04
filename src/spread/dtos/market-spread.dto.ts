import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class MarketSpreadDto {
    @IsString()
    @IsNotEmpty()
    marketId: string;
    
    @IsNumber()
    @IsNotEmpty()
    spread: number;
}

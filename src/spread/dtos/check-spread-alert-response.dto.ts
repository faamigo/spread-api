import { IsEnum, IsNumber } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { SpreadAlertStatus } from '../enums/spread-alert-status.enum';

export class CheckSpreadAlertResponseDto {
    @IsString()
    @IsNotEmpty()
    marketId: string;

    @IsNumber()
    @IsNotEmpty()
    currentSpread: number;

    @IsNumber()
    @IsNotEmpty()
    spreadAlert: number;

    @IsEnum(SpreadAlertStatus)
    @IsNotEmpty()
    status: SpreadAlertStatus;
}

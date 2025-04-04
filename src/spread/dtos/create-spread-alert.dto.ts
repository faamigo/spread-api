import { IsNotEmpty, IsNumber } from 'class-validator';


export class CreateSpreadAlertDto {
    @IsNumber()
    @IsNotEmpty()
    spread: number;
}

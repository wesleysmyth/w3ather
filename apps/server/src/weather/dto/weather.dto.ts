import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Units } from '../../common/enums/units.enums';

export class WeatherAPIParamsDto {
    constructor(partial: Partial<WeatherAPIParamsDto>) {
        Object.assign(this, partial);
    }

    @IsString()
    appid: string;

    @IsNumber()
    lat: number;

    @IsNumber()
    lon: number;

    @IsOptional()
    @IsString()
    exclude?: string;

    @IsOptional()
    @IsEnum(Units)
    units?: Units;
}

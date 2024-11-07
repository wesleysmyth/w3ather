import { IsString, IsNumber } from 'class-validator';

export class CityAPIParamsDto {
    constructor(partial: Partial<CityAPIParamsDto>) {
        Object.assign(this, partial);
    }

    @IsString()
    q: string;

    @IsString()
    appid: string;

    @IsNumber()
    limit: number;
}

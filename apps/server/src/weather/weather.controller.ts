import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Units } from '../common/enums/units.enums';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get()
    async getWeatherByCity(
        @Query('city') city: string,
        @Query('frequency') frequency?: string,
        @Query('units') units?: Units
    ): Promise<any> {
        return await this.weatherService.getWeatherByCity(
            city,
            frequency,
            units
        );
    }
}

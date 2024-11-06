import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Units } from '../common/enums/units.enums';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('city')
    async getWeatherByCity(
        @Query('city') city: string,
        @Query('frequency') frequency: string,
        @Query('units') units: Units
    ): Promise<any> {
        return await this.weatherService.getWeatherByCity(
            city,
            frequency,
            units
        );
    }

    @Get('current')
    async getCurrentWeatherByCity(@Query('city') city: string): Promise<any> {
        return await this.weatherService.getCurrentWeatherByCity(city);
    }

    @Get('hourly')
    async getHourlyWeather(@Query('city') city: string): Promise<any> {
        console.log('city', city);
        return await this.weatherService.getHourlyWeatherByCity(city);
    }

    @Get('daily')
    async getDailyWeather(@Query('city') city: string): Promise<any> {
        return await this.weatherService.getDailyWeatherByCity(city);
    }
}

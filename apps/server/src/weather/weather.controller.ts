import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherData, AIWeatherData } from './interfaces/weather.interface';
import { Units } from '../common/enums/units.enums';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('city')
    async getWeatherByCity(
        @Query('city') city: string,
        @Query('units') units?: Units
    ): Promise<WeatherData> {
        return await this.weatherService.getWeatherByCity(city, units);
    }

    @Get('coords')
    async getWeatherByCoords(
        @Query('lat') lat: number,
        @Query('lon') lon: number,
        @Query('units') units?: Units
    ): Promise<WeatherData> {
        return await this.weatherService.getWeatherByCoords(lat, lon, units);
    }

    @Post('description')
    async generateWeatherDescription(
        @Body() aiWeatherData: AIWeatherData
    ): Promise<string> {
        return await this.weatherService.generateWeatherDescription(
            aiWeatherData
        );
    }
}

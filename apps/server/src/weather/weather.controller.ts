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
        @Query('frequency') frequency?: string,
        @Query('units') units?: Units
    ): Promise<WeatherData> {
        return await this.weatherService.getWeatherByCity(
            city,
            frequency,
            units
        );
    }

    @Get('coords')
    async getWeatherByCoords(
        @Query('lat') lat: number,
        @Query('lon') lon: number,
        @Query('frequency') frequency?: string,
        @Query('units') units?: Units
    ): Promise<WeatherData> {
        return await this.weatherService.getWeatherByCoords(
            lat,
            lon,
            frequency,
            units
        );
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

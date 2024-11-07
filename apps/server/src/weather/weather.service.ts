import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Units } from '../common/enums/units.enums';
import { WeatherData } from './interfaces/weather.interface';
import { WeatherAPIParamsDto } from './dto/weather.dto';
import { CityAPIParamsDto } from './dto/city.dto';

@Injectable()
export class WeatherService {
    private readonly apiKey: string;
    private readonly apiUrl: string =
        'https://api.openweathermap.org/data/3.0/onecall';
    private readonly geoApiUrl: string =
        'https://api.openweathermap.org/data/2.5/weather';

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get('OPENWEATHERMAP_API_KEY');
    }

    async getWeatherByCity(
        city: string,
        frequency = 'current',
        units: Units = Units.Imperial
    ): Promise<WeatherData> {
        const { lat, lon } = await this.getCityCoordinates(city);
        return this.getWeatherByCoords(lat, lon, frequency, units);
    }

    async getWeatherByCoords(
        lat: number,
        lon: number,
        frequency = 'current',
        units: Units = Units.Imperial
    ): Promise<WeatherData> {
        const exclude: string = [
            'current',
            'minutely',
            'hourly',
            'daily',
            'alerts',
        ]
            .filter((_frequency: string) => _frequency !== frequency)
            .join(',');
        const params = new WeatherAPIParamsDto({
            appid: this.apiKey,
            lat,
            lon,
            exclude,
            units,
        });
        const response = await axios.get(this.apiUrl, { params });
        console.log('response.data', response.data);

        return response.data;
    }

    private async getCityCoordinates(
        city: string
    ): Promise<{ lat: number; lon: number }> {
        const params = new CityAPIParamsDto({
            q: city,
            limit: 1,
            appid: this.apiKey,
        });

        try {
            const response: {
                data: {
                    coord: { lat: number; lon: number };
                };
            } = await axios.get(this.geoApiUrl, { params });
            const { lat, lon } = response.data.coord;

            return { lat, lon };
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: AxiosError<{ message: string }>): void {
        console.log('error', error);
        if (error.response) {
            throw new HttpException(
                error.response?.data?.message || 'Error fetching weather data',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            throw new HttpException(
                'An error occurred while fetching weather data.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

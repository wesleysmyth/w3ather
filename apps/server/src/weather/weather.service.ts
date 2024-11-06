import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Units } from '../common/enums/units.enums';

interface WeatherParams {
    appid: string;
    lat: number;
    lon: number;
    exclude?: string;
    units?: Units.Imperial | Units.Metric;
}

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
        frequency: string = 'current',
        units: Units = Units.Imperial
    ): Promise<any> {
        console.log('frequency', frequency);
        const { lat, lon } = await this.getCityCoordinates(city);
        const exclude = ['current', 'minutely', 'hourly', 'daily', 'alerts']
            .filter((_frequency: string) => _frequency !== frequency)
            .join(',');
        console.log('exclude', exclude);
        const params: WeatherParams = {
            appid: this.apiKey,
            lat,
            lon,
            exclude,
            units,
        };
        const response = await axios.get(this.apiUrl, { params });

        console.log('response.data', response.data);

        return response.data;
    }

    async getCurrentWeatherByCity(city: string): Promise<any> {
        try {
            const { lat, lon } = await this.getCityCoordinates(city);
            console.log('here');
            const params = {
                lat,
                lon,
                exclude: 'current,minutely,hourly,daily,alerts',
                appid: this.apiKey,
                units: 'metric',
            };
            const response = await axios.get(this.apiUrl, { params });

            console.log('response.data.current', response.data.current);

            return response.data.current;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getHourlyWeatherByCity(city: string): Promise<any> {
        try {
            const { lat, lon } = await this.getCityCoordinates(city);
            const params = {
                lat,
                lon,
                exclude: 'current,minutely,daily,alerts',
                appid: this.apiKey,
                units: 'metric',
            };
            const response = await axios.get(this.apiUrl, { params });

            return response.data.hourly;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getDailyWeatherByCity(city: string): Promise<any> {
        try {
            const { lat, lon } = await this.getCityCoordinates(city);
            const params = {
                lat,
                lon,
                exclude: 'current,minutely,hourly,alerts',
                appid: this.apiKey,
                units: 'metric',
            };
            const response = await axios.get(this.apiUrl, { params });

            return response.data.daily;
        } catch (error) {
            this.handleError(error);
        }
    }

    private async getCityCoordinates(
        city: string
    ): Promise<{ lat: number; lon: number }> {
        const params = {
            q: city,
            limit: 1,
            appid: this.apiKey,
        };

        try {
            const response: { data: { coord: { lat: number; lon: number } } } =
                await axios.get(this.geoApiUrl, { params });
            const { lat, lon } = response.data?.coord;

            return { lat, lon };
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        console.log('error', error);
        if (error.response) {
            throw new HttpException(
                error.response?.data?.message || 'Error fetching weather data',
                error.response.status
            );
        } else {
            throw new HttpException(
                'An error occurred while fetching weather data.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

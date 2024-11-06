import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
    private readonly apiKey: string;
    private readonly apiUrl: string =
        'https://api.openweathermap.org/data/2.5/weather';

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get('OPENWEATHERMAP_API_KEY');
    }

    async getWeatherByCity(city: string): Promise<any> {
        try {
            const params = {
                q: city,
                appid: this.apiKey,
                units: 'imperial', // consider adding option for metric
            };
            const response = await axios.get(this.apiUrl, { params });

            return response.data;
        } catch (error) {
            if (error.response) {
                // OpenWeatherMap API error
                const { status, data } = error.response;

                throw new HttpException(
                    {
                        status,
                        error: data?.message,
                    },
                    status
                );
            } else {
                // other errors
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'An error occurred while fetching weather data.',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

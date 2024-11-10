import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { Units } from '../common/enums/units.enums';
import { WeatherData, AIWeatherData } from './interfaces/weather.interface';
import { WeatherAPIParamsDto } from './dto/weather.dto';
import { CityAPIParamsDto } from './dto/city.dto';

@Injectable()
export class WeatherService {
    private readonly apiKey: string;
    private readonly apiUrl: string =
        'https://api.openweathermap.org/data/3.0/onecall';
    private readonly geoApiUrl: string =
        'https://api.openweathermap.org/data/2.5/weather';
    private readonly openAIClient = new OpenAI({
        apiKey: this.configService.get('OPENAI_API_KEY'),
    });

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

    async generateWeatherDescription(
        aiWeatherData: AIWeatherData
    ): Promise<string> {
        const content = `
            Given the following weather data, generate a detailed and vivid description of the weather conditions suitable for a weather app:

            Temperature: ${aiWeatherData.temp}°F
            Feels like: ${aiWeatherData.feels_like}°F
            Humidity: ${aiWeatherData.humidity}%
            Wind speed: ${aiWeatherData.wind_speed} m/s
            Weather: ${aiWeatherData.weather[0].main} (${aiWeatherData.weather[0].description})
            Location: ${aiWeatherData.location}

            Create a description in a friendly and descriptive tone.
        `;
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: 'user', content }],
            model: 'gpt-4o',
        };
        const chatCompletion: OpenAI.Chat.ChatCompletion =
            await this.openAIClient.chat.completions.create(params);

        return chatCompletion?.choices[0]?.message?.content;
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

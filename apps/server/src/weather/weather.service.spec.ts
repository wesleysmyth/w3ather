import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { Units } from '../common/enums/units.enums';
import { WeatherData, AIWeatherData } from './interfaces/weather.interface';
import { mockWeatherData } from '../../__mocks__/weatherDataMock';

jest.mock('axios');

describe('WeatherService', () => {
    let weatherService: WeatherService;
    let configService: ConfigService;

    const mockApiKey = 'test_api_key';
    const mockOpenAIKey = 'openai_test_key';
    // const mockWeatherData: WeatherData = {
    //     lat: 40.7128,
    //     lon: -74.006,
    //     timezone: 'America/New_York',
    //     timezone_offset: -14400,
    //     current: {
    //         dt: 1623342340,
    //         sunrise: 1623318895,
    //         sunset: 1623369275,
    //         temp: 298.55,
    //         feels_like: 298.96,
    //         pressure: 1013,
    //         humidity: 78,
    //         dew_point: 293.55,
    //         uvi: 0,
    //         clouds: 20,
    //         visibility: 10000,
    //         wind_speed: 5.66,
    //         wind_deg: 220,
    //         wind_gust: 8.23,
    //         weather: [
    //             {
    //                 id: 800,
    //                 main: 'Clear',
    //                 description: 'clear sky',
    //                 icon: '01d',
    //             },
    //         ],
    //     },
    // };

    const mockOpenAIResponse = {
        choices: [
            { message: { content: 'Clear skies with mild temperatures.' } },
        ],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WeatherService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'OPENWEATHERMAP_API_KEY')
                                return mockApiKey;
                            if (key === 'OPENAI_API_KEY') return mockOpenAIKey;
                        }),
                    },
                },
            ],
        }).compile();

        weatherService = module.get<WeatherService>(WeatherService);
        configService = module.get<ConfigService>(ConfigService);

        // Mock OpenAI client method
        weatherService['openAIClient'].chat.completions.create = jest
            .fn()
            .mockResolvedValue(mockOpenAIResponse);
    });

    describe('generateWeatherDescription', () => {
        it('should generate a weather description using OpenAI', async () => {
            const mockAIWeatherData: AIWeatherData = {
                temp: 298.55,
                feels_like: 298.96,
                humidity: 78,
                wind_speed: 5.66,
                weather: [
                    {
                        id: 800,
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                ],
                location: 'New York',
            };

            const result = await weatherService.generateWeatherDescription(
                mockAIWeatherData
            );

            expect(
                weatherService['openAIClient'].chat.completions.create
            ).toHaveBeenCalledWith({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: expect.any(String),
                    },
                ],
            });
            expect(result).toBe('Clear skies with mild temperatures.');
        });
    });
});

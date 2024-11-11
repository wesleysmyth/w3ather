import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { AIWeatherData } from './interfaces/weather.interface';

jest.mock('axios');

describe('WeatherService', () => {
    let weatherService: WeatherService;

    const mockApiKey = 'test_api_key';
    const mockOpenAIKey = 'openai_test_key';
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

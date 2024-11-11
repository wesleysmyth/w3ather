import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherData, AIWeatherData } from './interfaces/weather.interface';
import { Units } from '../common/enums/units.enums';
import { mockWeatherData } from '../../__mocks__/weatherDataMock';

describe('WeatherController', () => {
    let weatherController: WeatherController;
    let weatherService: WeatherService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [
                {
                    provide: WeatherService,
                    useValue: {
                        getWeatherByCity: jest.fn(),
                        getWeatherByCoords: jest.fn(),
                        generateWeatherDescription: jest.fn(),
                    },
                },
            ],
        }).compile();

        weatherController = module.get<WeatherController>(WeatherController);
        weatherService = module.get<WeatherService>(WeatherService);
    });

    it('should be defined', () => {
        expect(weatherController).toBeDefined();
    });

    describe('getWeatherByCity', () => {
        it('should call getWeatherByCity with correct parameters and return WeatherData', async () => {
            jest.spyOn(weatherService, 'getWeatherByCity').mockResolvedValue(
                mockWeatherData
            );

            const city = 'New York';
            const units = Units.Metric;
            const result = await weatherController.getWeatherByCity(
                city,
                units
            );

            expect(weatherService.getWeatherByCity).toHaveBeenCalledWith(
                city,
                units
            );
            expect(result).toEqual(mockWeatherData);
        });
    });

    describe('getWeatherByCoords', () => {
        it('should call getWeatherByCoords with correct parameters and return WeatherData', async () => {
            jest.spyOn(weatherService, 'getWeatherByCoords').mockResolvedValue(
                mockWeatherData
            );
            const lat = 34.0522;
            const lon = -118.2437;
            const units = Units.Imperial;
            const result = await weatherController.getWeatherByCoords(
                lat,
                lon,
                units
            );

            expect(weatherService.getWeatherByCoords).toHaveBeenCalledWith(
                lat,
                lon,
                units
            );
            expect(result).toEqual(mockWeatherData);
        });
    });

    describe('generateWeatherDescription', () => {
        it('should call generateWeatherDescription with correct AIWeatherData and return a description', async () => {
            const mockDescription = 'Clear skies with mild temperatures.';
            jest.spyOn(
                weatherService,
                'generateWeatherDescription'
            ).mockResolvedValue(mockDescription);

            const aiWeatherData: AIWeatherData = {
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
            const result = await weatherController.generateWeatherDescription(
                aiWeatherData
            );

            expect(
                weatherService.generateWeatherDescription
            ).toHaveBeenCalledWith(aiWeatherData);
            expect(result).toEqual(mockDescription);
        });
    });
});

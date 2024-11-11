import axios from 'axios';
import { fetchWeatherData, fetchAIDescription } from './weather';
import { WeatherData, AIWeatherData } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Weather API', () => {
    const aiWeatherData: AIWeatherData = {
        temp: 25,
        feels_like: 23,
        humidity: 60,
        wind_speed: 5,
        weather: [
            {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
                id: 800,
            },
        ],
        location: { coordinates: { lat: 40.7128, lon: -74.006 } },
    };
    const mockWeatherData: WeatherData = {
        main: {
            temp: 25,
            feels_like: 23,
            humidity: 60,
        },
        wind: {
            speed: 5,
        },
        weather: [
            {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
                id: 800,
            },
        ],
        name: 'Test City',
    };
    const lat = 40.7128;
    const lon = -74.006;

    describe('fetchWeatherData', () => {
        it('fetches weather data based on latitude and longitude', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: mockWeatherData });
            const result = await fetchWeatherData(lat, lon);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                `http://localhost:3000/weather/coords?lat=${lat}&lon=${lon}`
            );
            expect(result).toEqual(mockWeatherData);
        });

        it('throws an error if the API call fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
            await expect(fetchWeatherData(lat, lon)).rejects.toThrow(
                'API Error'
            );
        });
    });

    describe('fetchAIDescription', () => {
        it('fetches AI-generated weather description', async () => {
            const mockDescription =
                'It feels like a sunny day with clear skies.';

            mockedAxios.post.mockResolvedValueOnce({ data: mockDescription });

            const result = await fetchAIDescription(aiWeatherData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `http://localhost:3000/weather/description`,
                aiWeatherData
            );
            expect(result).toEqual(mockDescription);
        });

        it('throws an error if the API call fails', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
            await expect(fetchAIDescription(aiWeatherData)).rejects.toThrow(
                'API Error'
            );
        });
    });
});

import axios from 'axios';
import { WeatherData, AIWeatherData } from '../types';

export const fetchWeatherData = async (
    lat: number,
    lon: number
): Promise<WeatherData> => {
    const response = await axios.get<WeatherData>(
        `http://localhost:3000/weather/coords?lat=${lat}&lon=${lon}`
    );
    return response.data;
};

export const fetchAIDescription = async ({
    temp,
    feels_like,
    humidity,
    wind_speed,
    weather,
    location,
}: AIWeatherData): Promise<string> => {
    const response = await axios.post<string>(
        `http://localhost:3000/weather/description`,
        {
            temp,
            feels_like,
            humidity,
            wind_speed,
            weather,
            location,
        }
    );
    return response.data;
};

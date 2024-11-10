import axios from 'axios';
import { LocationState } from '../types';
import { WeatherData, WeatherEntity } from '../types';

export const fetchWeatherData = async (
    lat: number,
    lon: number
): Promise<WeatherData> => {
    const response = await axios.get<{ current: WeatherData }>(
        `http://localhost:3000/weather/coords?lat=${lat}&lon=${lon}`
    );
    return response.data?.current;
};

export const fetchAIDescription = async (
    temp: number,
    feels_like: number,
    humidity: number,
    wind_speed: number,
    weather: WeatherEntity[],
    location: LocationState
): Promise<string> => {
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

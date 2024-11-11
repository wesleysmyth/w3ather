import { Mode } from '../enums';

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface LocationState {
    coordinates?: Coordinates;
    error?: {
        code: number;
        message: string;
    };
}

export type ModeState = Mode | null;

export interface WeatherData {
    name: string;
    weather: WeatherEntity[];
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
}

export interface AIWeatherData {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: WeatherEntity[];
    location: LocationState;
}

export interface WeatherEntity {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface ReducerState {
    mode: ModeState;
    location: LocationState;
    aiDescription: string | null;
    name: string | null;
    image: string | null;
}

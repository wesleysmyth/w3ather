import { Mode } from '../enums/modes';

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
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: WeatherEntity[];
}

export interface WeatherEntity {
    id: number;
    main: string;
    description: string;
    icon: string;
}

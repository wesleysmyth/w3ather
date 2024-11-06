export interface WeatherData {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current?: CurrentEntity;
    hourly?: HourlyEntity[];
    daily?: DailyEntity[];
}

interface BaseWeatherEntity {
    dt: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherEntity[];
    feels_like: number | FeelsLikeEntity;
}

interface WeatherEntity {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface FeelsLikeEntity {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

interface CurrentEntity extends BaseWeatherEntity {
    sunrise: number;
    sunset: number;
    temp: number;
}

interface HourlyEntity extends BaseWeatherEntity {
    pop: 0;
    temp: number;
}

interface DailyEntity extends BaseWeatherEntity {
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: DailyTempEntity;
    pop: number;
}

interface DailyTempEntity extends FeelsLikeEntity {
    min: number;
    max: number;
}

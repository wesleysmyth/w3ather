import styles from './app.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Loader from '../loader';
import SelectCustom from '../selectCustom';
import { Mode } from '../../enums/modes';
import { LocationState, ModeState } from '../../types';
import { fetchWeatherData, fetchAIDescription } from '../../api/weather';

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<LocationState>({});
    const [mode, setMode] = useState<ModeState>(null);
    const [image, setImage] = useState<string | null>(null);
    const [aiDescription, setAIDescription] = useState<string | null>(null);
    const onGeoLocationSuccess = useCallback(
        ({ coords: { latitude, longitude } }: GeolocationPosition) => {
            setLocation({
                coordinates: {
                    lat: latitude,
                    lon: longitude,
                },
            });
            setLoading(false);
        },
        []
    );
    const onGeoLocationError = useCallback(
        (error: GeolocationPositionError) => {
            const errorMessages: { [key: number]: string } = {
                1: 'You denied the request for Geolocation.',
                2: 'Your location information is unavailable.',
                3: 'Your request timed out. Please try again.',
            };

            const message =
                errorMessages[error.code] || 'An unknown error occurred.';
            setLocation({
                error: {
                    code: error.code,
                    message,
                },
            });
        },
        []
    );

    // initial load effect
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // fetch user's location
    useEffect(() => {
        if (mode === Mode.Location) {
            if (!('geolocation' in navigator)) {
                onGeoLocationError({
                    code: 0,
                    message: 'Geolocation not supported',
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3,
                } as GeolocationPositionError);
            } else {
                navigator.geolocation.getCurrentPosition(
                    onGeoLocationSuccess,
                    onGeoLocationError
                );
            }
        }
    }, [mode]);

    useEffect(() => {
        if (location.coordinates) {
            const { lat, lon } = location.coordinates;
            fetchWeatherData(lat, lon)
                .then((weatherData) => {
                    const { temp, feels_like, humidity, wind_speed, weather } =
                        weatherData;
                    setImage(weather[0].icon);

                    fetchAIDescription(
                        temp,
                        feels_like,
                        humidity,
                        wind_speed,
                        weather,
                        location
                    )
                        .then((description: string) =>
                            setAIDescription(description)
                        )
                        .catch(); // TODO: handle error
                })
                .catch(); // TODO: handle error
        }
    }, [location]);

    function reset() {
        setMode(null);
        setLocation({});
    }

    return (
        <div>
            <h1>Get the w3ather!</h1>
            {loading ? (
                <Loader />
            ) : mode === null ? (
                <>
                    <button
                        className={styles.raise}
                        onClick={() => {
                            setMode(Mode.Location);
                            if (!location.coordinates) {
                                setLoading(true);
                            }
                        }}
                    >
                        Use Location
                    </button>
                    <button
                        className={styles.raise}
                        onClick={() => setMode(Mode.Custom)}
                    >
                        Choose Custom Location
                    </button>
                </>
            ) : mode === Mode.Custom ? (
                <SelectCustom setLocation={setLocation} />
            ) : mode === Mode.Location ? (
                <>
                    {location.error?.message && (
                        <div>{`Error: ${location.error.message}`}</div>
                    )}
                </>
            ) : null}
            {mode !== null && (
                <>
                    {image && location.coordinates && (
                        <img
                            className={styles.weatherImg}
                            src={`http://openweathermap.org/img/wn/${image}.png`}
                            alt="weather icon"
                        />
                    )}
                    {aiDescription ? <p>{aiDescription}</p> : <Loader />}
                    {location.coordinates && (
                        <h3>
                            {`Latitude: ${location.coordinates.lat}, Longitude: ${location.coordinates.lon}`}
                        </h3>
                    )}
                    <button className={styles.offset} onClick={reset}>
                        Back
                    </button>
                </>
            )}
        </div>
    );
};

export default React.memo(App);

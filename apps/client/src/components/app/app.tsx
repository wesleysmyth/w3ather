import styles from './app.module.scss';
import React, { useState, useReducer, useEffect } from 'react';
import Loader from '../loader';
import SelectCustom from '../selectCustom';
import { Mode } from '../../enums';
import { ReducerState, LocationState, ModeState } from '../../types';
import { fetchWeatherData, fetchAIDescription } from '../../api/weather';
import { initialAppState, appReducer } from '../../reducers/appReducer';
import {
    useGeoLocation,
    GeoLocationDispatchType,
} from '../../hooks/useGeoLocation';
import { ActionType } from '../../enums';
const { Reset, SetMode, SetLocation, SetAiDescription, SetName, SetImage } =
    ActionType;

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialAppState);
    const [loading, setLoading] = useState(false);
    const { onGeoLocationSuccess, onGeoLocationError } = useGeoLocation(
        dispatch as GeoLocationDispatchType,
        SetLocation,
        setLoading
    );
    const { mode, location, aiDescription, name, image } = state;

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
                    onGeoLocationError,
                    { timeout: 10000, enableHighAccuracy: true }
                );
            }
        }
    }, [mode]);

    useEffect(() => {
        if (location.coordinates) {
            const { lat, lon } = location.coordinates;

            setLoading(true);

            fetchWeatherData(lat, lon)
                .then((weatherData) => {
                    if (loading) {
                        const {
                            main: { temp, feels_like, humidity },
                            wind: { speed },
                            weather,
                            name,
                        } = weatherData;
                        dispatch({ type: SetImage, payload: weather[0].icon });
                        dispatch({ type: SetName, payload: name });

                        fetchAIDescription({
                            temp,
                            feels_like,
                            humidity,
                            weather,
                            location,
                            wind_speed: speed,
                        })
                            .then((description: string) => {
                                if (loading) {
                                    dispatch({
                                        type: SetAiDescription,
                                        payload: description,
                                    });
                                    setLoading(false);
                                }
                            })
                            .catch(() => {
                                dispatch({
                                    type: SetAiDescription,
                                    payload:
                                        'Error generating weather description',
                                });
                                setLoading(false);
                            });
                    }
                })
                .catch(() => {
                    dispatch({
                        type: SetLocation,
                        payload: {
                            error: {
                                code: 500,
                                message: 'Error fetching weather data',
                            },
                        },
                    });
                    setLoading(false);
                });
        }
    }, [location]);

    function reset() {
        setLoading(false);
        dispatch({ type: Reset });
    }

    return (
        <>
            <header>
                <h1>Get the w3ather</h1>
            </header>
            <section className={styles.content}>
                {loading && <Loader />}
                {location.error?.message && (
                    <p
                        className={styles.description}
                    >{`Error: ${location.error.message}`}</p>
                )}
                {mode === Mode.Custom && (
                    <SelectCustom
                        setLocation={(location: LocationState) =>
                            dispatch({ type: SetLocation, payload: location })
                        }
                        setAiDescription={(description: string) =>
                            dispatch({
                                type: SetAiDescription,
                                payload: description,
                            })
                        }
                        setLoading={setLoading}
                    />
                )}
                {aiDescription && (
                    <p className={styles.description}>{aiDescription}</p>
                )}
            </section>
            <footer>
                {mode === null ? (
                    <>
                        <button
                            className={styles.raise}
                            onClick={() => {
                                setLoading(true);
                                dispatch({
                                    type: SetMode,
                                    payload: Mode.Location,
                                });
                            }}
                        >
                            Use Current Location
                        </button>
                        <button
                            className={styles.raise}
                            onClick={() =>
                                dispatch({
                                    type: SetMode,
                                    payload: Mode.Custom,
                                })
                            }
                        >
                            Choose Custom Location
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.nameAndIcon}>
                            {image && location.coordinates && (
                                <img
                                    className={styles.weatherImg}
                                    src={`http://openweathermap.org/img/wn/${image}.png`}
                                    alt="weather icon"
                                />
                            )}
                            {name && <h2>{name}</h2>}
                        </div>
                        {location.coordinates && (
                            <h3>
                                {`Latitude: ${location.coordinates.lat}, Longitude: ${location.coordinates.lon}`}
                            </h3>
                        )}
                        <button
                            className={styles.offset}
                            onClick={reset}
                            disabled={loading}
                        >
                            Back
                        </button>
                    </>
                )}
            </footer>
        </>
    );
};

export default React.memo(App);

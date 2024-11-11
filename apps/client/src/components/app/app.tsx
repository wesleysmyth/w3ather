import styles from './app.module.scss';
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import Loader from '../loader';
import SelectCustom from '../selectCustom';
import { Mode } from '../../enums';
import { LocationState } from '../../types';
import { initialAppState, appReducer } from '../../reducers/appReducer';
import {
    useGeoLocation,
    GeoLocationDispatchType,
} from '../../hooks/useGeoLocation';
import useFetchWeatherInfo from '../../hooks/useFetchWeatherInfo';
import { ActionType } from '../../enums';

const { Reset, SetMode, SetLocation, SetAiDescription, SetName, SetImage } =
    ActionType;

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialAppState);
    const [loading, setLoading] = useState(false);
    const { mode, location, aiDescription, name, image } = state;
    const { fetchWeatherInfo } = useFetchWeatherInfo({
        location,
        dispatch,
        setLoading,
    });
    const { onGeoLocationSuccess, onGeoLocationError } = useGeoLocation(
        dispatch as GeoLocationDispatchType,
        SetLocation,
        setLoading
    );

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
    }, [mode, onGeoLocationSuccess, onGeoLocationError]);

    useEffect(() => {
        fetchWeatherInfo();
    }, [fetchWeatherInfo]);

    const reset = useCallback(() => {
        setLoading(false);
        dispatch({ type: Reset });
    }, [dispatch]);

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
                        setAiDescription={(aiDescription: string) =>
                            dispatch({
                                type: SetAiDescription,
                                payload: aiDescription,
                            })
                        }
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

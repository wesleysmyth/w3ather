import { useCallback, useState } from 'react';
import { fetchWeatherData, fetchAIDescription } from '../api/weather';
import { LocationState, ModeState } from '../types';
import { ActionType } from '../enums';
import { Action } from '../reducers/appReducer';

interface UseFetchWeatherInfoProps {
    location: LocationState;
    dispatch: React.Dispatch<Action>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const { SetImage, SetName, SetAiDescription, SetLocation } = ActionType;

const useFetchWeatherInfo = ({
    location,
    dispatch,
    setLoading,
}: UseFetchWeatherInfoProps) => {
    const fetchWeatherInfo = useCallback(async () => {
        if (location.coordinates) {
            const { lat, lon } = location.coordinates;
            setLoading(true);

            try {
                const weatherData = await fetchWeatherData(lat, lon);
                const {
                    main: { temp, feels_like, humidity },
                    wind: { speed },
                    weather,
                    name,
                } = weatherData;

                dispatch({ type: SetImage, payload: weather[0].icon });
                dispatch({ type: SetName, payload: name });

                const description = await fetchAIDescription({
                    temp,
                    feels_like,
                    humidity,
                    weather,
                    location,
                    wind_speed: speed,
                });
                dispatch({ type: SetAiDescription, payload: description });
            } catch (error) {
                dispatch({
                    type: SetLocation,
                    payload: {
                        error: {
                            code: 500,
                            message: 'Error fetching weather data',
                        },
                    },
                });
            } finally {
                setLoading(false);
            }
        }
    }, [location.coordinates, dispatch, setLoading]);

    return { fetchWeatherInfo };
};

export default useFetchWeatherInfo;

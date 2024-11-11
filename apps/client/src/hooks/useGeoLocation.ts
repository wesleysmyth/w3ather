import { useCallback } from 'react';
import { Coordinates } from '../types';

interface SetLocationAction {
    type: string;
    payload: {
        coordinates?: Coordinates;
        error?: {
            code: number;
            message: string;
        };
    };
}

export type GeoLocationDispatchType = (action: SetLocationAction) => void;

export const useGeoLocation = (
    dispatch: GeoLocationDispatchType,
    SetLocation: string,
    setLoading: (loading: boolean) => void
) => {
    const onGeoLocationSuccess = useCallback(
        ({ coords: { latitude, longitude } }: GeolocationPosition) => {
            dispatch({
                type: SetLocation,
                payload: {
                    coordinates: {
                        lat: latitude,
                        lon: longitude,
                    },
                },
            });
        },
        [dispatch, SetLocation]
    );
    const onGeoLocationError = useCallback(
        (error: GeolocationPositionError) => {
            const errorMessages: { [key: number]: string } = {
                1: 'You denied the request for Geolocation.',
                2: 'Your location information is unavailable.',
                3: 'The request to fetch the current location of your device timed out. Please try again.',
            };

            const message =
                errorMessages[error.code] || 'An unknown error occurred.';
            setLoading(false);
            dispatch({
                type: SetLocation,
                payload: {
                    error: {
                        code: error.code,
                        message,
                    },
                },
            });
        },
        [dispatch, SetLocation]
    );

    return { onGeoLocationSuccess, onGeoLocationError };
};

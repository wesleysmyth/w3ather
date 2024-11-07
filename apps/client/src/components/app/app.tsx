import './app.module.scss';
import React, { useState, useEffect } from 'react';
import Loader from '../loader';

interface Coordinates {
    lat: number;
    lon: number;
}

interface LocationState {
    loading: boolean;
    coordinates?: Coordinates;
    error?: {
        code: number;
        message: string;
    };
}

const GeolocationExample: React.FC = () => {
    const [location, setLocation] = useState<LocationState>({
        loading: false,
    });
    const onSuccess = (location: GeolocationPosition) => {
        const {
            coords: { latitude, longitude },
        } = location;
        setLocation({
            loading: true,
            coordinates: {
                lat: latitude,
                lon: longitude,
            },
        });
    };
    const onError = (error: GeolocationPositionError) => {
        let message: string;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'You denied the request for Geolocation.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Your location information is unavailable.';
                break;
            case error.TIMEOUT:
                message = 'Your request timed out. Please try again.';
                break;
            default:
                message = 'An unknown error occurred.';
                break;
        }
        setLocation({
            loading: true,
            error: {
                code: error.code,
                message,
            },
        });
    };

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            onError({
                ...GeolocationPositionError,
                code: 0,
                message: 'Geolocation not supported',
            });
        } else {
            console.log('asking for permission');
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    }, []);

    return (
        <div>
            <h1>Geolocation Example</h1>
            {location.loading ? (
                location.error ? (
                    <div>Error: {location.error.message}</div>
                ) : (
                    <div>
                        Latitude: {location.coordinates?.lat}
                        <br />
                        Longitude: {location.coordinates?.lon}
                    </div>
                )
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default GeolocationExample;

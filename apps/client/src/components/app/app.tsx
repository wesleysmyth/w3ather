import './app.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../loader';
import SelectCustom from '../selectCustom';
import { Mode } from '../../enums/modes';
import { LocationState, ModeState } from '../../types';

const App: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationState>({});
    const [mode, setMode] = useState<ModeState>(null);
    const onSuccess = useCallback(
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
    const onError = useCallback((error: GeolocationPositionError) => {
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
    }, []);

    useEffect(() => {
        if (mode === Mode.Location) {
            if (!('geolocation' in navigator)) {
                onError({
                    code: 0,
                    message: 'Geolocation not supported',
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3,
                } as GeolocationPositionError);
            } else {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
        }
    }, [mode]);

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
                        onClick={() => {
                            setMode(Mode.Custom);
                        }}
                    >
                        Choose Custom Location
                    </button>
                </>
            ) : mode === Mode.Custom ? (
                <SelectCustom setLocation={setLocation} />
            ) : mode === Mode.Location ? (
                <>
                    <div>Prompt for location</div>
                    {location.error?.message && (
                        <div>{`Error: ${location.error.message}`}</div>
                    )}
                </>
            ) : null}
            {mode !== null && <button onClick={reset}>Back</button>}
            <h2>
                {location.coordinates &&
                    `Latitude: ${location.coordinates.lat}, Longitude: ${location.coordinates.lon}`}
            </h2>
        </div>
    );
};

export default React.memo(App);

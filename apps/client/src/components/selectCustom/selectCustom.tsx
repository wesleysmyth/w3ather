/// <reference types="google.maps" />
import React, { useState, useCallback } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
    Suggestion,
} from 'react-places-autocomplete';
import { LocationState } from '../../types';

interface LocationSearchInputProps {
    setLocation: (location: LocationState) => void;
    setAiDescription: (aiDescription: string) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
    setLocation,
    setAiDescription,
}) => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const handleChange = useCallback((newAddress: string) => {
        setAddress(newAddress);
        setError(null);
    }, []);

    const handleSelect = useCallback(
        (selectedAddress: string) => {
            setAddress(selectedAddress);
            setAiDescription('');
            geocodeByAddress(selectedAddress)
                .then((results: google.maps.GeocoderResult[]) =>
                    getLatLng(results[0])
                )
                .then(({ lat, lng }) =>
                    setLocation({
                        coordinates: {
                            lat,
                            lon: lng,
                        },
                    })
                )
                .catch((error) => {
                    setError('Failed to fetch location. Please try again.');
                });
        },
        [setLocation]
    );

    const SuggestionItem: React.FC<{
        suggestion: Suggestion;
        getSuggestionItemProps: (
            suggestion: Suggestion,
            options?: { className: string; style: { [key: string]: string } }
        ) => { [key: string]: any };
    }> = ({ suggestion, getSuggestionItemProps }) => {
        const className = suggestion.active
            ? 'suggestion-item--active'
            : 'suggestion-item';
        const style = {
            backgroundColor: suggestion.active ? '#fafafa' : '#ffffff',
            cursor: 'pointer',
            color: '#00008b',
        };

        return (
            <div
                {...getSuggestionItemProps(suggestion, { className, style })}
                key={suggestion.placeId}
            >
                <span>{suggestion.description}</span>
            </div>
        );
    };

    return (
        <div>
            <h2>Location</h2>
            <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
                debounce={300}
            >
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                                'aria-label': 'Search for a location',
                            })}
                        />
                        <div
                            className="autocomplete-dropdown-container"
                            aria-live="polite"
                        >
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => (
                                <SuggestionItem
                                    key={suggestion.placeId}
                                    suggestion={suggestion}
                                    getSuggestionItemProps={
                                        getSuggestionItemProps
                                    }
                                />
                            ))}
                        </div>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    );
};

export default React.memo(LocationSearchInput);

/// <reference types="google.maps" />
import React, { useState, useCallback } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { LocationState } from '../../types';

interface LocationSearchInputProps {
    setLocation: (location: LocationState) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
    setLocation,
}) => {
    const [address, setAddress] = useState('');

    const handleChange = useCallback((address: string) => {
        setAddress(address);
    }, []);
    const handleSelect = useCallback((address: string) => {
        geocodeByAddress(address)
            .then((results: google.maps.GeocoderResult[]) =>
                getLatLng(results[0])
            )
            .then(({ lat, lng }: { lat: number; lng: number }) =>
                setLocation({
                    coordinates: {
                        lat,
                        lon: lng,
                    },
                })
            )
            .catch((error: Error) => console.error('Error', error));
    }, []);

    return (
        <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
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
                        })}
                    />
                    <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                            const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                            const style = suggestion.active
                                ? {
                                      backgroundColor: '#fafafa',
                                      cursor: 'pointer',
                                  }
                                : {
                                      backgroundColor: '#ffffff',
                                      cursor: 'pointer',
                                  };
                            return (
                                <div
                                    // @ts-ignore
                                    key={suggestion.placeId}
                                    {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
};

export default LocationSearchInput;

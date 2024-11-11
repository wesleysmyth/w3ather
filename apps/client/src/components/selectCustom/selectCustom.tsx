/// <reference types="google.maps" />
import React, { useState, useCallback } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import styles from './selectCustom.module.scss';
import { LocationState } from '../../types';

interface LocationSearchInputProps {
    setLocation: (location: LocationState) => void;
    setLoading: (loading: boolean) => void;
    setAiDescription: (aiDescription: string) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
    setLocation,
    setLoading,
    setAiDescription,
}) => {
    const [address, setAddress] = useState('');
    const handleChange = useCallback((address: string) => {
        setAddress(address);
    }, []);
    const handleSelect = useCallback((address: string) => {
        setAiDescription('');
        setLoading(true);
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
        <>
            <h2>Choose a location</h2>
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
                    <>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                            })}
                        />
                        <div
                            className={
                                suggestions.length
                                    ? styles.autocompleteDropdownContainer
                                    : ''
                            }
                        >
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                                const { placeId, active, description } =
                                    suggestion;
                                const className = active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = active
                                    ? {
                                          backgroundColor: '#fafafa',
                                          cursor: 'pointer',
                                      }
                                    : {
                                          backgroundColor: '#ffffff',
                                          cursor: 'pointer',
                                      };
                                const suggestionItemProps = {
                                    ...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                    }),
                                };
                                const { key, ...rest } = suggestionItemProps;
                                return (
                                    <div key={placeId} {...rest}>
                                        <span>{description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </PlacesAutocomplete>
        </>
    );
};

export default LocationSearchInput;

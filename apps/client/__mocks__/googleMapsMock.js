global.google = {
    maps: {
        places: {
            AutocompleteService: class {},
            PlacesServiceStatus: {
                OK: 'OK',
            },
        },
        Geocoder: class {},
        GeocoderStatus: {
            OK: 'OK',
        },
        LatLng: class {
            constructor(lat, lng) {
                return { lat, lng };
            }
        },
        Marker: class {},
        Map: class {},
    },
};

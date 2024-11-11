import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './';
import { LocationState } from '../../types';

jest.mock('../loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock(
    '../selectCustom',
    () =>
        ({ setLocation }: { setLocation: (location: LocationState) => void }) =>
            (
                <div data-testid="select-custom">
                    <button
                        onClick={() =>
                            setLocation({
                                coordinates: { lat: 40.7128, lon: -74.006 },
                            })
                        }
                    >
                        Select Custom Location
                    </button>
                </div>
            )
);
jest.mock('../../hooks/useGeoLocation', () => ({
    useGeoLocation: () => ({
        onGeoLocationSuccess: jest.fn(),
        onGeoLocationError: jest.fn(),
    }),
}));
jest.mock('../../hooks/useFetchWeatherInfo', () => ({
    __esModule: true,
    default: jest.fn(() => ({ fetchWeatherInfo: jest.fn() })),
}));

describe('App Component', () => {
    it('renders the header title', () => {
        render(<App />);
        expect(screen.getByText(/Get the w3ather/i)).toBeInTheDocument();
    });

    it('renders the loading indicator when loading', () => {
        render(<App />);
        const useCurrentLocationButton = screen.getByText(
            'Use Current Location'
        );
        fireEvent.click(useCurrentLocationButton);

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('renders SelectCustom component when mode is set to custom', () => {
        render(<App />);

        const chooseCustomLocationButton = screen.getByText(
            'Choose Custom Location'
        );
        fireEvent.click(chooseCustomLocationButton);

        expect(screen.getByTestId('select-custom')).toBeInTheDocument();
    });

    it('updates location and displays coordinates after custom selection', async () => {
        render(<App />);

        const chooseCustomLocationButton = screen.getByText(
            'Choose Custom Location'
        );
        fireEvent.click(chooseCustomLocationButton);

        const selectCustomButton = screen.getByText('Select Custom Location');
        fireEvent.click(selectCustomButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Latitude: 40.7128, Longitude: -74.006/)
            ).toBeInTheDocument();
        });
    });

    it('resets state when Back button is clicked', async () => {
        render(<App />);

        const chooseCustomLocationButton = screen.getByText(
            'Choose Custom Location'
        );
        fireEvent.click(chooseCustomLocationButton);

        expect(screen.getByTestId('select-custom')).toBeInTheDocument();

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(
                screen.queryByTestId('select-custom')
            ).not.toBeInTheDocument();
            expect(screen.queryByText(/Latitude/)).not.toBeInTheDocument();
            expect(screen.queryByText(/Longitude/)).not.toBeInTheDocument();
        });
    });
});

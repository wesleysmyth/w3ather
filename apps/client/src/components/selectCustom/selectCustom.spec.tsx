import '../../../__mocks__/googleMapsMock';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import SelectCustom from '.';

jest.mock('react-places-autocomplete', () => {
    return ({ children, value, onChange, onSelect }: any) => (
        <div>
            <input
                placeholder="Search Places ..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="autocomplete-dropdown-container">
                {children({
                    getInputProps: () => ({ value, onChange }),
                    suggestions: [
                        {
                            active: false,
                            description: 'New York',
                            placeId: '1',
                        },
                        {
                            active: true,
                            description: 'Los Angeles',
                            placeId: '2',
                        },
                    ],
                    getSuggestionItemProps: (suggestion: Suggestion) => {
                        const props = {
                            onClick: () => onSelect(suggestion.description),
                        };
                        return { ...props };
                    },
                    loading: false,
                })}
            </div>
        </div>
    );
});

describe('SelectCustom Component', () => {
    const setLocationMock = jest.fn();

    beforeEach(() => {
        setLocationMock.mockClear();
    });

    it('renders the input field with the correct placeholder', () => {
        render(<SelectCustom setLocation={setLocationMock} />);
        expect(
            screen.getByPlaceholderText('Search Places ...')
        ).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(<SelectCustom setLocation={setLocationMock} />);
        const input = screen.getByPlaceholderText('Search Places ...');
        fireEvent.change(input, { target: { value: 'San Francisco' } });
        expect(input).toHaveValue('San Francisco');
    });

    it('displays suggestions correctly', () => {
        render(<SelectCustom setLocation={setLocationMock} />);

        // Expect the suggestions to appear
        expect(screen.getByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    });
});

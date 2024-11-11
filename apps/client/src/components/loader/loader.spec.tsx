import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './';

describe('Loader Component', () => {
    let loader: HTMLElement;

    beforeEach(() => {
        loader = render(<Loader />).container;
    });

    it('renders the Loader container', () => {
        const container = loader.querySelector('.container');
        expect(container).toHaveClass('container');
    });

    it('renders two Cloud components with the correct positions', () => {
        const clouds = loader.querySelectorAll('.cloud');
        expect(clouds).toHaveLength(2);
        expect(clouds[0]).toHaveClass('cloud', 'front');
        expect(clouds[1]).toHaveClass('cloud', 'back');
    });

    it('renders the Sun component with the correct class names', () => {
        const sunElements = loader.querySelectorAll('.sun');
        expect(sunElements).toHaveLength(2);
        expect(sunElements[0]).toHaveClass('sun', 'sunshine');
        expect(sunElements[1]).toHaveClass('sun');
    });
});

import { render } from '@testing-library/react';
import SelectCustom from '.';

describe('SelectCustom', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<SelectCustom />);
        expect(baseElement).toBeTruthy();
    });
});

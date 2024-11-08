import { Mode } from '../enums/modes';

interface Coordinates {
    lat: number;
    lon: number;
}

interface LocationState {
    coordinates?: Coordinates;
    error?: {
        code: number;
        message: string;
    };
}

type ModeState = Mode | null;

export { Coordinates, LocationState, ModeState };

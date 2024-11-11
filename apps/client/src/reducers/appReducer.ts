import { ReducerState, ModeState, LocationState } from '../types';
import { ActionType } from '../enums';

export type Action =
    | { type: ActionType.Reset }
    | { type: ActionType.SetMode; payload: ModeState }
    | { type: ActionType.SetLocation; payload: LocationState }
    | { type: ActionType.SetAiDescription; payload: string }
    | { type: ActionType.SetName; payload: string }
    | { type: ActionType.SetImage; payload: string };

export const initialAppState: ReducerState = {
    mode: null,
    location: {},
    aiDescription: null,
    name: null,
    image: null,
};

export function appReducer(
    state: ReducerState = initialAppState,
    action: Action
): ReducerState {
    switch (action.type) {
        case 'RESET':
            return initialAppState;
        case 'SET_MODE':
            return { ...state, mode: action.payload };
        case 'SET_LOCATION':
            return { ...state, location: action.payload };
        case 'SET_AI_DESCRIPTION':
            return { ...state, aiDescription: action.payload };
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_IMAGE':
            return { ...state, image: action.payload };
        default:
            return state;
    }
}

import { Game } from "../app";

export type Direction = 'top' | 'bottom' | 'right' | 'left';

export type IndependentCallback = () => void;

export type UpdateHandler = (game: Game, delta: number) => void;
export type StateMachine<S, T> = {
    state: () => S;
    transition: (transition: T) => void;
    registerCallback: (state: S, independentCallback: IndependentCallback) => void;
}

export type CollisionType = 'static' | 'platform' | 'none' | 'dynamic';

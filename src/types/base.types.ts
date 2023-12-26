import { Game } from "../app";

export type UpdateHandler = (game: Game, delta: number) => void;

export type StateMachine<S, T> = {
    state: () => S;
    transition: (transition: T) => void;
}

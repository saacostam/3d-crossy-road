import { Mesh, Vector3 } from "@babylonjs/core";
import { Game } from "../app";
import { Tile } from "../object";

export type Direction = 'top' | 'bottom' | 'right' | 'left';

export type IndependentCallback = () => void;

export type UpdateHandler = (game: Game, delta: number) => void;
export type StateMachine<S, T> = {
    state: () => S;
    transition: (transition: T) => void;
    registerCallback: (state: S, independentCallback: IndependentCallback) => void;
}

export type CollisionType = 'static' | 'platform' | 'none' | 'dynamic';

export type StaticEntityOptions = {
    x: number;
    z: number;
}

export type DynamicEntityOptions = {
    direction: Direction;
    start: Vector3;
    end: Vector3;
    pathProgress: number;
    velocity: number;

    width: number;
    height: number;
    depth: number;
}

export type MetaTile = {
    tile: Tile,
    x: number;
}

export type AnchoredChildMesh = {
    mesh: Mesh;
    anchorToParent: Vector3;
}
import { Vector3 } from "@babylonjs/core";

import { Entity, Log, Tile } from "../..";
import { BASE_SIZE } from "../../../config";
import { BaseScene } from "../../../scene";
import { Direction } from "../../../types";

import { TileFactory } from "./factory.type";

const trackTileObjectsConstructors = [
    Log,
]

export const RiverTileFactory: TileFactory = (scene: BaseScene, amount: number, tile: Tile): Entity[] => {
    amount = Math.max(2, amount);

    const factoryEntityProducts: Entity[] = [];

    const direction: Direction = Math.random() < 0.5 ? 'right' : 'left';
    const velocity = 0.00005 + (Math.random() * 0.00003);

    const MIN = tile._mesh.position.z - tile.depth/2;
    const MAX = tile._mesh.position.z + tile.depth/2;

    const SIZE = BASE_SIZE * 3 / 4;
    const HEIGHT = SIZE;

    const start = new Vector3( tile._mesh.position.x, -HEIGHT/2, (direction === 'right') ? MIN : MAX);
    const end = new Vector3( tile._mesh.position.x, -HEIGHT/2, (direction === 'right') ? MAX : MIN);

    let currPathProgress = Math.random();
    const TrackObjectConstructor = trackTileObjectsConstructors[Math.floor(trackTileObjectsConstructors.length * Math.random())];
    
    for (let iter = 0; iter <= amount; iter++){
        const entity = new TrackObjectConstructor(scene, {
            direction: direction,
            start: start,
            end: end,
            width: SIZE,
            depth: SIZE*4,
            height: HEIGHT,
            velocity: velocity,
            pathProgress: currPathProgress,
        });
    
        factoryEntityProducts.push(entity);

        currPathProgress = (currPathProgress + 1/amount) % 1;
    }

    return factoryEntityProducts;
}

import { Vector3 } from "@babylonjs/core";

import { Car, Entity, Tile } from "../..";
import { BASE_SIZE } from "../../../config";
import { BaseScene } from "../../../scene";
import { Direction } from "../../../types";

import { TileFactory } from "./factory.type";

const trackTileObjectsConstructors = [
    Car,
]

export const TrackTileFactory: TileFactory = (scene: BaseScene, amount: number, tile: Tile): Entity[] => {
    const factoryEntityProducts: Entity[] = [];

    const direction: Direction = Math.random() < 0.5 ? 'right' : 'left';

    const MIN = tile._mesh.position.z - tile.depth/2;
    const MAX = tile._mesh.position.z + tile.depth/2;

    const SIZE = BASE_SIZE * 3 / 4;
    const HEIGHT = SIZE;

    const start = new Vector3( tile._mesh.position.x, HEIGHT/2, (direction === 'right') ? MIN : MAX);
    const end = new Vector3( tile._mesh.position.x, HEIGHT/2, (direction === 'right') ? MAX : MIN);

    const velocity = 0.00012 + (Math.random() * 0.00006)

    start.y += HEIGHT/8;
    end.y += HEIGHT/8;

    let currPathProgress = Math.random();
    const TrackObjectConstructor = trackTileObjectsConstructors[Math.floor(trackTileObjectsConstructors.length * Math.random())];
    
    for (let iter = 0; iter <= amount; iter++){
        const entity = new TrackObjectConstructor(scene, {
            direction: direction,
            start: start,
            end: end,
            width: SIZE,
            depth: SIZE*3,
            height: HEIGHT,
            pathProgress: currPathProgress,
            velocity: velocity,
        });
    
        factoryEntityProducts.push(entity);

        currPathProgress = (currPathProgress + 1/amount) % 1;
    }

    return factoryEntityProducts;
}

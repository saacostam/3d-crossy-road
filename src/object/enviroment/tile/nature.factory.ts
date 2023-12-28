import { Entity, Stone, Tile, Tree } from "../..";
import { BaseScene } from "../../../scene";
import { TileFactory } from "./factory.type";

const natureTileObjectsConstructors = [
    Stone,
    Tree,
]

export const NatureTileFactory: TileFactory = (scene: BaseScene, amount: number, tile: Tile): Entity[] => {
    const factoryEntityProducts: Entity[] = [];

    const MIN = tile._mesh.position.z - tile.depth/2;
    const MAX = tile._mesh.position.z + tile.depth/2;

    for (let iter = 0; iter < amount; iter++){
        const z = MIN + ((MAX - MIN) * Math.random());

        const NatureObjectConstructor = natureTileObjectsConstructors[Math.floor(natureTileObjectsConstructors.length * Math.random())];
        const entity = new NatureObjectConstructor(scene, {
            x: tile._mesh.position.x,
            z: z,
        });

        factoryEntityProducts.push(entity);
    }

    return factoryEntityProducts;
}

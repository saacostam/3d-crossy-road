import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "../..";
import { BASE_SIZE } from "../../../config";
import { BaseScene } from "../../../scene";
import { TileFactoryType, TileFactoryTypeArray } from "./factory.type";
import { NatureTileFactory } from "./nature.factory";
import { EmptyTileFactory } from "./empty.factory";

type TileOptions = {
    x: number;
    z: number;
    width: number;
    depth: number;
    isEmpty?: boolean;
}

export class Tile extends Entity{
    public width: number;
    public depth: number;
    private isEmpty: boolean;

    constructor(scene: BaseScene, options: TileOptions){
        super(scene);

        this.width = options.width;
        this.depth = options.depth;

        this.mesh = MeshBuilder.CreateBox('TILE-MESH', {
            width: this.width,
            height: BASE_SIZE,
            depth: this.depth,
        }, scene);

        this._mesh.position = new Vector3(
            options.x,
            -BASE_SIZE/2,
            options.z,
        );

        this._mesh.material = new StandardMaterial('TILE-MESH-MATERIAL', scene);
        if (this._mesh.material instanceof StandardMaterial) this._mesh.material.diffuseColor = Color3.Random();

        this.isEmpty = !!options.isEmpty;
    }

    public onEnterScene(_scene: BaseScene): void {
        const N_ENTITIES_TO_ADD = Math.floor(2 * Math.random());
        let ENTITIES_TO_ADD: Entity[] = [];

        const TILE_TYPE: TileFactoryType = TileFactoryTypeArray[Math.floor(TileFactoryTypeArray.length * Math.random())];

        const TileFactory = this.isEmpty
            ? EmptyTileFactory
            : TILE_TYPE === 'nature'
            ? NatureTileFactory
            : EmptyTileFactory;

        ENTITIES_TO_ADD = TileFactory(_scene, N_ENTITIES_TO_ADD, this);
        ENTITIES_TO_ADD.forEach(entity => _scene.addEntity(entity));
    }
}
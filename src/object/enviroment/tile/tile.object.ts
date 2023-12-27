import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "../..";
import { Game } from "../../../app";
import { BASE_SIZE } from "../../../config";
import { BaseScene } from "../../../scene";

import { TileFactoryType, TileFactoryTypeArray } from "./factory.type";
import { NatureTileFactory } from "./nature.factory";
import { EmptyTileFactory } from "./empty.factory";
import { TrackTileFactory } from "./track.factory";
import { RiverTileFactory } from "./river.factory";

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

    private objects: Entity[] = [];
    private isEmpty: boolean;
    private tileType: TileFactoryType = TileFactoryTypeArray[Math.floor(TileFactoryTypeArray.length * Math.random())];

    constructor(scene: BaseScene, options: TileOptions){
        super(scene);

        this.isEmpty = !!options.isEmpty;
        this.width = options.width;
        this.depth = options.depth;

        if (this.isEmpty || this.tileType !== 'river'){
            this.mesh = MeshBuilder.CreateBox('TILE-MESH', {
                width: this.width,
                height: BASE_SIZE,
                depth: this.depth,
            }, scene);
        }

        this._mesh.position = new Vector3(
            options.x,
            -BASE_SIZE/2,
            options.z,
        );

        this._mesh.material = new StandardMaterial('TILE-MESH-MATERIAL', scene);
        if (this._mesh.material instanceof StandardMaterial) this._mesh.material.diffuseColor = Color3.Random();
    }

    public onEnterScene(_scene: BaseScene): void {
        const N_ENTITIES_TO_ADD = Math.floor(5 * Math.random());

        const TileFactory = this.isEmpty
            ? EmptyTileFactory
            : this.tileType === 'nature'
            ? NatureTileFactory
            : this.tileType === 'track'
            ? TrackTileFactory
            : this.tileType === 'river'
            ? RiverTileFactory
            : NatureTileFactory;

        this.objects = TileFactory(_scene, N_ENTITIES_TO_ADD, this);
        this.objects.forEach(entity => _scene.addEntity(entity));
    }

    public update(_game: Game, _delta: number): void {
        this.objects.forEach(entity => entity.update(_game, _delta));
    }
}

import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity, WaterLimit } from "../..";
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
    private height: number;

    private objects: Entity[] = [];
    private isEmpty: boolean;
    private tileType: TileFactoryType = TileFactoryTypeArray[Math.floor(TileFactoryTypeArray.length * Math.random())];

    constructor(scene: BaseScene, options: TileOptions){
        super(scene);

        this.isEmpty = !!options.isEmpty;
        if (this.isEmpty) this.tileType = 'empty';

        this.width = options.width;
        this.depth = options.depth;
        this.height = (this.tileType === 'river') ? BASE_SIZE*7/8 : BASE_SIZE;

        this.mesh = MeshBuilder.CreateBox('TILE-MESH', {
            width: this.width,
            height: this.height,
            depth: this.depth,
        }, scene);

        this._mesh.position = new Vector3(
            options.x,
            -BASE_SIZE/2,
            options.z,
        );

        this._mesh.material = new StandardMaterial('TILE-MESH-MATERIAL', scene);
        if (this._mesh.material instanceof StandardMaterial) this._mesh.material.diffuseColor = 
            (this.tileType === 'track') 
            ? new Color3(0.15, 0.15, 0.15) 
            : (this.tileType === 'river')
            ? new Color3(0.5, 0.75, 0.85)
            : new Color3(0.6, 0.85, 0.5);

        this.collisionType = (this.tileType === 'river') ? 'dynamic' : 'none';
    }

    private addWaterLimit(scene: BaseScene){
        const [leftWaterLimit, rightWaterLimit] = [
            new WaterLimit(scene, {
                position: this._mesh.position.clone().add(new Vector3(0, this.height/2, +this.depth/2 - this.width/8)),
                size: this.width,
            }),
            new WaterLimit(scene, {
                position: this._mesh.position.clone().add(new Vector3(0, this.height/2, -this.depth/2 + this.width/8)),
                size: this.width,
            })
        ];

        scene.addEntity(leftWaterLimit);
        this.objects.push(leftWaterLimit);

        scene.addEntity(rightWaterLimit);
        this.objects.push(rightWaterLimit);
    }

    public onEnterScene(_scene: BaseScene): void {
        const N_ENTITIES_TO_ADD = 1 + Math.floor(3 * Math.random());

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

        switch (this.tileType){
            case 'river':
                this.addWaterLimit(_scene);
                break;
        }
    }

    public update(_game: Game, _delta: number): void {
        this.objects.forEach(entity => entity.update(_game, _delta));
    }

    public kill(): void {
        super.kill();
        this.objects.forEach(obj => {
            this.scene.removeMesh(obj._mesh);
            obj.kill();
        });
        this.objects = [];
    }
}

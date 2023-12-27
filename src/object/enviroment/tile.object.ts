import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity, Stone, Tree } from "..";
import { BASE_SIZE } from "../../config";
import { BaseScene } from "../../scene";

type TileOptions = {
    x: number;
    z: number;
    width: number;
    depth: number;
}

export class Tile extends Entity{
    private width: number;
    private depth: number;

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
    }

    public onEnterScene(_scene: BaseScene): void {
        const ENTITIES_TO_ADD = Math.floor(2 * Math.random());

        for (let iter = 0; iter < ENTITIES_TO_ADD; iter++){
            const MIN = this._mesh.position.z - this.depth/2;
            const MAX = this._mesh.position.z + this.depth/2;

            const z = MIN + ((MAX - MIN) * Math.random());
            
            const constructor = Math.random() < 0.5 ? Tree : Stone;
            const entity = new constructor(this.scene, {
                x: this._mesh.position.x,
                z: z,
            });
            _scene.addEntity(entity);
        }
    }
}
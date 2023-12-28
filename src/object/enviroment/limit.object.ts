import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { BaseScene } from "../../scene";

type TileOptions = {
    x: number;
    z: number;
    width: number;
    depth: number;
}

export class Limit extends Entity{
    public width: number;
    public depth: number;

    constructor(scene: BaseScene, options: TileOptions){
        super(scene);

        this.width = options.width;
        this.depth = options.depth;
        const height = BASE_SIZE;

        this.mesh = MeshBuilder.CreateBox('LIMIT-MESH', {
            width: this.width,
            height: height*1.1,
            depth: this.depth,
        }, scene);

        this._mesh.position = new Vector3(
            options.x,
            -BASE_SIZE/2,
            options.z,
        );

        this._mesh.material = new StandardMaterial('TILE-MESH-MATERIAL', scene);
        if (this._mesh.material instanceof StandardMaterial) this._mesh.material.diffuseColor = new Color3(0.05, 0.05, 0.05);

        this.collisionType = 'static';
    }
}

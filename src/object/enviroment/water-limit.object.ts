import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Entity } from "..";
import { BaseScene } from "../../scene";

type WaterLimitOptions = {
    position: Vector3;
    size: number;
}

export class WaterLimit extends Entity{
    constructor(scene: BaseScene, options: WaterLimitOptions){
        super(scene);

        this._mesh = MeshBuilder.CreateBox('WATER-LIMIT-MESH', {
            width: options.size,
            depth: options.size/4,
            height: options.size/4,
        });
        this._mesh.position = options.position.clone();

        this.mesh.material = new StandardMaterial('WATER-LIMIT-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.White();

        this.collisionType = 'dynamic';
    }
}

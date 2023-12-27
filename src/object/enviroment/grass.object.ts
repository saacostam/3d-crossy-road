import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Entity } from "../base";

type GrassOptions = {
    width?: number;
    depth?: number;
    position?: Vector3;
}

export class Grass extends Entity{
    constructor(scene: Scene, options?: GrassOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox("GRASS-BOX", {
            ...options,
            height: 1,
        }, scene);

        this.mesh.position = options?.position ? options.position : Vector3.Zero();

        this.mesh.material = new StandardMaterial('GRASS-MATERIAL' , scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Gray();
    }
}

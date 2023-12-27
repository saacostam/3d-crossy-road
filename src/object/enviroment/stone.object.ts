import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { StaticEntityOptions } from "../../types";

export class Stone extends Entity{
    constructor(scene: Scene, options: StaticEntityOptions){
        super(scene);

        const SIZE = BASE_SIZE*(3/4);

        this.mesh = MeshBuilder.CreateBox('STONE-MESH',{
            size: SIZE,
        }, scene);

        this.mesh.position = new Vector3(options.x, SIZE/2, options.z);

        this.mesh.material = new StandardMaterial('STONE-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Random();

        this.collisionType = 'static';
    }
}

import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { StaticEntityOptions } from "../../types";
import { BaseScene } from "../../scene";

export class Stone extends Entity{
    constructor(scene: BaseScene, options: StaticEntityOptions){
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

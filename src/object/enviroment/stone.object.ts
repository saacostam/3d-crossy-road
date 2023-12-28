import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { StaticEntityOptions } from "../../types";
import { BaseScene } from "../../scene";

export class Stone extends Entity{
    constructor(scene: BaseScene, options: StaticEntityOptions){
        super(scene);

        const SIZE = BASE_SIZE/2;
        const GRAY_COLOR = new Color3(0.45, 0.45, 0.45);

        this.mesh = MeshBuilder.CreateBox('STONE-MESH',{
            size: SIZE,
        }, scene);
        this.mesh.position = new Vector3(options.x, SIZE/2, options.z);

        this.mesh.material = new StandardMaterial('STONE-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = GRAY_COLOR;

        // Mesh - Children
        const smallerStone = MeshBuilder.CreateBox('STONE-MESH',{
            size: SIZE/2,
        }, scene);
        smallerStone.position = new Vector3(options.x, SIZE*5/4, options.z);
        smallerStone.material = new StandardMaterial('STONE-MESH-MATERIAL', scene);
        if (smallerStone.material instanceof StandardMaterial) smallerStone.material.diffuseColor = GRAY_COLOR;
        this.meshChildren.push({
            mesh: smallerStone,
            anchorToParent: Vector3.Zero(),
        });

        this.collisionType = 'static';
    }
}

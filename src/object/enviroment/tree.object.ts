import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { StaticEntityOptions } from "../../types";
import { BaseScene } from "../../scene";

export class Tree extends Entity{
    constructor(scene: BaseScene, options: StaticEntityOptions){
        super(scene);

        const SIZE = BASE_SIZE * 1 / 4;
        const HEIGHT = BASE_SIZE * 2;

        this.mesh = MeshBuilder.CreateBox('TREE-MESH',{
            width: SIZE,
            depth: SIZE,
            height: HEIGHT,
        }, scene);

        this.mesh.position = new Vector3(options.x, HEIGHT/2, options.z);

        this.mesh.material = new StandardMaterial('TREE-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = new Color3(0.55, 0.45, 0.3);

        // Mesh - Children
        const leafBlock = MeshBuilder.CreateBox('TREE-MESH',{
            size: BASE_SIZE,
        }, scene);
        leafBlock.position = new Vector3(options.x, HEIGHT, options.z);
        leafBlock.material = new StandardMaterial('TREE-MESH-MATERIAL', scene);
        if (leafBlock.material instanceof StandardMaterial) leafBlock.material.diffuseColor = new Color3(0.5, 0.7, 0.4);
        this.meshChildren.push({
            mesh: leafBlock,
            anchorToParent: Vector3.Zero(),
        });

        this.collisionType = 'static';
    }
}

import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { BASE_SIZE } from "../../config";
import { StaticEntityOptions } from "../../types";

export class Tree extends Entity{
    constructor(scene: Scene, options: StaticEntityOptions){
        super(scene);

        const SIZE = BASE_SIZE * 3 / 4;
        const HEIGHT = BASE_SIZE * 2;

        this.mesh = MeshBuilder.CreateBox('TREE-MESH',{
            width: SIZE,
            depth: SIZE,
            height: HEIGHT,
        }, scene);

        this.mesh.position = new Vector3(options.x, HEIGHT/2, options.z);

        this.mesh.material = new StandardMaterial('TREE-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Random();

        this.collisionType = 'static';
    }
}

import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "../base";
import { Game } from "../../app";
import { BaseScene } from "../../scene";

type CubeOptions = {
    size?: number;
    width?: number;
    height?: number;
    depth?: number;
    position?: Vector3;
}

export class Cube extends Entity{
    constructor(scene: BaseScene, options?: CubeOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox("CUBE-BOX", {
            ...options,
        }, scene);

        this.mesh.position = options?.position ? options.position : Vector3.Zero();

        this.mesh.material = new StandardMaterial('CUBE-MATERIAL' , scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Red();

        this.collisionType = 'static';
    }

    update(game: Game, delta: number){
        const { input: { keyboardHandler }} = game;

        const MOVE_DELTA = 0.1;
        if (keyboardHandler.isBeingPressed('a')){
            this.mesh.position.x -= MOVE_DELTA * delta;
        }else if (keyboardHandler.isBeingPressed('d')){
            this.mesh.position.x += MOVE_DELTA * delta;
        }
    }
}

import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "../base";
import { Game } from "../../app";

type CubeOptions = {
    size?: number;
    width?: number;
    height?: number;
    depth?: number;
    position?: Vector3;
}

export class Cube extends Entity{
    public mesh: Mesh;

    constructor(scene: Scene, options?: CubeOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox("CUBE-BOX", {
            ...options,
        }, scene);

        this.mesh.position = options?.position ? options.position : Vector3.Zero();

        this.mesh.material = new StandardMaterial('CUBE-MATERIAL' , scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Gray();

        this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, { mass: 2 });
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

import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Entity } from "..";

import { Game } from "../../app";
import { HomeScene } from "../../scene";
import { BASE_SIZE } from "../../config";

type ParticleOptions = {
    start: Vector3;
    TTL: number;
}

export class Particle extends Entity{
    private pointingTo: Vector3;
    
    private ttl: number;
    private life: number = 0;

    constructor(scene: HomeScene, options: ParticleOptions){
        super(scene);
        this._mesh = MeshBuilder.CreateBox('PARTICLE-MESH', {
            size: BASE_SIZE/16,
        }, scene);
        this.mesh.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Math.random() < 0.5 ? Color3.White() : Color3.Red();

        this.mesh.position = options.start;
        this.ttl = options.TTL;

        const getNormalizedComponent = () => (-1 + Math.floor(3 * Math.random()));

        this.pointingTo = new Vector3(
            getNormalizedComponent(),
            getNormalizedComponent(),
            getNormalizedComponent(),
        );
    }

    public update(_game: Game, _delta: number): void {
        this.life += _delta;
        this.mesh.position = this.mesh.position.add(this.pointingTo.scale(0.01*_delta));

        if (this.mesh.material) this.mesh.material.alpha = 1 - (this.life / this.ttl);
    }
}

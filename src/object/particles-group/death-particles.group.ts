import { Vector3 } from "@babylonjs/core";
import { Particle } from ".";
import { Entity } from "..";
import { Game } from "../../app";
import { HomeScene } from "../../scene";

type DeathParticlesGroupOptions = {
    start: Vector3;
}

export class DeathParticlesGroup extends Entity{
    public static TTL = 1000;
    public scene: HomeScene;
    
    private particles: Entity[] = [];
    private life = 0;

    constructor(scene: HomeScene, options: DeathParticlesGroupOptions){
        super(scene);

        const NUMBER_OF_PARTICLES = 20;
        for (let i = 0; i < NUMBER_OF_PARTICLES; i++){
            const particle = new Particle(scene, {
                start: options.start,
                TTL: DeathParticlesGroup.TTL,
            });

            this.particles.push(particle);
            scene.addEntity(particle);
        }

        this.scene = scene;
    }

    public update(_game: Game, _delta: number): void {
        if (this.life > DeathParticlesGroup.TTL) {
            this.kill();
            this.scene.restart();
            return;
        }

        this.life += _delta;
    }

    kill(): void {
        super.kill();
        this.particles.forEach(particle => particle.kill());
    }
}
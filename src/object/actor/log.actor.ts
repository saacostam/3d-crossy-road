import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { Direction, DynamicEntityOptions } from "../../types";
import { BaseScene } from "../../scene";
import { Game } from "../../app";
import { PathMap, PathUtil } from "../../util";

type LogOptions = DynamicEntityOptions & {
    velocity: number;
};

export class Log extends Entity{
    private direction: Direction;
    private start: Vector3;
    private end: Vector3;
    private pathProgress: number;

    private velocity: number;
    private pathMap: PathMap;

    constructor(scene: BaseScene, options: LogOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox('LOG-MESH',{
            width: options.width,
            depth: options.depth,
            height: options.height,
        }, scene);

        this.mesh.position = options.start;

        this.mesh.material = new StandardMaterial('LOG-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = new Color3(0.6, 0.5, 0.3);

        this.direction = options.direction;
        this.start = options.start;
        this.end = options.end;
        this.pathProgress = Math.random();

        this.velocity = options.velocity;
        this.pathMap = PathUtil.useLinearPath({
            start: this.start,
            end: this.end,
        })

        this.collisionType = 'platform';
    }

    public update(_game: Game, _delta: number): void {
        const MODIFIER = (this.direction === 'right') ? 1 : -1;
        const DELTA_MOVEMENT = this.velocity * _delta * MODIFIER;
        this.pathProgress = ((this.pathProgress + DELTA_MOVEMENT * MODIFIER) + 1) % 1;

        this._mesh.position = this.pathMap(this.pathProgress);
    }
}

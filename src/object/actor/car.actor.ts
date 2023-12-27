import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { Direction, DynamicEntityOptions } from "../../types";
import { BaseScene } from "../../scene";
import { Game } from "../../app";
import { PathMap, PathUtil } from "../../util";

type CarOptions = DynamicEntityOptions & {};

export class Car extends Entity{
    private direction: Direction;
    private start: Vector3;
    private end: Vector3;
    private pathProgress: number;

    private pathMap: PathMap;

    constructor(scene: BaseScene, options: CarOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox('CAR-MESH',{
            width: options.width,
            depth: options.depth,
            height: options.height,
        }, scene);

        this.mesh.position = options.start;

        this.mesh.material = new StandardMaterial('TREE-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Random();

        this.direction = options.direction;
        this.start = options.start;
        this.end = options.end;
        this.pathProgress = options.pathProgress;

        this.pathMap = PathUtil.useLinearPath({
            start: this.start,
            end: this.end,
        })

        this.collisionType = 'dynamic';
    }

    public update(_game: Game, _delta: number): void {
        const MODIFIER = (this.direction === 'right') ? 1 : -1;
        const DELTA_MOVEMENT = 0.00015 * _delta * MODIFIER;
        this.pathProgress = ((this.pathProgress + DELTA_MOVEMENT * MODIFIER) + 1) % 1;

        this._mesh.position = this.pathMap(this.pathProgress);
    }
}

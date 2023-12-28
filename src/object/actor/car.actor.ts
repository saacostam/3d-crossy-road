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
    private velocity: number;

    private width: number;
    private height: number;
    private depth: number;

    private pathMap: PathMap;

    constructor(scene: BaseScene, options: CarOptions){
        super(scene);

        this.width = options.width;
        this.height = options.height;
        this.depth = options.depth;

        this.direction = options.direction;
        this.start = options.start;
        this.end = options.end;

        this.pathProgress = options.pathProgress;
        this.velocity = options.velocity;

        this.pathMap = PathUtil.useLinearPath({
            start: this.start,
            end: this.end,
        })

        this.collisionType = 'dynamic';

        // Mesh
        const COLOR = Color3.Random();
        const WHEEL_COLOR = new Color3(0.15, 0.15, 0.15);

        this.mesh = MeshBuilder.CreateBox('CAR-MESH',{
            width: this.width,
            depth: this.depth,
            height: this.height/2,
        }, scene);
        this.mesh.position = options.start;
        this.mesh.material = new StandardMaterial('CAR-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = COLOR;

        // Mesh - Children
        const OUT_OF_SCENE = Vector3.Down().scale(30);

        const roof = MeshBuilder.CreateBox('CAR-MESH', {
            width: this.width,
            depth: this.depth/2,
            height: this.height/2,
        }, scene);
        roof.position = OUT_OF_SCENE;
        roof.material = new StandardMaterial('CAR-MESH-MATERIAL', scene);
        if (roof.material instanceof StandardMaterial) roof.material.diffuseColor = COLOR; 
        this.meshChildren.push({
            mesh: roof,
            anchorToParent: new Vector3(0, this.height/2, 0),
        });

        const frontWheels = MeshBuilder.CreateCylinder('CAR-MESH', {
            height: this.width*1.1,
            diameter: this.height*5/8,
        })
        frontWheels.position = OUT_OF_SCENE;
        frontWheels.rotation = new Vector3(0, 0, Math.PI/2);
        frontWheels.material = new StandardMaterial('CAR-MESH-MATERIAL', scene);
        if (frontWheels.material instanceof StandardMaterial) frontWheels.material.diffuseColor = WHEEL_COLOR; 
        this.meshChildren.push({
            mesh: frontWheels,
            anchorToParent: new Vector3(0, -this.height/6, this.depth/3),
        });

        const backWheels = MeshBuilder.CreateCylinder('CAR-MESH', {
            height: this.width*1.1,
            diameter: this.height*5/8,
        })
        backWheels.position = OUT_OF_SCENE;
        backWheels.rotation = new Vector3(0, 0, Math.PI/2);
        backWheels.material = new StandardMaterial('CAR-MESH-MATERIAL', scene);
        if (backWheels.material instanceof StandardMaterial) backWheels.material.diffuseColor = WHEEL_COLOR; 
        this.meshChildren.push({
            mesh: backWheels,
            anchorToParent: new Vector3(0, -this.height/6, -this.depth/3),
        });
    }

    public update(_game: Game, _delta: number): void {
        const MODIFIER = (this.direction === 'right') ? 1 : -1;
        const DELTA_MOVEMENT = this.velocity * _delta * MODIFIER;
        this.pathProgress = ((this.pathProgress + DELTA_MOVEMENT * MODIFIER) + 1) % 1;

        this._mesh.position = this.pathMap(this.pathProgress);

        this.meshChildren.forEach(
            ({mesh, anchorToParent}) => {
                mesh.position = this._mesh.position.add(anchorToParent);
            }
        )
    }
}

import { DirectionalLight, FreeCamera, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { BaseScene, BaseSceneOptions } from "./base.scene";
import { Cube, Grass } from "../object";

type HomeSceneOptions = BaseSceneOptions;

export class HomeScene extends BaseScene{
    private cube: Cube;

    constructor(public app: Game, options?: HomeSceneOptions){
        super(app, options);

        this.camera = new FreeCamera(
            "HOME-CAMERA", 
            new Vector3(200, 200, 100),
            this,
        );
        this.camera.setTarget(Vector3.Zero());

        this.light = new DirectionalLight(
            "HOME-LIGHT",
            new Vector3(-1, -1, 1),
            this,
        )

        const grass = new Grass(this, {
            width: 200,
            depth: 200,
            position: new Vector3(0, -1, 0),
        });
        this.addEntity(grass);

        const cube = new Cube(this, {
            width: 5,
            height: 10,
            depth: 5,
            position: new Vector3(0, 250, 20),
        })
        this.cube = cube;
        this.addEntity(cube);
    }

    update(delta: number){
        super.update(delta);
    }
}
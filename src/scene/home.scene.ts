import { DirectionalLight, FreeCamera, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { BaseScene, BaseSceneOptions } from "./base.scene";
import { Grass, Player } from "../object";
import { UpdateHandler } from "../types";
import { BASE_SIZE } from "../config";

type HomeSceneOptions = BaseSceneOptions;

export class HomeScene extends BaseScene{
    private player: Player;

    constructor(public app: Game, options?: HomeSceneOptions){
        super(app, options);

        const grass = new Grass(this, {
            width: BASE_SIZE * 17,
            depth: BASE_SIZE * 17,
            position: new Vector3(0, -1, 0),
        });
        this.addEntity(grass);

        this.player = new Player(this, {
            position: new Vector3(0, BASE_SIZE/2, 0),
        });
        this.addEntity(this.player);

        this.camera = new FreeCamera(
            "HOME-CAMERA", 
            new Vector3(200, 200, 100),
            this,
        );

        this.light = new DirectionalLight(
            "HOME-LIGHT",
            new Vector3(-1, -1, 1),
            this,
        )
    }

    private updateCamera: UpdateHandler = (_: Game, __: number) => {
        const CAMERA_OFFSET = new Vector3(-80, 80, -32);
        const TAGET_CURR_POSITION = this.player.mesh.position;
        this.camera.position = TAGET_CURR_POSITION.add(CAMERA_OFFSET);
        this.camera.setTarget(TAGET_CURR_POSITION);
    }

    private updateHandlers: UpdateHandler[] = [
        this.updateCamera
    ];

    update(delta: number){
        super.update(delta);
        this.updateHandlers.forEach(handlerCb => handlerCb(this.app, delta));
    }
}
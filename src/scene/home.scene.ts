import { DirectionalLight, FreeCamera, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { BaseScene, BaseSceneOptions } from "./base.scene";
import { Grass, Player, Stone, Tree } from "../object";
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
            position: new Vector3(0, BASE_SIZE/4, 0),
            size: BASE_SIZE/2,
        });
        this.addEntity(this.player);

        const stone = new Stone(this, {
            x: -2 * BASE_SIZE,
            z: 0,
        });
        this.addEntity(stone);

        const tree = new Tree(this, {
            x: 2 * BASE_SIZE,
            z: 2 * BASE_SIZE,
        });
        this.addEntity(tree);

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
        const CAMERA_OFFSET = new Vector3(-160, 160, -64);
        const TARGET_CURR_POSITION = this.player.mesh.position.multiply(new Vector3(1, 0, 1));
        this.camera.position = TARGET_CURR_POSITION.add(CAMERA_OFFSET);
        this.camera.setTarget(TARGET_CURR_POSITION);
    }

    private updateHandlers: UpdateHandler[] = [
        this.updateCamera
    ];

    update(delta: number){
        super.update(delta);
        this.updateHandlers.forEach(handlerCb => handlerCb(this.app, delta));
    }
}
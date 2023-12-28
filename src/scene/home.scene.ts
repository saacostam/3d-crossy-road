import { DirectionalLight, FreeCamera, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { BaseScene, BaseSceneOptions } from "./base.scene";
import { Player, Tile } from "../object";
import { MetaTile, UpdateHandler } from "../types";
import { BASE_SIZE } from "../config";

type HomeSceneOptions = BaseSceneOptions;

export class HomeScene extends BaseScene{
    private player: Player;
    public tiles: MetaTile[] = [];

    constructor(public app: Game, options?: HomeSceneOptions){
        super(app, options);

        this.player = new Player(this, {
            position: new Vector3(-2*BASE_SIZE, BASE_SIZE/4, 0),
            size: BASE_SIZE/4,
        });
        this.addEntity(this.player);

        this.setUpInitialTiles();

        this.camera = new FreeCamera(
            "HOME-CAMERA", 
            new Vector3(200, 200, 100),
            this,
        );

        this.light = new DirectionalLight(
            "HOME-LIGHT",
            new Vector3(0.5, -1, -0.5),
            this,
        )
    }

    private setUpInitialTiles(){
        const NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN = 5;
        for (let i = -NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN; i < NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN * 5; i ++){
            const x = i * BASE_SIZE;
            
            const tile = new Tile(this, {
                depth: BASE_SIZE * 16,
                width: BASE_SIZE,
                z: 0,
                x: x,
                isEmpty: i <= 0,
            });
            
            this.tiles.push({
                tile: tile,
                x: x,
            });
            this.addEntity(tile);
        }

    }

    private updateCamera: UpdateHandler = (_: Game, __: number) => {
        const CAMERA_OFFSET = new Vector3(-90, 90, -32);
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
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

    private farthestAwayTileXCoordinate: number = 0;

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

    private addTile(x: number, isEmpty: boolean = false){
        const TILE_DEPTH = BASE_SIZE * 20;

        const tile = new Tile(this, {
            depth: TILE_DEPTH,
            width: BASE_SIZE,
            z: 0,
            x: x,
            isEmpty: isEmpty,
        });
        
        this.tiles.push({
            tile: tile,
            x: x,
        });
        this.addEntity(tile);

        this.farthestAwayTileXCoordinate = x;
    }

    private setUpInitialTiles(){
        const NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN = 5;

        for (let i = -NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN; i < NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN * 2; i ++){
            const x = i * BASE_SIZE;
            this.addTile(x, i <= 0);
        }

    }

    private updateCamera: UpdateHandler = (_: Game, __: number) => {
        const CAMERA_OFFSET = new Vector3(-90, 90, -32);
        const TARGET_CURR_POSITION = this.player.mesh.position.multiply(new Vector3(1, 0, 1));
        this.camera.position = TARGET_CURR_POSITION.add(CAMERA_OFFSET);
        this.camera.setTarget(TARGET_CURR_POSITION);
    }

    private handleTileLifeCycle: UpdateHandler = (_: Game, __: number) => {
        const HORIZON_DISTANCE = BASE_SIZE * 15;
        if ((this.farthestAwayTileXCoordinate - this.player.mesh.position.x) < HORIZON_DISTANCE){
            this.addTile(this.farthestAwayTileXCoordinate + BASE_SIZE, false);
        }
    }

    private updateHandlers: UpdateHandler[] = [
        this.updateCamera,
        this.handleTileLifeCycle,
    ];

    update(delta: number){
        super.update(delta);
        this.updateHandlers.forEach(handlerCb => handlerCb(this.app, delta));
    }
}

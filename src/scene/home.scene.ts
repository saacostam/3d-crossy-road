import { Color4, DirectionalLight, FreeCamera, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { BaseScene, BaseSceneOptions } from "./base.scene";
import { Limit, Player, Tile } from "../object";
import { MetaTile, UpdateHandler } from "../types";
import { BASE_SIZE } from "../config";

type HomeSceneOptions = BaseSceneOptions;

export class HomeScene extends BaseScene{
    private player: Player;
    public tiles: MetaTile[] = [];

    private static TILE_DEPTH = BASE_SIZE * 20;

    private farthestAwayPlayerXCoordinate: number = 0;
    private farthestAwayTileXCoordinate: number = 0;
    private closestLimitXCoordinate: number = -10000;

    private sideLimits: Limit[] = [];
    private gameAreaLimits: Limit[] = [];

    constructor(public app: Game, options?: HomeSceneOptions){
        super(app, options);
        this.clearColor = new Color4(0.5, 0.75, 0.85);

        this.player = new Player(this, {
            position: new Vector3(-BASE_SIZE, BASE_SIZE/4, 0),
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
        const tile = new Tile(this, {
            depth: HomeScene.TILE_DEPTH,
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

        const [leftSideLimit, rightSideLimit] = [
            new Limit(this, {
                depth: HomeScene.TILE_DEPTH,
                width: BASE_SIZE,
                z: -HomeScene.TILE_DEPTH,
                x: x,
            }),
            new Limit(this, {
                depth: HomeScene.TILE_DEPTH,
                width: BASE_SIZE,
                z: HomeScene.TILE_DEPTH,
                x: x,
            }),
        ];

        this.sideLimits.push(leftSideLimit);
        this.addEntity(leftSideLimit);

        this.sideLimits.push(rightSideLimit);
        this.addEntity(rightSideLimit);
    }

    private setUpInitialTiles(){
        const NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN = 5;

        for (let i = -3*NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN; i < NUMBER_OF_TILES_ON_EACH_SIDE_FROM_ORIGIN * 2; i ++){
            const x = i * BASE_SIZE;
            this.addTile(x, i <= 0);
        }
    }

    private updateCamera: UpdateHandler = (_: Game, __: number) => {
        this.farthestAwayPlayerXCoordinate = Math.max(this.farthestAwayPlayerXCoordinate, this.player._mesh.position.x);

        const CAMERA_OFFSET = new Vector3(-90, 90, -32).scale(4);
        const TARGET_CURR_POSITION = this.player.mesh.position.multiply(new Vector3(1, 0, 1));
        TARGET_CURR_POSITION.x = Math.max(this.farthestAwayPlayerXCoordinate, TARGET_CURR_POSITION.x);
        this.camera.position = TARGET_CURR_POSITION.add(CAMERA_OFFSET);
        this.camera.setTarget(TARGET_CURR_POSITION);
    }

    private handleTileLifeCycle: UpdateHandler = (_: Game, __: number) => {
        // Generate new tiles
        const HORIZON_DISTANCE = BASE_SIZE * 15;
        if ((this.farthestAwayTileXCoordinate - this.player.mesh.position.x) < HORIZON_DISTANCE){
            this.addTile(this.farthestAwayTileXCoordinate + BASE_SIZE, false);
        }

        // Handle tile lifecycle
        const INACCESSIBLE_DISTANCE = BASE_SIZE * 6;
        while ((this.player._mesh.position.x - this.tiles[0].tile._mesh.position.x) >= INACCESSIBLE_DISTANCE){
            const x = this.tiles[0].tile._mesh.position.x;

            if (x > this.closestLimitXCoordinate){
                const tile = this.tiles.shift();
                tile?.tile.kill();

                const limit = new Limit(this, {
                    depth: HomeScene.TILE_DEPTH,
                    width: BASE_SIZE,
                    z: 0,
                    x: x,
                });
                this.gameAreaLimits.push(limit);
                this.addEntity(limit);

                this.closestLimitXCoordinate = x;
            }else break;
        }

        while (this.sideLimits[0]._mesh.position.x < this.closestLimitXCoordinate){
            const sideLimit = this.sideLimits.shift();
            sideLimit?.kill();
        }

        while (this.gameAreaLimits[0]._mesh.position.x < this.closestLimitXCoordinate){
            const limit = this.gameAreaLimits.shift();
            limit?.kill();
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

import { BaseScene } from "../../scene";
import { MetaTile } from "../../types";

type TiledScene = BaseScene & {
    tiles: MetaTile[]
}

export class TiledSceneNavigator{
    constructor(private scene: TiledScene){}

    getClosestTile(xPos: number, xSize: number): MetaTile | undefined{
        return this.scene.tiles.find(metaTile => Math.abs(xPos - metaTile.x) <= xSize);
    }
}

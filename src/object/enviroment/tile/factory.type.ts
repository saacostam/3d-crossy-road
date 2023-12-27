import { Tile } from ".";
import { Entity } from "../..";
import { BaseScene } from "../../../scene";

export type TileFactory = (scene: BaseScene, amount: number, tile: Tile) => Entity[];

export type TileFactoryType = 'nature' | 'empty' | 'track' | 'river';
export const TileFactoryTypeArray: TileFactoryType[] = ['nature', 'empty', 'track', 'river'];

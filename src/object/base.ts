import { Mesh } from "@babylonjs/core";

import { Game } from "../app";
import { AnchoredChildMesh, CollisionType } from "../types";
import { BaseScene } from "../scene";

export class Entity {
    public _mesh: Mesh;
    public isAlive: boolean = true;
    public collisionType: CollisionType = 'none';

    public meshChildren: AnchoredChildMesh[] = [];

    constructor(public scene: BaseScene){
        this._mesh = new Mesh('BASE-MESH');
    }

    public update(_game: Game, _delta: number){}

    public onCollision(_other: Entity, _game: Game){}

    public onEnterScene(_scene: BaseScene){}
    
    kill(){
        this.isAlive = false;
        if (this.mesh) this.scene.removeMesh(this.mesh);
    }

    set mesh(newMeshValue: Mesh){
        this._mesh = newMeshValue;
    }

    get mesh(){
        return this._mesh;
    }
}

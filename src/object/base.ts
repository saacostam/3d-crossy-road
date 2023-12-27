import { Mesh, Scene } from "@babylonjs/core";

import { Game } from "../app";
import { CollisionType } from "../types";

export class Entity {
    public _mesh: Mesh;
    public isAlive: boolean = true;
    public collisionType: CollisionType = 'none';

    constructor(public scene: Scene){
        this._mesh = new Mesh('BASE-MESH');
    }

    public update(_game: Game, _delta: number){}

    public onCollision(_other: Entity, _game: Game){}

    public onEnterScene(_scene: Scene){}
    
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

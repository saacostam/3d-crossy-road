import { Mesh, Scene } from "@babylonjs/core";

import { Game } from "../app";

export class Entity {
    public _mesh: Mesh;
    public isAlive: boolean = true;
    constructor(public scene: Scene){
        this._mesh = new Mesh('BASE-MESH');
    }

    update(_game: Game, _delta: number){}
    
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

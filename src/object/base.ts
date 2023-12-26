import { Mesh, Scene } from "@babylonjs/core";

import { Game } from "../app";

export class Entity {
    public mesh: Mesh | undefined = undefined;
    public isAlive: boolean = true;
    constructor(public scene: Scene){}

    update(_game: Game, _delta: number){}
    
    kill(){
        this.isAlive = false;
        if (this.mesh) this.scene.removeMesh(this.mesh);
    }
}

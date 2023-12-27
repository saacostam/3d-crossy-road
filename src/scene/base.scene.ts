import { CannonJSPlugin, DirectionalLight, FreeCamera, Light, Scene, Vector3 } from "@babylonjs/core";

import { Game } from "../app";
import { Entity } from "../object";

export type BaseSceneOptions = {
    gravity?: Vector3;
}

export class BaseScene extends Scene{
    public entities: Entity[] = [];
    private _camera: FreeCamera;
    public _light: Light;

    constructor(public app: Game, options?:BaseSceneOptions){
        super(app.engine);

        this.enablePhysics(
            options?.gravity? options.gravity : Vector3.Down().scale(9.8), 
            new CannonJSPlugin()
        );

        this._camera = new FreeCamera("BASE-CAMERA", Vector3.Up().scale(50), this);
        this._camera.attachControl(app.engine.getRenderingCanvas(), true);
        
        this._light = new DirectionalLight("BASE-LIGHT", Vector3.Down(), this);
    }

    update(delta: number){
        this.entities.forEach( entity => entity.update(this.app, delta));
        this.entities.forEach( entity1 => this.entities.forEach( entity2 => {
            if (entity1 !== entity2 && entity1.collisionType !== 'none' && entity2.collisionType !== 'none' && entity1.mesh.intersectsMesh(entity2.mesh)){
                entity1.onCollision(entity2, this.app);
                entity2.onCollision(entity1, this.app);
            }
        }));
        this.entities = this.entities.filter(entity => entity.isAlive);
    }

    addEntity(entity: Entity){
        this.entities.push(entity);
    }

    public set camera(newCamera: FreeCamera){
        this._camera.detachControl();
        this._camera.dispose();

        this._camera = newCamera;
        this._camera.attachControl(this.app.engine.getRenderingCanvas(), true);
    }

    public get camera(){
        return this._camera;
    }

    public set light(newLight: Light){
        this._light.dispose();
        this._light = newLight;
    }

    public get light(){
        return this._light;
    }
}

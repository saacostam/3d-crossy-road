import { Engine } from "@babylonjs/core";

import { AppError } from "../error";
import { BaseScene } from "../scene";
import { KeyboardHandler } from "../io";

export class Game{
    public input = {
        keyboardHandler: new KeyboardHandler(),
    }

    private currentScene: BaseScene|undefined = undefined;
    private allScenes = new Map<string, BaseScene>();

    constructor(public engine: Engine){};

    public createScene(key: string, scene: BaseScene){
        this.allScenes.set(key, scene);
        if (!this.currentScene) this.currentScene = scene;
    }

    public goToScene(key: string){
        if (this.allScenes.has(key)){
            this.currentScene = this.allScenes.get(key);
        }else{
            console.warn(`The scene with key ${key} was not found! Keeping previous scene!`);
        }
    }

    public runRenderLoop(){
        if (!this.currentScene) throw new AppError('No default scene was configured!');
        this.engine.runRenderLoop(() => {
            const DELTA = this.engine.getDeltaTime();

            if (!this.currentScene) throw new AppError('Trying to render undefined scene!');
            
            this.currentScene.update(DELTA);
            this.currentScene.render(true);
        })
    }
}

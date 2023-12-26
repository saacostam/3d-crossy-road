import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { Game } from "../../app";
import { BASE_SIZE } from "../../config";
import { BaseScene } from "../../scene";
import { StateMachine } from "../../types";

type PlayerStateMachineState = 'moving' | 'idle';
type PlayerStateMachineTransition = 'move' | 'stop';

const getPlayerStateMachine = (): StateMachine<
    PlayerStateMachineState,
    PlayerStateMachineTransition
> => {
    let currentState: PlayerStateMachineState = 'idle';
    const stateMachine = {
        state: () => currentState,
        transition: (transition: PlayerStateMachineTransition) => {
            switch (currentState){
                case 'idle':
                    switch (transition){
                        case 'move':
                            currentState = 'moving';
                            break;
                        case 'stop':
                            currentState = 'idle';
                            break;
                    }
                    break;
                case 'moving':
                    switch (transition){
                        case 'move':
                            currentState = 'moving';
                            break;
                        case 'stop':
                            currentState = 'idle';
                            break;
                    }
            }
        }
    }

    return stateMachine;
}

type PlayerOptions = {
    size?: number,
    position?: Vector3,
}

export class Player extends Entity{
    private stateMachine: StateMachine<PlayerStateMachineState, PlayerStateMachineTransition>;

    constructor(scene: BaseScene, options?: PlayerOptions){
        super(scene);

        this.stateMachine = getPlayerStateMachine();

        this.mesh = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                size: options?.size ? options.size : BASE_SIZE,
            }
        );

        if (options?.position) this.mesh.position = options.position;

        this.mesh.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Blue();
    }

    public update(_game: Game, _delta: number): void {
        const { input: { keyboardHandler: io }} = _game;
        const CURRENT_STATE = this.stateMachine.state();

        switch (CURRENT_STATE){
            case 'idle':
                const DELTA = 0.5;

                if (io.wasPressedOnce('ArrowUp')){
                    this.mesh.position.x += -DELTA * _delta;
                    this.stateMachine.transition('move');
                }else if (io.wasPressedOnce('ArrowDown')){
                    this.mesh.position.x += +DELTA * _delta;
                    this.stateMachine.transition('move');
                }
        
                if (io.wasPressedOnce('ArrowRight')){
                    this.mesh.position.z += +DELTA * _delta;
                    this.stateMachine.transition('move');
                }else if (io.wasPressedOnce('ArrowLeft')){
                    this.mesh.position.z += -DELTA * _delta;
                    this.stateMachine.transition('move');
                }

                break;
            case 'moving':
                this.stateMachine.transition('stop');
                break;
        }
    }
}

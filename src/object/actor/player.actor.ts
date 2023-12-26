import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "..";
import { Game } from "../../app";
import { BASE_SIZE } from "../../config";
import { BaseScene } from "../../scene";
import { Direction, IndependentCallback, StateMachine } from "../../types";
import { Curve, CurveUtil } from "../../util";

type PlayerStateMachineState = 'moving' | 'idle';
type PlayerStateMachineTransition = 'move' | 'stop';

const getPlayerStateMachine = (): StateMachine<
    PlayerStateMachineState,
    PlayerStateMachineTransition
> => {
    const callbacks = new Map<PlayerStateMachineState, IndependentCallback[]>();
    let currentState: PlayerStateMachineState = 'idle';

    const stateMachine = {
        state: () => currentState,
        transition: (transition: PlayerStateMachineTransition) => {
            const PREV_STATE = currentState;
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

            const CURR_STATE = currentState;

            if (PREV_STATE !== CURR_STATE) (callbacks.get(currentState)||[]).forEach(cb => cb());
        },
        registerCallback: (state: PlayerStateMachineState, cb: IndependentCallback) => {
            if (callbacks.has(state)){
                callbacks.set(state, [
                    ...callbacks.get(state)!,
                    cb,
                ])
            }else callbacks.set(state, [cb]);
        }
    }

    return stateMachine;
}

type PlayerOptions = {
    size?: number,
    position?: Vector3,
}

export class Player extends Entity{
    private static jumpVerticalDistanceCurve: Curve = CurveUtil.useParabolaCurve({
        min: 0,
        max: BASE_SIZE,
    });

    private stateMachine: StateMachine<PlayerStateMachineState, PlayerStateMachineTransition>;
    private jumpCurrDistance: number = 0;
    private direction: Direction = 'top';

    constructor(scene: BaseScene, options?: PlayerOptions){
        super(scene);

        this.mesh = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                size: options?.size ? options.size : BASE_SIZE,
            }
        );

        if (options?.position) this.mesh.position = options.position;

        this.mesh.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.Blue();

        this.stateMachine = getPlayerStateMachine();

        this.stateMachine.registerCallback('moving', () => this.jumpCurrDistance = 0);
        this.stateMachine.registerCallback('idle', () => {
            this._mesh.position = new Vector3(
                Math.round(this._mesh.position.x),
                Math.round(this._mesh.position.y),
                Math.round(this._mesh.position.z),
            )
        });
    }

    private updateJump(_delta: number){
        if (this.jumpCurrDistance >= BASE_SIZE){
            this.stateMachine.transition('stop');
            return;
        }

        const MAX_DISTANCE_AVAILABLE = 0.08 * _delta;
        const PENDING_DISTANCE_AVAILABLE = Math.min(MAX_DISTANCE_AVAILABLE, BASE_SIZE - this.jumpCurrDistance);

        if (this.direction === 'top' || this.direction === 'bottom'){
            const MODIFIER = (this.direction === 'top') ? 1 : -1;
            this.mesh.position.x += PENDING_DISTANCE_AVAILABLE * MODIFIER;
        }else if (this.direction === 'right' || this.direction === 'left'){
            const MODIFIER = (this.direction === 'right') ? -1 : 1;
            this.mesh.position.z += PENDING_DISTANCE_AVAILABLE * MODIFIER;
        }

        this.jumpCurrDistance += PENDING_DISTANCE_AVAILABLE;
        this.mesh.position.y = BASE_SIZE/2 + (Player.jumpVerticalDistanceCurve(this.jumpCurrDistance) * BASE_SIZE);
    }

    public update(_game: Game, _delta: number): void {
        const { input: { keyboardHandler: io }} = _game;
        const CURRENT_STATE = this.stateMachine.state();

        switch (CURRENT_STATE){
            case 'idle':
                if (io.wasPressedOnce('ArrowUp')){
                    this.direction = 'top';
                    this.stateMachine.transition('move');
                }else if (io.wasPressedOnce('ArrowDown')){
                    this.direction = 'bottom';
                    this.stateMachine.transition('move');
                }
        
                if (io.wasPressedOnce('ArrowRight')){
                    this.direction = 'right';
                    this.stateMachine.transition('move');
                }else if (io.wasPressedOnce('ArrowLeft')){
                    this.direction = 'left';
                    this.stateMachine.transition('move');
                }

                break;
            case 'moving':
                this.updateJump(_delta);
                break;
        }
    }
}

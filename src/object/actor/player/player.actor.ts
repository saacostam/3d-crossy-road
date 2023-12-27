import { Color3, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

import { Entity } from "../..";
import { Game } from "../../../app";
import { BASE_SIZE } from "../../../config";
import { BaseScene } from "../../../scene";
import { Direction, StateMachine } from "../../../types";
import { Curve, CurveUtil } from "../../../util";

import { PlayerStateMachineState, PlayerStateMachineTransition, getPlayerStateMachine } from "./player.state-machine";

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
    private height: number;

    private platform: Entity | undefined;
    private platformCenterOffset: Vector3 | undefined;

    constructor(scene: BaseScene, options?: PlayerOptions){
        super(scene);

        const SIZE = options?.size ? options.size : BASE_SIZE;

        this.mesh = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                size: SIZE,
            }
        );
        this.height = SIZE;

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

        this.collisionType = 'dynamic';
    }

    private updateJump(_game: Game, _delta: number){
        const CURR_STATE = this.stateMachine.state();

        if (
            (CURR_STATE === 'moving-back' && this.jumpCurrDistance <= 0) 
            || (CURR_STATE === 'moving' && this.jumpCurrDistance >= BASE_SIZE)
        ){
            this.stateMachine.transition('stop');
            return;
        }

        const MAX_DISTANCE_AVAILABLE = 0.08 * _delta;
        const DIRECTION = (this.direction === 'top' || this.direction === 'bottom')
            ? 'x'
            : (this.direction === 'right' || this.direction === 'left')
            ? 'z' : 'z';

        let MODIFIER = (this.direction === 'top' || this.direction === 'left') ? 1 : -1;

        if (CURR_STATE === 'moving'){
            const PENDING_DISTANCE_AVAILABLE = Math.min(MAX_DISTANCE_AVAILABLE, BASE_SIZE - this.jumpCurrDistance)
    
            this.mesh.position[DIRECTION] += PENDING_DISTANCE_AVAILABLE * MODIFIER;
            this.jumpCurrDistance += PENDING_DISTANCE_AVAILABLE;
        }else if (CURR_STATE === 'moving-back'){
            const PENDING_DISTANCE_AVAILABLE = Math.min(MAX_DISTANCE_AVAILABLE, this.jumpCurrDistance);
            MODIFIER *= -1;

            this.mesh.position[DIRECTION] += PENDING_DISTANCE_AVAILABLE * MODIFIER;
            this.jumpCurrDistance -= PENDING_DISTANCE_AVAILABLE;
        }

        this.mesh.position.y = (this.height/2) + (Player.jumpVerticalDistanceCurve(this.jumpCurrDistance) * BASE_SIZE);
    }

    private updatePlatform(_game: Game, _delta: number){
        if (this.platform && this.platformCenterOffset) this._mesh.position = this.platform._mesh.position.add(this.platformCenterOffset);
    }

    public onCollision(_other: Entity, _game: Game): void {
        if (_game.engine.getFps() === Infinity) return;

        if (_other.collisionType === 'static') this.stateMachine.transition('move-back');
        if (_other.collisionType === 'dynamic') _game.engine.stopRenderLoop();
        if (_other.collisionType === 'platform') {
            if (this.stateMachine.state() === 'idle'){
                this.platform = _other;
                this.platformCenterOffset = this._mesh.position.subtract(_other._mesh.position);
            }

            this.stateMachine.transition('bind-to-platform');
        };
    }

    public update(_game: Game, _delta: number): void {
        const { input: { keyboardHandler: io }} = _game;
        const CURRENT_STATE = this.stateMachine.state();

        switch (CURRENT_STATE){
            case 'idle':
            case 'on-platform':
                if (io.wasPressedOnce('ArrowUp') || io.wasPressedOnce(' ')){
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

                if (CURRENT_STATE === 'on-platform') this.updatePlatform(_game, _delta);

                break;
            case 'moving':
            case 'moving-back':
                this.updateJump(_game, _delta);
                break;
        }
    }
}

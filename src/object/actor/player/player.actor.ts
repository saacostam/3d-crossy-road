import { Color3, MeshBuilder, StandardMaterial, Vector3, Quaternion } from "@babylonjs/core";

import { Entity } from "../..";
import { Game } from "../../../app";
import { BASE_SIZE } from "../../../config";
import { TiledSceneNavigator } from "../../../handler";
import { HomeScene } from "../../../scene";
import { Direction, StateMachine } from "../../../types";
import { Curve, CurveUtil, DirectionUtil } from "../../../util";

import { PlayerStateMachineState, PlayerStateMachineTransition, getPlayerStateMachine } from "./player.state-machine";
import { DeathParticlesGroup } from "../../particles-group";

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

    private width: number;
    private depth: number;
    private height: number;

    private platform: Entity | undefined;
    private platformCenterOffset: Vector3 | undefined;
    private tiledSceneNavigator: TiledSceneNavigator | undefined;

    public scene: HomeScene;

    constructor(scene: HomeScene, options?: PlayerOptions){
        super(scene);
        this.scene = scene;

        const SIZE = options?.size ? options.size : BASE_SIZE;
        const COLOR_RED = Color3.Red();

        this.width = SIZE;
        this.height = SIZE*2;
        this.depth = SIZE;

        this.mesh = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                height: this.height,
                depth: this.depth,
                width: this.width,
            },
            scene,
        );

        if (options?.position) this.mesh.position = options.position;

        this.mesh.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (this.mesh.material instanceof StandardMaterial) this.mesh.material.diffuseColor = Color3.White();

        // Mesh - Children
        const OUT_OF_SCENE = Vector3.Down().scale(30);

        const feathers = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                height: this.height/2,
                depth: this.depth,
                width: this.width/2,
            },
            scene,
        );
        feathers.position = OUT_OF_SCENE;
        feathers.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (feathers.material instanceof StandardMaterial) feathers.material.diffuseColor = Color3.White();
        this.meshChildren.push({
            mesh: feathers,
            anchorToParent: new Vector3(-this.width*3/4, -this.height/4, 0),
        });

        const comb = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                height: this.height/8,
                depth: this.depth/4,
                width: this.width/2,
            },
            scene,
        );
        comb.position = OUT_OF_SCENE;
        comb.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (comb.material instanceof StandardMaterial) comb.material.diffuseColor = COLOR_RED;
        this.meshChildren.push({
            mesh: comb,
            anchorToParent: new Vector3(0, this.height*9/16, 0),
        });

        const beak = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                height: this.height/8,
                depth: this.depth/2,
                width: this.width/4,
            },
            scene,
        );
        beak.position = OUT_OF_SCENE;
        beak.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (beak.material instanceof StandardMaterial) beak.material.diffuseColor = new Color3(0.95, 0.65, 0.2);
        this.meshChildren.push({
            mesh: beak,
            anchorToParent: new Vector3(this.width*5/8, this.height/4, 0),
        });

        const wattle = MeshBuilder.CreateBox(
            'PLAYER-MESH', 
            {
                height: this.height/8,
                depth: this.depth/4,
                width: this.width/4,
            },
            scene,
        );
        wattle.position = OUT_OF_SCENE;
        wattle.material = new StandardMaterial('PLAYER-MESH-MATERIAL', scene);
        if (wattle.material instanceof StandardMaterial) wattle.material.diffuseColor = COLOR_RED;
        this.meshChildren.push({
            mesh: wattle,
            anchorToParent: new Vector3(this.width*5/8, this.height/8, 0),
        });

        // State
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
        if (scene instanceof HomeScene) this.tiledSceneNavigator = new TiledSceneNavigator(scene);
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

    private handleIdle(_game: Game, _delta: number){
        const metaTile = this.tiledSceneNavigator?.getClosestTile(this._mesh.position._x, this.depth);
        if (metaTile?.tile.collisionType === 'dynamic' && metaTile.x > 0) this.handleDeath();
    }

    public onCollision(_other: Entity, _game: Game): void {
        if (_game.engine.getFps() === Infinity) return;

        if (_other.collisionType === 'static') this.stateMachine.transition('move-back');
        if (_other.collisionType === 'dynamic' && this.scene) this.handleDeath();
        if (_other.collisionType === 'platform') {
            if (this.stateMachine.state() === 'idle'){
                this.platform = _other;
                this.platformCenterOffset = this._mesh.position.subtract(_other._mesh.position);
            }

            this.stateMachine.transition('bind-to-platform');
        };
    }

    private updateMesh(_: Game, __: number){
        const ROTATION = DirectionUtil.findRotationAngleBasedOnDirection(this.direction);
        const ROTATION_VECTOR = new Vector3(0, ROTATION, 0);

        this._mesh.rotation = ROTATION_VECTOR;
        this.meshChildren.forEach(
            ({mesh, anchorToParent}) => {
                mesh.rotation = ROTATION_VECTOR;

                const rotationQuaternion = Quaternion.FromEulerAngles(0, ROTATION, 0);
                const newAnchorToParent = anchorToParent.applyRotationQuaternion(rotationQuaternion);
                mesh.position = this._mesh.position.add(newAnchorToParent);
            }
        )
    }

    private handleDeath(){
        if (this.stateMachine.state() === 'dead') return;
        this.stateMachine.transition('die');

        if (this.mesh.material) this.mesh.material.alpha = 0;
        this.meshChildren.forEach(child => {
            if (child.mesh.material) child.mesh.material.alpha = 0;
        });

        const start = this._mesh.position.clone();
        const particlesGroup = new DeathParticlesGroup(this.scene, {
            start: start,
        });

        this.scene.addEntity(particlesGroup);
    }

    public update(_game: Game, _delta: number): void {
        if (_game.engine.getFps() === Infinity) return;

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
                if (CURRENT_STATE === 'idle') this.handleIdle(_game, _delta);

                break;
            case 'moving':
            case 'moving-back':
                this.updateJump(_game, _delta);
                break;
            case 'dead':
                break;
        }

        this.updateMesh(_game, _delta)
    }
}

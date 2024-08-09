import './style.css'

import CANNON from 'cannon';
window.CANNON = CANNON;

import { Engine } from '@babylonjs/core';
import { isEmpty } from 'lodash';

import { Game } from './app';
import { DomError } from './error';
import { HomeScene } from './scene';

const canvasCollection = document.getElementsByTagName('canvas');
if (isEmpty(canvasCollection)) throw new DomError('Canvas not found');

const canvas = canvasCollection[0];
const engine = new Engine(canvas, true);

const app = new Game(engine);

app.createScene('home', new HomeScene(app));

app.runRenderLoop();

window.addEventListener("resize", () => {
    engine.resize();
});

document.addEventListener('keydown', e => e.preventDefault());

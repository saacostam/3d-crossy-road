import { Direction } from "../types";

export class DirectionUtil{
    public static findRotationAngleBasedOnDirection(dir: Direction){
        return (dir === 'top')
            ? 0
            : (dir === 'right')
            ? Math.PI/2
            : (dir === 'bottom')
            ? Math.PI
            : Math.PI*3/2;
    }
}
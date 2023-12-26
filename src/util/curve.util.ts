export type Curve = (currentValue: number) => number;

type CurveOptions = {
    min?: number,
    max: number,
}

type UseParabolaCurveOptions = CurveOptions;

export class CurveUtil{
    static useParabolaCurve(options: UseParabolaCurveOptions): Curve{
        const MIN = options.min ? options.min : 0;
        const MAX = options.max;
        const RANGE = MAX - MIN;
        const MID = MIN + (RANGE/2);

        const parabolaMappingFn: Curve = (currentValue: number) => {
            currentValue = Math.min(MAX, Math.max(currentValue, MIN));
            let MAP_TO_VALUE = 0;

            if (currentValue <= MID){
                MAP_TO_VALUE = currentValue/MID;
            }else {
                MAP_TO_VALUE = 1 - ((currentValue - MID)/MID);
            }

            return Math.min(1, Math.max(MAP_TO_VALUE, 0));
        }

        return parabolaMappingFn;
    }
}

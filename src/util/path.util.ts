import { Vector3 } from "@babylonjs/core";

export type PathMap = (pathProgress: number) => Vector3;

type PathOptions = {
    start: Vector3,
    end: Vector3,
}

type UseLinearPathOptions = PathOptions;

export class PathUtil{
    static useLinearPath(options: UseLinearPathOptions): PathMap {
        const start = options.start;
        const end = options.end;

        const linearPathMappingFn: PathMap = (pathProgress: number) => {
            const clampedPathProgress = Math.min(1, Math.max(pathProgress, 0));

            const x = start.x + ((end.x - start.x) * clampedPathProgress);
            const y = start.y + ((end.y - start.y) * clampedPathProgress);
            const z = start.z + ((end.z - start.z) * clampedPathProgress);

            return new Vector3(x, y, z);
        }

        return linearPathMappingFn;
    }
}

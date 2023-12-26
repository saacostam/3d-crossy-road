export class AppError extends Error{
    constructor(msg: string){
        super(`[AppError] ${msg}`);
    }
}

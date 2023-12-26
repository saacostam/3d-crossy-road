export class DomError extends Error{
    constructor(msg: string){
        super(`[DomSetup] ${msg}`);
    }
}

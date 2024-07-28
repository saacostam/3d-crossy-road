type RichKeyboardEventConfig = {
    key: string;
    used?: boolean;
}

class RichKeyboardEvent {
    public key: string;
    public used: boolean;

    constructor(props: RichKeyboardEventConfig) {
        this.key = props.key;
        this.used = props.used || false;
    }
}

export class KeyboardHandler {
    private singletonInstance: KeyboardHandler | null = null;
    private keyState: Map<string, RichKeyboardEvent> = new Map<string, RichKeyboardEvent>();

    private keyDownHandler = (e: KeyboardEvent) => {
        e.preventDefault();
        const { key } = e;
        this.keyState.set(key, new RichKeyboardEvent({ key }));
    }

    private keyUpHandler = (e: KeyboardEvent) => {
        e.preventDefault();
        const { key } = e;
        if (this.keyState.has(key)) this.keyState.delete(key);
    }

    constructor() {
        if (!!this.singletonInstance) return this.singletonInstance;

        this.keyState = new Map<string, RichKeyboardEvent>();

        addEventListener('keydown', this.keyDownHandler);
        addEventListener('keyup', this.keyUpHandler);

        this.singletonInstance = this;
    }

    public clear() {
        removeEventListener('keydown', this.keyDownHandler);
        removeEventListener('keyup', this.keyUpHandler);
    }

    public wasPressedOnce(key: string) {
        let wasPressed = false;
        if (this.keyState.has(key)) {
            wasPressed = !(this.keyState.get(key)?.used);
            this.keyState.set(key, new RichKeyboardEvent({ key, used: true }));
        }
        return wasPressed;
    }

    public isBeingPressed(key: string) {
        return !!this.keyState.has(key);
    }
}

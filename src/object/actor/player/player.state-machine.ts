import { IndependentCallback, StateMachine } from "../../../types";

export type PlayerStateMachineState = 'moving' | 'idle' | 'moving-back';
export type PlayerStateMachineTransition = 'move' | 'stop' | 'move-back';

export const getPlayerStateMachine = (): StateMachine<
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
                        case 'move-back':
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
                        case 'move-back':
                            currentState = 'moving-back';
                    }
                    break;
                case 'moving-back':
                    switch (transition){
                        case 'stop':
                            currentState = 'idle';
                            break;
                        case 'move-back':
                            currentState = 'moving-back';
                            break;
                        case 'move':
                            break;
                    }
                    break;
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
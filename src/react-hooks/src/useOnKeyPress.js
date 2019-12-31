import { useKeyPress } from "./useKeyPress";

export function useOnKeyPress(keyCode, callback) {
    const keyIsPressed = useKeyPress(keyCode);
    if (keyIsPressed) {
        callback();
    }
}

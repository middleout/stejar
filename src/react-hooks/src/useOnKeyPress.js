import { useKeyPress } from "./useKeyPress";

export default function useOnKeyPress(keyCode, callback) {
    const keyIsPressed = useKeyPress(keyCode);
    if (keyIsPressed) {
        callback();
    }
}

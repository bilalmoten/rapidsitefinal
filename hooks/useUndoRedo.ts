// hooks/useUndoRedo.ts  

import { useState, useCallback } from "react";

/**  
 * A custom hook for managing undo and redo operations.  
 * @template T The type of the state to manage.  
 * @param {T} initialPresent The initial state.  
 * @param {number} maxHistory The maximum number of history states to keep.  
 * @returns An object containing the current state, setters, undo/redo functions, and status flags.  
 */
function useUndoRedo<T>(initialPresent: T, maxHistory = 100) {
    const [history, setHistory] = useState<{
        past: T[];
        present: T;
        future: T[];
    }>({
        past: [],
        present: initialPresent,
        future: [],
    });

    /**  
     * Sets a new present state and updates the history accordingly.  
     * @param {T} newPresent The new state to set.  
     */
    const set = useCallback((newPresent: T) => {
        setHistory((currentHistory) => {
            const { past, present } = currentHistory;

            const newPast = [...past, present];
            if (newPast.length > maxHistory) {
                newPast.shift(); // Remove the oldest state to maintain max history  
            }

            return {
                past: newPast,
                present: newPresent,
                future: [],
            };
        });
    }, [maxHistory]);

    /**  
     * Undoes the last action by reverting to the previous state.  
     */
    const undo = useCallback(() => {
        setHistory((currentHistory) => {
            const { past, present, future } = currentHistory;

            if (past.length === 0) return currentHistory; // Nothing to undo  

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);
            const newFuture = [present, ...future];

            return {
                past: newPast,
                present: previous,
                future: newFuture,
            };
        });
    }, []);

    /**  
     * Redoes the last undone action by restoring the next state.  
     */
    const redo = useCallback(() => {
        setHistory((currentHistory) => {
            const { past, present, future } = currentHistory;

            if (future.length === 0) return currentHistory; // Nothing to redo  

            const next = future[0];
            const newFuture = future.slice(1);
            const newPast = [...past, present];

            return {
                past: newPast,
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

    /**  
     * Resets the history with a new present state.  
     * @param {T} newPresent The state to reset to.  
     */
    const reset = useCallback((newPresent: T) => {
        setHistory({
            past: [],
            present: newPresent,
            future: [],
        });
    }, []);

    return { present: history.present, set, undo, redo, canUndo, canRedo, reset };
}

export default useUndoRedo;  
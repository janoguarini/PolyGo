import { create } from 'zustand';

import { battleReducer, initialBattleState, type BattleAction, type BattleState } from './state';

interface BattleStore extends BattleState {
  dispatch: (action: BattleAction) => void;
}

/** Estado global de la batalla: los eventos del socket llegan fuera del árbol de React. */
export const useBattleStore = create<BattleStore>((set) => ({
  ...initialBattleState,
  dispatch: (action) => set((state) => battleReducer(state, action)),
}));

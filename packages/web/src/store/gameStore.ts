import { create } from "zustand";
import { hashState } from "@redage/core";
import type { MatchState } from "@redage/core";

const initialState: MatchState = {
  version: "0.0.0",
  seed: 12345,
  turn: 0,
  events: [],
};

export const useGameStore = create<{
  state: MatchState;
  hash: string;
}>((set) => ({
  state: initialState,
  hash: hashState(initialState),
}));

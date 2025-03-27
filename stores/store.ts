import { create } from "zustand";
import {
	type LaunchpadSlice,
	createLaunchpadSlice,
} from "./slices/launchpadSlice";
import { type MIDISlice, createMIDISlice } from "./slices/midiSlice";

export type RootState = MIDISlice & LaunchpadSlice;

export const useStore = create<RootState>()((...args) => ({
	...createMIDISlice(...args),
	...createLaunchpadSlice(...args),
}));

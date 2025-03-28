export interface MIDIDevice {
	id: string;
	name: string;
	type: "input" | "output";
	port: WebMidi.MIDIPort;
}

export type ButtonSetting = {
	effectType: "dot" | "explosion" | "vertical" | "horizontal";
	color: number;
	midiNote: number;
	outputDeviceIndex: number;
};

export type Coordinate = {
	x: number;
	y: number;
};

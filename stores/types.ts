export interface MIDIDevice {
	id: string;
	name: string;
	type: "input" | "output";
	port: WebMidi.MIDIPort;
}

export type ButtonSetting = {
	effectType: "dot" | "explosion" | "vertical" | "horizontal";
	color: Color;
	midiNote: number;
	outputDeviceIndex: number;
};

export type Coordinate = {
	x: number;
	y: number;
};

export type Color = {
	colorType:
		| "white" //白
		| "red" //赤
		| "orange" //橙
		| "yellow" //黄色
		| "yellow-green" //黄緑
		| "green" //緑
		| "blue-green" //青緑
		| "light-blue" //淡青
		| "blue" //青
		| "purple" //紫
		| "pink" //ピンク
		| "red-purple"; // 赤紫
	lightness: 0 | 1 | 2 | 3;
};

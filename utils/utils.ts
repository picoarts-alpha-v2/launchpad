import type { Color } from "@/stores/types";

// midi番号をx,y座標に変換する
export const midiToCoordinate = (midi: number) => {
	return { x: (midi % 10) - 1, y: Math.floor(midi / 10) - 1 };
};

// x,y座標をmidi番号に変換する
export const coordinateToMidi = (x: number, y: number) => {
	if (x < 0 || y < 0 || x > 7 || y > 7) {
		return 0;
	}
	return x + 1 + (y + 1) * 10;
};

export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// colorTypeをRGBに変換する。
export const colorTypeToHue = (colorType: Color["colorType"]) => {
	switch (colorType) {
		case "red":
			return { r: 0x3f, g: 0, b: 0 };
		case "orange":
			return { r: 0x3f, g: 0x20, b: 0 };
		case "yellow":
			return { r: 0x3f, g: 0x3f, b: 0 };
		case "yellow-green":
			return { r: 0x20, g: 0x3f, b: 0x0 };
		case "green":
			return { r: 0, g: 0x3f, b: 0 };
		case "blue-green":
			return { r: 0, g: 0x3f, b: 0x3f };
		case "light-blue":
			return { r: 0, g: 0x20, b: 0x3f };
		case "blue":
			return { r: 0, g: 0, b: 0x3f };
		case "purple":
			return { r: 0x20, g: 0, b: 0x3f };
		case "pink":
			return { r: 0x3f, g: 0, b: 0x3f };
		case "red-purple":
			return { r: 0x3f, g: 0, b: 0x20 };
		case "black":
			return { r: 0, g: 0, b: 0 };
		case "white":
			return { r: 0x3f, g: 0x3f, b: 0x3f };
		default:
			return { r: 0, g: 0, b: 0 };
	}
};

export const colorToRGB = (color: Color) => {
	const hue = colorTypeToHue(color.colorType);
	let lightness = color.lightness;

	// lightnessは0~1の範囲にする
	if (lightness > 1) {
		lightness = 1;
	}
	if (lightness < 0) {
		lightness = 0;
	}

	const rgb = {
		r: Math.floor(hue.r * lightness),
		g: Math.floor(hue.g * lightness),
		b: Math.floor(hue.b * lightness),
	};
	return rgb;
};

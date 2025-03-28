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

// 色と明るさとベロシティのリスト
type ColorVelocity = Color & { velocity: number };
export const colorVelocityList: ColorVelocity[] = [
	{ colorType: "white", lightness: 0, velocity: 0 },
	{ colorType: "white", lightness: 1, velocity: 1 },
	{ colorType: "white", lightness: 2, velocity: 2 },
	{ colorType: "white", lightness: 3, velocity: 3 },
	{ colorType: "red", lightness: 0, velocity: 8 },
	{ colorType: "red", lightness: 1, velocity: 9 },
	{ colorType: "red", lightness: 2, velocity: 10 },
	{ colorType: "red", lightness: 3, velocity: 11 },
	{ colorType: "orange", lightness: 0, velocity: 8 },
	{ colorType: "orange", lightness: 1, velocity: 9 },
	{ colorType: "orange", lightness: 2, velocity: 10 },
	{ colorType: "orange", lightness: 3, velocity: 11 },
	{ colorType: "yellow", lightness: 0, velocity: 12 },
	{ colorType: "yellow", lightness: 1, velocity: 13 },
	{ colorType: "yellow", lightness: 2, velocity: 14 },
	{ colorType: "yellow", lightness: 3, velocity: 15 },
	{ colorType: "yellow-green", lightness: 0, velocity: 16 },
	{ colorType: "yellow-green", lightness: 1, velocity: 17 },
	{ colorType: "yellow-green", lightness: 2, velocity: 18 },
	{ colorType: "yellow-green", lightness: 3, velocity: 19 },
	{ colorType: "green", lightness: 0, velocity: 20 },
	{ colorType: "green", lightness: 1, velocity: 21 },
	{ colorType: "green", lightness: 2, velocity: 22 },
	{ colorType: "green", lightness: 3, velocity: 23 },
	{ colorType: "blue-green", lightness: 0, velocity: 24 },
	{ colorType: "blue-green", lightness: 1, velocity: 25 },
	{ colorType: "blue-green", lightness: 2, velocity: 26 },
	{ colorType: "blue-green", lightness: 3, velocity: 27 },
	{ colorType: "light-blue", lightness: 0, velocity: 28 },
	{ colorType: "light-blue", lightness: 1, velocity: 29 },
	{ colorType: "light-blue", lightness: 2, velocity: 30 },
	{ colorType: "light-blue", lightness: 3, velocity: 31 },
	{ colorType: "blue", lightness: 0, velocity: 32 },
	{ colorType: "blue", lightness: 1, velocity: 33 },
	{ colorType: "blue", lightness: 2, velocity: 34 },
	{ colorType: "blue", lightness: 3, velocity: 35 },
	{ colorType: "purple", lightness: 0, velocity: 36 },
	{ colorType: "purple", lightness: 1, velocity: 37 },
	{ colorType: "purple", lightness: 2, velocity: 38 },
	{ colorType: "purple", lightness: 3, velocity: 39 },
	{ colorType: "pink", lightness: 0, velocity: 40 },
	{ colorType: "pink", lightness: 1, velocity: 41 },
	{ colorType: "pink", lightness: 2, velocity: 42 },
	{ colorType: "pink", lightness: 3, velocity: 43 },
	{ colorType: "red-purple", lightness: 0, velocity: 44 },
	{ colorType: "red-purple", lightness: 1, velocity: 45 },
	{ colorType: "red-purple", lightness: 2, velocity: 46 },
	{ colorType: "red-purple", lightness: 3, velocity: 47 },
];

// 色と明るさをベロシティに変換する
export const colorToVelocity = (color: Color): number => {
	const colorVelocity = colorVelocityList.find(
		(colorVelocity) =>
			colorVelocity.colorType === color.colorType &&
			colorVelocity.lightness === color.lightness,
	);
	if (!colorVelocity) {
		return 0;
	}
	return colorVelocity.velocity;
};

// ベロシティを色と明るさに変換する
export const velocityToColor = (velocity: number): Color => {
	const colorVelocity = colorVelocityList.find(
		(colorVelocity) => colorVelocity.velocity === velocity,
	);
	if (!colorVelocity) {
		return { colorType: "white", lightness: 0 };
	}
	return {
		colorType: colorVelocity.colorType,
		lightness: colorVelocity.lightness,
	};
};

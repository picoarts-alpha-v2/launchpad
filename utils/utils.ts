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

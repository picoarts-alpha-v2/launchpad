// midi番号をx,y座標に変換する
export const midiToXY = (midi: number) => {
	return { x: midi % 10, y: Math.floor(midi / 10) };
};

// x,y座標をmidi番号に変換する
export const xyToMidi = (x: number, y: number) => {
	if (x < 1 || y < 1 || x > 9 || y > 9) {
		return 0;
	}
	return x + y * 10;
};

export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

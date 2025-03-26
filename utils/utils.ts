// midi番号をx,y座標に変換する
export const midiToXY = (midi: number) => {
	return { x: midi % 10, y: Math.floor(midi / 10) };
};

// x,y座標をmidi番号に変換する
export const xyToMidi = (x: number, y: number) => {
	return x + y * 10;
};

import type {
	ButtonSetting,
	Color,
	LightnessAnimation,
	LightnessAnimationPage,
	LightnessListList,
	MIDIDevice,
} from "@/stores/types";
import {
	colorToRGB,
	coordinateToMidi,
	midiToCoordinate,
	sleep,
} from "@/utils/utils";

export const handleSendVisualMidiMessage = async (
	event: WebMidi.MIDIMessageEvent,
	deviceList: MIDIDevice[],
	selectedVisualOutputDeviceId: string | null,
	buttonSettings: ButtonSetting[][],
) => {
	const visualOutputDevice = deviceList.find(
		(device) =>
			device.type === "output" && device.id === selectedVisualOutputDeviceId,
	);

	if (!visualOutputDevice) {
		return;
	}

	const coordinate = midiToCoordinate(event.data[1]);
	const buttonSetting = buttonSettings[coordinate.y][coordinate.x];

	effectTypeBranch(event, visualOutputDevice, buttonSetting);
};

const effectTypeBranch = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
) => {
	const coordinate = midiToCoordinate(event.data[1]);
	if (buttonSetting.effectType === "dot") {
		sendMidiMessageDot(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "horizontal") {
		sendMidiMessageHorizontal(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "vertical") {
		sendMidiMessageVertical(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "explosion") {
		sendMidiMessageExplosion(event, device, buttonSetting, coordinate);
	}
};

const sendLightnessAnimation = async (
	device: MIDIDevice,
	colorType: Color["colorType"],
	pressedCoordinate: { x: number; y: number },
	lightnessAnimation: LightnessAnimation,
) => {
	for (const lightnessAnimationPage of lightnessAnimation.pages) {
		sendLightnessAnimationPage(
			device,
			colorType,
			pressedCoordinate,
			lightnessAnimationPage,
		);
		await sleep(lightnessAnimation.duration);
	}
};

const sendLightnessAnimationPage = (
	device: MIDIDevice,
	colorType: Color["colorType"],
	pressedCoordinate: { x: number; y: number },
	lightnessAnimationPage: LightnessAnimationPage,
) => {
	let x = 0;
	let y = 0;
	for (const lightnessList of lightnessAnimationPage.lightnessListList.reverse()) {
		x = 0;
		for (const lightness of lightnessList) {
			if (lightness === null) {
				x = x + 1;
				continue;
			}
			sendLedMidiMessage(
				device,
				{
					colorType,
					lightness,
				},
				{
					x:
						pressedCoordinate.x - lightnessAnimationPage.centerCoordinate.x + x,
					y:
						pressedCoordinate.y - lightnessAnimationPage.centerCoordinate.y + y,
				},
			);
			x = x + 1;
		}
		y = y + 1;
	}
};

const sendLedMidiMessage = (
	device: MIDIDevice,
	color: Color,
	coordinate: { x: number; y: number },
) => {
	// 座標が範囲を超えたらなにもしない
	if (
		coordinate.x < 0 ||
		coordinate.x > 7 ||
		coordinate.y < 0 ||
		coordinate.y > 7
	) {
		return;
	}
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const rgb = colorToRGB(color);
	const note = coordinateToMidi(coordinate.x, coordinate.y);
	const sendMidiInfo: Uint8Array = new Uint8Array([
		0xf0,
		0x00,
		0x20,
		0x29,
		0x02,
		0x18,
		0x0b,
		note, //LED(どのパッドか)
		rgb.r, //Red(0-3F 0:OFF 3F:MAX )
		rgb.g, //Green(0-3F 0:OFF 3F:MAX)
		rgb.b, //Blue(0-3F 0:OFF 3F:MAX)
		0xf7, //End of SysEx
	]);
	midiOutput.send(sendMidiInfo);
};

const sendMidiMessageDot = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLedMidiMessage(
			device,
			{
				colorType: "black",
				lightness: 0,
			},
			coordinate,
		);
		return;
	}

	// 点灯
	sendLedMidiMessage(
		device,
		{
			colorType: buttonSetting.colorType,
			lightness: 1,
		},
		coordinate,
	);

	return;
};

const sendMidiMessageHorizontal = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLightnessAnimationPage(device, "black", coordinate, {
			lightnessListList: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
			centerCoordinate: {
				x: 7,
				y: 0,
			},
		});
		return;
	}

	// 横一列に点灯
	sendLightnessAnimationPage(device, buttonSetting.colorType, coordinate, {
		lightnessListList: [
			[
				0.01, 0.02, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 0.5, 0.3, 0.1, 0.05, 0.03,
				0.02, 0.01,
			],
		],
		centerCoordinate: {
			x: 7,
			y: 0,
		},
	});
	return;
};

const sendMidiMessageVertical = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLightnessAnimationPage(device, "black", coordinate, {
			lightnessListList: [
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0], //中心
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
			],
			centerCoordinate: { x: 0, y: 7 },
		});
		return;
	}

	// 縦一列に点灯
	sendLightnessAnimationPage(device, buttonSetting.colorType, coordinate, {
		lightnessListList: [
			[0.01],
			[0.02],
			[0.03],
			[0.05],
			[0.1],
			[0.3],
			[0.5],
			[1], //中心
			[0.5],
			[0.3],
			[0.1],
			[0.05],
			[0.03],
			[0.02],
			[0.01],
		],
		centerCoordinate: { x: 0, y: 7 },
	});
	return;
};

const sendMidiMessageExplosion = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 離したときはなにもしない
	if (inputVelocity === 0) {
		return;
	}

	sendLightnessAnimation(device, buttonSetting.colorType, coordinate, {
		pages: [
			{
				lightnessListList: [
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
					[null, null, 1, 1, 1, null, null],
					[null, null, 1, 1, 1, null, null],
					[null, null, 1, 1, 1, null, null],
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
				],
				centerCoordinate: {
					x: 3,
					y: 3,
				},
			},
			{
				lightnessListList: [
					[null, null, null, null, null, null, null],
					[null, 0.5, 0.5, 0.5, 0.5, 0.5, null],
					[null, 0.5, 0, 0, 0, 0.5, null],
					[null, 0.5, 0, 0, 0, 0.5, null],
					[null, 0.5, 0, 0, 0, 0.5, null],
					[null, 0.5, 0.5, 0.5, 0.5, 0.5, null],
					[null, null, null, null, null, null, null],
				],
				centerCoordinate: {
					x: 3,
					y: 3,
				},
			},
			{
				lightnessListList: [
					[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
					[0.1, 0, 0, 0, 0, 0, 0.1],
					[0.1, 0, null, null, null, 0, 0.1],
					[0.1, 0, null, null, null, 0, 0.1],
					[0.1, 0, null, null, null, 0, 0.1],
					[0.1, 0, 0, 0, 0, 0, 0.1],
					[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
				],
				centerCoordinate: {
					x: 3,
					y: 3,
				},
			},
			{
				lightnessListList: [
					[0, 0, 0, 0, 0, 0, 0],
					[0, null, null, null, null, null, 0],
					[0, null, null, null, null, null, 0],
					[0, null, null, null, null, null, 0],
					[0, null, null, null, null, null, 0],
					[0, null, null, null, null, null, 0],
					[0, 0, 0, 0, 0, 0, 0],
				],
				centerCoordinate: {
					x: 3,
					y: 3,
				},
			},
		],
		duration: 50,
	});
};

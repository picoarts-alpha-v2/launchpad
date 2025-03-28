"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/stores/store";
import type { ButtonSetting, Color } from "@/stores/types";

interface LaunchpadButtonSettingsProps {
	isOpen: boolean;
	onClose: () => void;
	x: number;
	y: number;
}

export function LaunchpadButtonSettings({
	isOpen,
	onClose,
	x,
	y,
}: LaunchpadButtonSettingsProps) {
	const { buttonSettings, updateButtonSetting } = useStore();
	const currentSetting = buttonSettings?.[y]?.[x];

	const handleEffectChange = (value: ButtonSetting["effectType"]) => {
		updateButtonSetting(y, x, { effectType: value });
	};

	const handleColorChange = (value: Color) => {
		updateButtonSetting(y, x, { color: value });
	};

	const handleMidiNoteChange = (value: number) => {
		updateButtonSetting(y, x, { midiNote: value });
	};

	const handleDeviceChange = (value: number) => {
		updateButtonSetting(y, x, { outputDeviceIndex: value });
	};

	if (!currentSetting) {
		return <></>;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<DialogTitle>パッド設定</DialogTitle>
						<Badge variant="outline">
							{x}, {y}
						</Badge>
					</div>
				</DialogHeader>

				<Tabs defaultValue="basic" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="basic">基本設定</TabsTrigger>
						<TabsTrigger value="advanced">詳細設定</TabsTrigger>
					</TabsList>

					<TabsContent value="basic" className="space-y-4">
						<div className="space-y-4 pt-4">
							<div className="grid gap-2">
								<Label htmlFor="effect-type">エフェクトタイプ</Label>
								<Select
									value={currentSetting.effectType}
									onValueChange={handleEffectChange}
								>
									<SelectTrigger id="effect-type">
										<SelectValue placeholder="エフェクトを選択" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="dot">ドット</SelectItem>
										<SelectItem value="explosion">爆発</SelectItem>
										<SelectItem value="vertical">縦</SelectItem>
										<SelectItem value="horizontal">横</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<Label>カラー</Label>
								<div className="grid grid-cols-2 gap-2">
									<div className="space-y-2">
										<Select
											value={currentSetting.color.colorType}
											onValueChange={(colorType: string) => {
												handleColorChange({
													colorType: colorType as Color["colorType"],
													lightness: currentSetting.color.lightness,
												});
											}}
										>
											<SelectTrigger id="color-type">
												<SelectValue placeholder="カラーを選択" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="white">白</SelectItem>
												<SelectItem value="red">赤</SelectItem>
												<SelectItem value="orange">橙</SelectItem>
												<SelectItem value="yellow">黄色</SelectItem>
												<SelectItem value="yellow-green">黄緑</SelectItem>
												<SelectItem value="green">緑</SelectItem>
												<SelectItem value="blue-green">青緑</SelectItem>
												<SelectItem value="light-blue">淡青</SelectItem>
												<SelectItem value="blue">青</SelectItem>
												<SelectItem value="purple">紫</SelectItem>
												<SelectItem value="pink">ピンク</SelectItem>
												<SelectItem value="red-purple">赤紫</SelectItem>
											</SelectContent>
										</Select>
										<Select
											value={String(currentSetting.color.lightness)}
											onValueChange={(lightness: string) => {
												handleColorChange({
													colorType: currentSetting.color.colorType,
													lightness: Number(lightness) as Color["lightness"],
												});
											}}
										>
											<SelectTrigger id="lightness">
												<SelectValue placeholder="明るさを選択" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">0</SelectItem>
												<SelectItem value="1">1</SelectItem>
												<SelectItem value="2">2</SelectItem>
												<SelectItem value="3">3</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="advanced" className="space-y-4">
						<div className="space-y-4 pt-4">
							<div className="grid gap-2">
								<Label htmlFor="midi-note">MIDI ノート</Label>
								<div className="flex gap-2 items-center">
									<Input
										type="number"
										id="midi-note"
										min="0"
										max="127"
										value={currentSetting.midiNote}
										onChange={(e) =>
											handleMidiNoteChange(Number(e.target.value))
										}
										className="w-24"
									/>
									<span className="text-sm text-muted-foreground">(0-127)</span>
								</div>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="output-device">出力デバイス番号</Label>
								<div className="flex gap-2 items-center">
									<Input
										type="number"
										id="output-device"
										min="0"
										max="127"
										value={currentSetting.outputDeviceIndex}
										onChange={(e) => handleDeviceChange(Number(e.target.value))}
										className="w-24"
									/>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outline" onClick={onClose}>
						閉じる
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

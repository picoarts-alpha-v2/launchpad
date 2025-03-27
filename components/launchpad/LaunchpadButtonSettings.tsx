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
import type { ButtonSetting } from "@/stores/types";
import { useState } from "react";

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

	const handleColorChange = (value: string) => {
		updateButtonSetting(y, x, { color: Number.parseInt(value) });
	};

	const handleMidiNoteChange = (value: string) => {
		updateButtonSetting(y, x, { midiNote: Number.parseInt(value) });
	};

	const handleDeviceChange = (value: string) => {
		updateButtonSetting(y, x, { outputDeviceId: value });
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
										<Input
											type="number"
											id="color"
											min="0"
											max="127"
											value={currentSetting.color}
											onChange={(e) => handleColorChange(e.target.value)}
											className="w-24"
										/>
										<span className="text-sm text-muted-foreground">
											(0-127)
										</span>
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
										onChange={(e) => handleMidiNoteChange(e.target.value)}
										className="w-24"
									/>
									<span className="text-sm text-muted-foreground">(0-127)</span>
								</div>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="output-device">出力デバイス</Label>
								<Select
									value={currentSetting.outputDeviceId || ""}
									onValueChange={handleDeviceChange}
								>
									<SelectTrigger id="output-device">
										<SelectValue placeholder="出力デバイスを選択" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="device1">デバイス1</SelectItem>
										<SelectItem value="device2">デバイス2</SelectItem>
									</SelectContent>
								</Select>
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

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/stores/store";
import { PlusCircle, X } from "lucide-react";
import { useEffect } from "react";

export function DeviceConnection() {
	const {
		devices,
		selectedInputDeviceId,
		selectedPlaybackOutputDeviceIdList,
		selectedVisualOutputDeviceId,
		deviceInitialize: initialize,
		setSelectedInput,
		addPlaybackOutput,
		removePlaybackOutput,
		setSelectedVisualOutput,
	} = useStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold tracking-tight">MIDIデバイス設定</h2>
				<span className="text-sm text-muted-foreground">
					デバイスを選択してください
				</span>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label htmlFor="input-device" className="text-sm font-medium">
							入力デバイス
						</label>
						<span className="text-xs text-muted-foreground">
							{selectedInputDeviceId ? "接続済み" : "未接続"}
						</span>
					</div>
					<Select
						value={selectedInputDeviceId || ""}
						onValueChange={(value) => setSelectedInput(value || null)}
					>
						<SelectTrigger id="input-device" className="w-full">
							<SelectValue placeholder="Launchpad MK2を選択" />
						</SelectTrigger>
						<SelectContent>
							{devices
								.filter((device) => device.type === "input")
								.map((device) => (
									<SelectItem key={device.id} value={device.id}>
										{device.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="text-sm font-medium">出力デバイス（再生）</label>
						<Button
							variant="outline"
							size="sm"
							onClick={() => addPlaybackOutput("")}
						>
							<PlusCircle className="h-4 w-4 mr-2" />
							追加
						</Button>
					</div>
					{selectedPlaybackOutputDeviceIdList.map((outputId, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className="relative">
							<Select
								value={outputId}
								onValueChange={(value) => {
									removePlaybackOutput(outputId);
									addPlaybackOutput(value);
								}}
							>
								<SelectTrigger className="w-full pr-12">
									<SelectValue placeholder="出力デバイスを選択" />
								</SelectTrigger>
								<SelectContent>
									{devices
										.filter((device) => device.type === "output")
										.map((device) => (
											<SelectItem key={device.id} value={device.id}>
												{device.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full"
								onClick={() => removePlaybackOutput(outputId)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label htmlFor="visual-output" className="text-sm font-medium">
							出力デバイス（映像）
						</label>
						<span className="text-xs text-muted-foreground">
							{selectedVisualOutputDeviceId ? "接続済み" : "未接続"}
						</span>
					</div>
					<Select
						value={selectedVisualOutputDeviceId || ""}
						onValueChange={(value) => setSelectedVisualOutput(value || null)}
					>
						<SelectTrigger id="visual-output" className="w-full">
							<SelectValue placeholder="映像用出力デバイスを選択" />
						</SelectTrigger>
						<SelectContent>
							{devices
								.filter((device) => device.type === "output")
								.map((device) => (
									<SelectItem key={device.id} value={device.id}>
										{device.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</Card>
	);
}

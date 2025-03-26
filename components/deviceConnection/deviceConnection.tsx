"use client";

import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function DeviceConnection() {
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
						<span className="text-xs text-muted-foreground">未接続</span>
					</div>
					<Select>
						<SelectTrigger id="input-device" className="w-full">
							<SelectValue placeholder="Launchpad MK2を選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="launchpad">Launchpad MK2</SelectItem>
							<SelectItem value="other">その他のデバイス</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label htmlFor="playback-output" className="text-sm font-medium">
							出力デバイス（再生）
						</label>
						<span className="text-xs text-muted-foreground">未接続</span>
					</div>
					<Select>
						<SelectTrigger id="playback-output" className="w-full">
							<SelectValue placeholder="再生用出力デバイスを選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="audio-interface">
								オーディオインターフェース
							</SelectItem>
							<SelectItem value="other">その他のデバイス</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label htmlFor="visual-output" className="text-sm font-medium">
							出力デバイス（映像）
						</label>
						<span className="text-xs text-muted-foreground">未接続</span>
					</div>
					<Select>
						<SelectTrigger id="visual-output" className="w-full">
							<SelectValue placeholder="映像用出力デバイスを選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="launchpad">Launchpad MK2</SelectItem>
							<SelectItem value="other">その他のデバイス</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</Card>
	);
}

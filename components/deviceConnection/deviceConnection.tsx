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
import { PlusCircle, X } from "lucide-react";

export function DeviceConnection() {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold tracking-tight">MIDIデバイス設定</h2>
				<span className="text-sm text-muted-foreground">
					デバイスを選択してください
				</span>
			</div>

			<div className="grid gap-6">
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

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="text-sm font-medium">出力デバイス（再生）</label>
						<Button variant="outline" size="sm">
							<PlusCircle className="h-4 w-4 mr-2" />
							デバイスを追加
						</Button>
					</div>

					<div className="space-y-3">
						<div className="relative">
							<Select>
								<SelectTrigger className="w-full pr-12">
									<SelectValue placeholder="再生用出力デバイスを選択" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="audio-interface">
										オーディオインターフェース
									</SelectItem>
									<SelectItem value="other">その他のデバイス</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 hover:bg-destructive hover:text-destructive-foreground"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="relative">
							<Select>
								<SelectTrigger className="w-full pr-12">
									<SelectValue placeholder="再生用出力デバイスを選択" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="audio-interface">
										オーディオインターフェース
									</SelectItem>
									<SelectItem value="other">その他のデバイス</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 hover:bg-destructive hover:text-destructive-foreground"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>
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

"use client";

import { presetManager } from "@/utils/presetManager";
import { useStore } from "@/stores/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Save, Trash2, Download } from "lucide-react";

export function PresetManager() {
	const { buttonSettings, loadPresetToState } = useStore();
	const [presets, setPresets] = useState(() => presetManager.getPresets());
	const [newPresetName, setNewPresetName] = useState("");

	const handleSavePreset = () => {
		if (!newPresetName.trim()) return;
		const newPreset = presetManager.savePreset(newPresetName, buttonSettings);
		setPresets(presetManager.getPresets());
		setNewPresetName("");
	};

	const handleLoadPreset = (presetId: string) => {
		loadPresetToState(presetId);
	};

	const handleDeletePreset = (presetId: string) => {
		presetManager.deletePreset(presetId);
		setPresets(presetManager.getPresets());
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>プリセット管理</span>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline" size="sm">
								<PlusCircle className="h-4 w-4 mr-2" />
								新規保存
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>プリセットを保存</AlertDialogTitle>
								<AlertDialogDescription>
									現在の設定をプリセットとして保存します。
								</AlertDialogDescription>
							</AlertDialogHeader>
							<div className="py-4">
								<Input
									placeholder="プリセット名を入力"
									value={newPresetName}
									onChange={(e) => setNewPresetName(e.target.value)}
								/>
							</div>
							<AlertDialogFooter>
								<AlertDialogCancel>キャンセル</AlertDialogCancel>
								<AlertDialogAction onClick={handleSavePreset}>
									<Save className="h-4 w-4 mr-2" />
									保存
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{presets.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							保存されたプリセットはありません
						</div>
					) : (
						presets.map((preset) => (
							<div
								key={preset.id}
								className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
							>
								<div className="flex flex-col">
									<span className="font-medium">{preset.name}</span>
									<span className="text-xs text-muted-foreground">
										{new Date(preset.createdAt).toLocaleDateString()}
									</span>
								</div>
								<div className="flex gap-2">
									<Button
										variant="secondary"
										size="sm"
										onClick={() => handleLoadPreset(preset.id)}
									>
										<Download className="h-4 w-4 mr-2" />
										読み込み
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive" size="sm">
												<Trash2 className="h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>プリセットの削除</AlertDialogTitle>
												<AlertDialogDescription>
													「{preset.name}」を削除してもよろしいですか？
													この操作は取り消せません。
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>キャンセル</AlertDialogCancel>
												<AlertDialogAction
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													onClick={() => handleDeletePreset(preset.id)}
												>
													削除
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}

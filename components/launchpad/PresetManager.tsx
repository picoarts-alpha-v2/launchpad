"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/stores/store";
import { presetManager } from "@/utils/presetManager";
import {
	Download,
	Loader2,
	PlusCircle,
	RefreshCw,
	Save,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PresetManager() {
	const { buttonSettings, loadPresetToState } = useStore();
	const [presets, setPresets] = useState(() => presetManager.getPresets());
	const [newPresetName, setNewPresetName] = useState("");
	const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);

	const handleSavePreset = () => {
		if (!newPresetName.trim()) return;
		const newPreset = presetManager.savePreset(newPresetName, buttonSettings);
		setPresets(presetManager.getPresets());
		setNewPresetName("");
		toast.success("プリセットを保存しました", {
			description: `"${newPresetName}" を保存しました`,
		});
	};

	const handleLoadPreset = async (presetId: string) => {
		setLoadingPresetId(presetId);
		const preset = presets.find((p) => p.id === presetId);

		try {
			loadPresetToState(presetId);
			toast.success("プリセットを読み込みました", {
				description: `"${preset?.name}" を適用しました`,
			});
		} catch (error) {
			toast.error("プリセットの読み込みに失敗しました", {
				description: "エラーが発生しました",
			});
		} finally {
			setLoadingPresetId(null);
		}
	};

	const handleDeletePreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		presetManager.deletePreset(presetId);
		setPresets(presetManager.getPresets());
		toast.success("プリセットを削除しました", {
			description: `"${preset?.name}" を削除しました`,
		});
	};

	const handleOverwritePreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;

		presetManager.updatePreset(presetId, buttonSettings);
		setPresets(presetManager.getPresets());
		toast.success("プリセットを上書きしました", {
			description: `"${preset.name}" を更新しました`,
		});
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
										variant="default"
										size="sm"
										onClick={() => handleLoadPreset(preset.id)}
										disabled={loadingPresetId === preset.id}
										className="min-w-[100px]"
									>
										{loadingPresetId === preset.id ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												読み込み中
											</>
										) : (
											<>
												<Download className="h-4 w-4 mr-2" />
												読み込み
											</>
										)}
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline" size="sm">
												<RefreshCw className="h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>プリセットの上書き</AlertDialogTitle>
												<AlertDialogDescription>
													「{preset.name}」に現在の設定を上書きしますか？
													この操作は取り消せません。
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>キャンセル</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleOverwritePreset(preset.id)}
												>
													<Save className="h-4 w-4 mr-2" />
													上書き
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
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

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import type {
	LightnessAnimation,
	LightnessAnimationPage,
} from "@/stores/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LightnessValue = number | null;
type Page = {
	id: string;
	name: string;
	grid: LightnessValue[][];
	centerCoordinate: { x: number; y: number };
};

export default function LightnessEditor() {
	const [width, setWidth] = useState<number>(7);
	const [height, setHeight] = useState<number>(7);
	const [pages, setPages] = useState<Page[]>([
		{
			id: "1",
			name: "ページ 1",
			grid: Array(height)
				.fill(null)
				.map(() => Array(width).fill(null)),
			centerCoordinate: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
		},
	]);
	const [currentPageId, setCurrentPageId] = useState<string>("1");
	const [selectedValue, setSelectedValue] = useState<LightnessValue>(1);
	const [isNullMode, setIsNullMode] = useState(false);
	const [duration, setDuration] = useState<number>(50);
	const [pageToDelete, setPageToDelete] = useState<string | null>(null);

	const currentPage =
		pages.find((page) => page.id === currentPageId) || pages[0];
	const currentGrid =
		currentPage?.grid ||
		Array(height)
			.fill(null)
			.map(() => Array(width).fill(null));

	const handleCellClick = (row: number, col: number) => {
		const newPages = pages.map((page) => {
			if (page.id === currentPageId) {
				const newGrid = [...page.grid];
				newGrid[row][col] = isNullMode ? null : selectedValue;
				return { ...page, grid: newGrid };
			}
			return page;
		});
		setPages(newPages);
	};

	const handleReset = () => {
		const newPages = pages.map((page) => {
			if (page.id === currentPageId) {
				return {
					...page,
					grid: Array(height)
						.fill(null)
						.map(() => Array(width).fill(null)),
					centerCoordinate: {
						x: Math.floor(width / 2),
						y: Math.floor(height / 2),
					},
				};
			}
			return page;
		});
		setPages(newPages);
	};

	const handleWidthChange = (value: string) => {
		const newWidth = Math.min(15, Math.max(1, Number.parseInt(value, 10) || 1));
		setWidth(newWidth);
		const newPages = pages.map((page) => ({
			...page,
			grid: Array(height)
				.fill(null)
				.map(() => Array(newWidth).fill(null)),
			centerCoordinate: {
				x: Math.min(page.centerCoordinate.x, newWidth - 1),
				y: page.centerCoordinate.y,
			},
		}));
		setPages(newPages);
	};

	const handleHeightChange = (value: string) => {
		const newHeight = Math.min(
			15,
			Math.max(1, Number.parseInt(value, 10) || 1),
		);
		setHeight(newHeight);
		const newPages = pages.map((page) => ({
			...page,
			grid: Array(newHeight)
				.fill(null)
				.map(() => Array(width).fill(null)),
			centerCoordinate: {
				x: page.centerCoordinate.x,
				y: Math.min(page.centerCoordinate.y, newHeight - 1),
			},
		}));
		setPages(newPages);
	};

	const handleAddPage = () => {
		const newPage: Page = {
			id: String(pages.length + 1),
			name: `ページ ${pages.length + 1}`,
			grid: Array(height)
				.fill(null)
				.map(() => Array(width).fill(null)),
			centerCoordinate: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
		};
		setPages([...pages, newPage]);
		setCurrentPageId(newPage.id);
	};

	const handleDeletePage = (pageId: string) => {
		if (pages.length === 1) {
			toast.error("最後のページは削除できません");
			return;
		}
		setPageToDelete(pageId);
	};

	const confirmDeletePage = () => {
		if (!pageToDelete) return;

		const newPages = pages.filter((page) => page.id !== pageToDelete);
		setPages(newPages);
		if (currentPageId === pageToDelete) {
			setCurrentPageId(newPages[0].id);
		}
		setPageToDelete(null);
	};

	const handleCenterCoordinateChange = (x: number, y: number) => {
		const newPages = pages.map((page) => {
			if (page.id === currentPageId) {
				return {
					...page,
					centerCoordinate: {
						x: Math.min(Math.max(0, x), width - 1),
						y: Math.min(Math.max(0, y), height - 1),
					},
				};
			}
			return page;
		});
		setPages(newPages);
	};

	const handleExport = async () => {
		const animation: LightnessAnimation = {
			pages: pages.map((page) => ({
				lightnessListList: page.grid,
				centerCoordinate: page.centerCoordinate,
			})),
			duration,
		};
		try {
			await navigator.clipboard.writeText(JSON.stringify(animation, null, 2));
			toast.success("アニメーションデータがクリップボードにコピーされました");
		} catch (error) {
			toast.error("データのコピーに失敗しました");
		}
	};

	return (
		<div className="container mx-auto p-4 max-w-2xl">
			<h1 className="text-2xl font-bold mb-4">LaunchPad Lightness Editor</h1>

			<Card className="p-4 mb-4">
				<div className="flex items-center gap-4 mb-4">
					<div className="flex-1">
						<Label>明るさ: {selectedValue}</Label>
						<Slider
							value={[selectedValue || 0]}
							onValueChange={([value]: number[]) => setSelectedValue(value)}
							min={0}
							max={1}
							step={0.01}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Switch
							checked={isNullMode}
							onCheckedChange={setIsNullMode}
							id="null-mode"
						/>
						<Label htmlFor="null-mode">Null Mode</Label>
					</div>
				</div>

				<div className="flex gap-2 mb-4">
					<div className="flex items-center gap-2">
						<Label>幅:</Label>
						<Input
							type="number"
							min={1}
							max={15}
							value={width}
							onChange={(e) => handleWidthChange(e.target.value)}
							className="w-20"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label>高さ:</Label>
						<Input
							type="number"
							min={1}
							max={15}
							value={height}
							onChange={(e) => handleHeightChange(e.target.value)}
							className="w-20"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label>中心X:</Label>
						<Input
							type="number"
							min={0}
							max={width - 1}
							value={currentPage.centerCoordinate.x}
							onChange={(e) =>
								handleCenterCoordinateChange(
									Number.parseInt(e.target.value, 10),
									currentPage.centerCoordinate.y,
								)
							}
							className="w-20"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label>中心Y:</Label>
						<Input
							type="number"
							min={0}
							max={height - 1}
							value={currentPage.centerCoordinate.y}
							onChange={(e) =>
								handleCenterCoordinateChange(
									currentPage.centerCoordinate.x,
									Number.parseInt(e.target.value, 10),
								)
							}
							className="w-20"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label>間隔(ms):</Label>
						<Input
							type="number"
							min={1}
							value={duration}
							onChange={(e) => setDuration(Number.parseInt(e.target.value, 10))}
							className="w-20"
						/>
					</div>
					<Button onClick={handleReset}>リセット</Button>
					<Button onClick={handleExport}>エクスポート</Button>
				</div>
			</Card>

			<Tabs
				value={currentPageId}
				onValueChange={setCurrentPageId}
				className="w-full"
			>
				<div className="flex items-center justify-between mb-2">
					<TabsList className="w-full">
						{pages.map((page) => (
							<TabsTrigger
								key={page.id}
								value={page.id}
								className="flex items-center gap-2"
							>
								{page.name}
								{pages.length > 1 && (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleDeletePage(page.id);
										}}
										className="p-1 hover:bg-destructive/10 rounded-full"
									>
										<Trash2 className="h-3 w-3" />
									</button>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					<Button
						variant="outline"
						size="icon"
						onClick={handleAddPage}
						className="ml-2"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>

				{pages.map((page) => (
					<TabsContent key={page.id} value={page.id}>
						<div
							className="grid gap-1"
							style={{
								gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
							}}
						>
							{page.grid.map((row, rowIndex) =>
								row.map((value, colIndex) => (
									<button
										type="button"
										key={`cell-${rowIndex}-${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											colIndex
										}`}
										onClick={() => handleCellClick(rowIndex, colIndex)}
										className={`
											aspect-square rounded-sm
											${value === null ? "bg-gray-300" : "bg-blue-500"}
											${value === null ? "hover:bg-gray-400" : "hover:bg-blue-600"}
											transition-colors
											${page.centerCoordinate.x === colIndex && page.centerCoordinate.y === rowIndex ? "ring-2 ring-red-500" : ""}
										`}
										style={{
											opacity: value === null ? 0.5 : value,
										}}
									/>
								)),
							)}
						</div>
					</TabsContent>
				))}
			</Tabs>

			<AlertDialog
				open={!!pageToDelete}
				onOpenChange={() => setPageToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>ページを削除</AlertDialogTitle>
						<AlertDialogDescription>
							このページを削除してもよろしいですか？この操作は取り消せません。
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>キャンセル</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDeletePage}>
							削除
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

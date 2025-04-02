"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type LightnessValue = number | null;

export default function LightnessEditor() {
	const [width, setWidth] = useState<number>(7);
	const [height, setHeight] = useState<number>(7);
	const [grid, setGrid] = useState<LightnessValue[][]>(
		Array(height)
			.fill(null)
			.map(() => Array(width).fill(null)),
	);
	const [selectedValue, setSelectedValue] = useState<LightnessValue>(1);
	const [isNullMode, setIsNullMode] = useState(false);

	const handleCellClick = (row: number, col: number) => {
		const newGrid = [...grid];
		newGrid[row][col] = isNullMode ? null : selectedValue;
		setGrid(newGrid);
	};

	const handleReset = () => {
		setGrid(
			Array(height)
				.fill(null)
				.map(() => Array(width).fill(null)),
		);
	};

	const handleWidthChange = (value: string) => {
		const newWidth = Math.min(15, Math.max(1, Number.parseInt(value, 10) || 1));
		setWidth(newWidth);
		setGrid(
			Array(height)
				.fill(null)
				.map(() => Array(newWidth).fill(null)),
		);
	};

	const handleHeightChange = (value: string) => {
		const newHeight = Math.min(
			15,
			Math.max(1, Number.parseInt(value, 10) || 1),
		);
		setHeight(newHeight);
		setGrid(
			Array(newHeight)
				.fill(null)
				.map(() => Array(width).fill(null)),
		);
	};

	const handleExport = async () => {
		const gridString = JSON.stringify(grid, null, 2);
		try {
			await navigator.clipboard.writeText(gridString);
			toast.success("グリッドのデータがクリップボードにコピーされました");
		} catch (error) {
			toast.error("グリッドのデータのコピーに失敗しました");
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
					<Button onClick={handleReset}>リセット</Button>
					<Button onClick={handleExport}>エクスポート</Button>
				</div>
			</Card>

			<div
				className="grid gap-1"
				style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
			>
				{grid.map((row, rowIndex) =>
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
              `}
							style={{
								opacity: value === null ? 0.5 : value,
							}}
						/>
					)),
				)}
			</div>
		</div>
	);
}

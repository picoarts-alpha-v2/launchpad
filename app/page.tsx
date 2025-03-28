import { DeviceConnection } from "@/components/deviceConnection/deviceConnection";
import { Launchpad } from "@/components/launchpad/LaunchPad";
import { PresetManager } from "@/components/launchpad/PresetManager";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/95">
			<div className="container mx-auto px-4 py-8">
				{/* ヘッダー */}
				<header className="mb-12">
					<h1 className="text-3xl font-bold tracking-tight mb-2">
						Launchpad Controller
					</h1>
					<p className="text-muted-foreground">
						MIDIデバイスの設定と操作をカスタマイズできます
					</p>
				</header>

				{/* メインコンテンツ */}
				<div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
					{/* 左カラム: デバイス接続とプリセット */}
					<div className="space-y-8">
						{/* デバイス接続セクション */}
						<section>
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-muted-foreground">
									デバイス接続
								</h2>
								<div className="h-0.5 w-12 bg-primary/50 mt-2" />
							</div>
							<DeviceConnection />
						</section>

						{/* プリセット管理セクション */}
						<section>
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-muted-foreground">
									プリセット
								</h2>
								<div className="h-0.5 w-12 bg-primary/50 mt-2" />
							</div>
							<PresetManager />
						</section>
					</div>

					{/* 右カラム: コントローラー */}
					<section className="mt-8 lg:mt-0">
						<div className="mb-6">
							<h2 className="text-lg font-semibold text-muted-foreground">
								コントローラー
							</h2>
							<div className="h-0.5 w-12 bg-primary/50 mt-2" />
						</div>
						<div className="flex justify-center lg:sticky lg:top-8">
							<Launchpad />
						</div>
					</section>
				</div>

				{/* フッター */}
				<footer className="mt-20 pb-8 text-center text-sm text-muted-foreground">
					<p>スノーフレークラブ あお 2025</p>
				</footer>
			</div>
		</div>
	);
}

import { DeviceConnection } from "@/components/deviceConnection/deviceConnection";
import { Launchpad } from "@/components/launchpad/LaunchPad";

export default function Home() {
	return (
		<>
			<DeviceConnection />
			<Launchpad />
		</>
	);
}

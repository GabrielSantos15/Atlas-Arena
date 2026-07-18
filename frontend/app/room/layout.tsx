import RoomLifecycle from "@/components/setup/RoomLifecycle";
import { GameProvider } from "@/providers/GameProvider";


export default function RoomLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <GameProvider>
        <RoomLifecycle/>
        {children}
    </GameProvider>;
}
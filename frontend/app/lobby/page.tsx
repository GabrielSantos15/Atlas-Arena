'use client'
import PlayersList from "@/components/lobby/playersList/PlayersList";
import { Player } from "@/interfaces/Player";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";

export default function Lobby() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        socket.emit("lobby:join");

        const handlePlayersUpdate = (data: Player[]) => {
            setPlayers(data);
        };

        socket.on("players:update", handlePlayersUpdate);

        return () => {
            socket.off("players:update", handlePlayersUpdate);
        };
    }, []);
    return (
        <div >
            <PlayersList players={players}></PlayersList>
        </div>
    )
}

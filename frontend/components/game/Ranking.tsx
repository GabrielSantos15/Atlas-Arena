"use  client";

import { motion } from "framer-motion";
import { Player } from "@/interfaces/Player";
import { getOrCreatePlayerId } from "@/lib/player";
import UserImage from "../ui/UserImage";

interface RankingProps {
    ranking: Player[];
    className?: string;
}

export default function Ranking({ ranking, className }: RankingProps) {
    const playerId = getOrCreatePlayerId();

    return (
        <div className={`bg-[var(--bg-surface)] w-full p-4 rounded-2xl shadow ${className}`}>
            <h3 className="text-xl font-semibold mb-4">
                Ranking
            </h3>

            <div className="flex flex-col gap-2">
                {ranking.map((player, index) => {
                    const isMe = playerId === player.playerId;
                    const isOffline = !player.online;

                    return (
                        <motion.div
                            key={player.playerId}
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center justify-between rounded-lg p-3 sm:p-4 shadow transition-all border 
                                ${isMe ? "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]" : "bg-[var(--bg-surface)] border-[var(--border-color)]"}
                                ${isOffline ? "opacity-50 grayscale" : ""} 
                            `}
                        >
                            <div className="flex items-center gap-3 w-full min-w-0">
                                
                                <span className={`font-bold rounded-full border-[var(--border-color)] p-2 flex-shrink-0 ${index === 0 && !isOffline ? "bg-yellow-500/20" : ""}`}>
                                    #{index + 1}
                                </span>
                                
                                <UserImage seed={player.avatarSeed} nickname={player.nickname} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full flex-shrink-0" />
                                
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        
                                        <span className={`truncate ${isMe ? "font-bold" : "font-semibold"}`} title={player.nickname}>
                                            {player.nickname} {isMe && "(Você)"}
                                        </span>
                                        
                                        {isOffline && (
                                            <span className="flex-shrink-0 text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm">
                                        {player.score} pts
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
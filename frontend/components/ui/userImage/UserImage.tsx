interface UserImagerProps {
    seed: string;
    nickname?: string;
    className?: string;
}

export default function UserImage({ seed, className, nickname }: UserImagerProps) {
    const pastelPalette = "ffb3ba,ffdfba,ffffba,baffc9,bae1ff,d0c0e5,b6e3f4,f3c4fb,caffbf,fdffb6";

    return (
        <img
            src={`https://api.dicebear.com/10.x/avataaars/svg?seed=${seed}&backgroundColor=${pastelPalette}`}
            alt={`Avatar do ${nickname ?? "usuário"}`}
            width={128}
            height={128}
            className={`rounded-full border border-[var(--border-color)] ${className}`}
        />
    );
}
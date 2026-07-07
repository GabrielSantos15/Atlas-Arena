export interface RoomSession {
	code: string;
}

const ROOM_SESSION_KEY = "quiz:room-session";

export function saveRoomSession(session: RoomSession) {
	sessionStorage.setItem(ROOM_SESSION_KEY, JSON.stringify(session));
}

export function getRoomSession(): RoomSession | null {
	const data = sessionStorage.getItem(ROOM_SESSION_KEY);
	if (!data) return null;

	try {
		return JSON.parse(data) as RoomSession;
	} catch {
		clearRoomSession();
		return null;
	}
}

export function clearRoomSession() {
	sessionStorage.removeItem(ROOM_SESSION_KEY);
}

import type { Player } from "@/interfaces/Player";

export function sortPlayersForRanking(players: Player[]) {
  return [...players].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.correctAnswers !== left.correctAnswers) {
      return right.correctAnswers - left.correctAnswers;
    }

    const nicknameComparison = left.nickname.localeCompare(right.nickname);

    if (nicknameComparison !== 0) {
      return nicknameComparison;
    }

    return left.playerId.localeCompare(right.playerId);
  });
}

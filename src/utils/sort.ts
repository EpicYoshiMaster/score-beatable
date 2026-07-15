import { Difficulty, HighScoreResult } from "@/types";

export const difficultyToNumber = (difficulty: Difficulty) => {
	switch(difficulty) {
		case "Beginner": return 0;
		case "Easy": return 1;
		case "Normal": return 2;
		case "Hard": return 3;
		case "UNBEATABLE": return 4;
		case "Star": return 5;
		// Should be unused for arcade
		case "Tutorial": return 6;
		case "OFFSETWIZARD": return 7;
		case "Trailer": return 8;
		default: return 9;
	}
}

export const sortResultsByDifficulty = (a: HighScoreResult, b: HighScoreResult, reverse?: boolean) => {
	if(reverse) {
		return difficultyToNumber(b.difficulty) - difficultyToNumber(a.difficulty)
	}

	return difficultyToNumber(a.difficulty) - difficultyToNumber(b.difficulty);
}

export const sortResultsByTitle = (a: HighScoreResult, b: HighScoreResult) => {
	const upperA = a.title.toUpperCase();
	const upperB = b.title.toUpperCase();

	if(upperA < upperB) return -1;
	if(upperA > upperB) return 1;

	return sortResultsByDifficulty(a, b, true);
}

export const sortResultsByScore = (a: HighScoreResult, b: HighScoreResult, reverse?: boolean) => {
	return reverse ? b.score - a.score : a.score - b.score;
}

export const sortResultsByAccuracy = (a: HighScoreResult, b: HighScoreResult, reverse?: boolean) => {
	return reverse ? b.accuracy - a.accuracy : a.accuracy - b.accuracy;
}
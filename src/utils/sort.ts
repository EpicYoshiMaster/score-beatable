import { Difficulty, HighScoreResult, SortMethod } from "@/types";

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

const sortByString = (a: string, b: string) => {
	const upperA = a.toUpperCase();
	const upperB = b.toUpperCase();

	if(upperA < upperB) return -1;
	if(upperA > upperB) return 1;

	return 0;
}

export const sortResultsByRating = (a: HighScoreResult, b: HighScoreResult) => {
	return b.rating - a.rating;
}

export const sortResultsByAccuracy = (a: HighScoreResult, b: HighScoreResult) => {
	return b.accuracy - a.accuracy;
}

export const sortResultsByLevel = (a: HighScoreResult, b: HighScoreResult) => {
	return b.level - a.level;
}

export const sortResultsByDifficulty = (a: HighScoreResult, b: HighScoreResult) => {
	return difficultyToNumber(b.difficulty) - difficultyToNumber(a.difficulty)
}

export const sortResultsByScore = (a: HighScoreResult, b: HighScoreResult) => {
	return b.score - a.score;
}

export const sortResultsByTitle = (a: HighScoreResult, b: HighScoreResult) => {
	const titleA = a.songEntry.title === '' ? a.title : a.songEntry.title;
	const titleB = b.songEntry.title === '' ? b.title : b.songEntry.title;

	return sortByString(titleA, titleB);
}

export const sortResultsByArtist = (a: HighScoreResult, b: HighScoreResult) => {
	return sortByString(a.songEntry.artist, b.songEntry.artist);
}

export const sortResultsByCreator = (a: HighScoreResult, b: HighScoreResult) => {
	return sortByString(a.songEntry.creator, b.songEntry.creator);
}

export const SORT_METHODS: SortMethod[] = [
	{ name: 'Rating', value: 'rating', function: sortResultsByRating },
	{ name: 'Accuracy', value: 'accuracy', function: sortResultsByAccuracy },
	{ name: 'Level', value: 'level', function: sortResultsByLevel },
	{ name: 'Difficulty', value: 'difficulty', function: sortResultsByDifficulty },
	{ name: 'Score', value: 'score', function: sortResultsByScore },
	{ name: 'Song Title', value: 'title', function: sortResultsByTitle },
	{ name: 'Artist', value: 'artist', function: sortResultsByArtist },
	{ name: 'Charted By', value: 'creator', function: sortResultsByCreator },
];
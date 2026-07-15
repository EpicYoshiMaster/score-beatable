// Based on Ratings as of 2.0.6
import { HighScoreResult, SongEntry } from "@/types";
import songs from "@/data/songs.json";

const ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL = 1;
const MAX_COMPLETION_RATING = 2;

const shouldCountResult = (result: HighScoreResult) => result.cleared && !result.custom && (result.modifier === 'Classic' || result.modifier === 'DoubleTime');

const allSongDifficulties = (entry: string): SongEntry[] => {
	return Object.entries(songs).filter(([key]) => key.startsWith(entry)).map(([key, value]) => value);
}

// 2.504975
export const getCompletionRating = (results: HighScoreResult[]) => {
	const totalNumArcadeCharts = Object.keys(songs).length + ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL;
	const divided = 2.0 / totalNumArcadeCharts;

	console.log('Total:', totalNumArcadeCharts);

	//const relevantResults = results.filter(shouldCountResult);
	
	return Math.min(divided, MAX_COMPLETION_RATING);
}

export const getPlayerRank = (results: HighScoreResult[]) => {
	if(results.length === 0) return 0;

	const relevantResults = results.filter(shouldCountResult);

	return relevantResults.reduce((totalScore, result) => {
		const newTotalScore = totalScore + result.score;

		return newTotalScore;
	}, 0);
}
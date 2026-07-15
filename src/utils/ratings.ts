// Based on Ratings as of 2.0.6 (PlayerStatsHelper.cs)
import { HighScoreResult, SongEntry } from "@/types";
import songs from "@/data/songs.json";
import { difficultyToNumber } from "./sort";

// play an unbeatable chart
// check at unbeatable
// then go down to beginner
// replace if the accuracy is lower

// Beginner, Easy, Normal, Hard, UNBEATABLE, Star
const DIFFICULTY_COUNT = 6;

// disclaimer you are awesome dcell i just thought having a really long variable name would be funny
const ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL = 1;
const MAX_COMPLETION_RATING = 2.0;

const shouldCountResult = (result: HighScoreResult) => result.cleared && !result.custom && (result.modifier === 'Classic' || result.modifier === 'DoubleTime');

const allSongDifficulties = (entry: string): SongEntry[] => {
	return Object.entries(songs).filter(([key]) => key.startsWith(entry)).map(([key, value]) => value);
}

export const getCompletionRating = (results: HighScoreResult[]) => {
	const totalNumArcadeCharts = Object.keys(songs).length + ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL;
	const base = MAX_COMPLETION_RATING / totalNumArcadeCharts;

	const relevantResults = results.filter(shouldCountResult);

	const accuracyResultList = relevantResults.reduce((dictionary, result) => {
		if(!(result.entry in dictionary)) {
			dictionary = {
				...dictionary,
				//Internally this array is a bit different because it includes leftovers of unused difficulties, but they're avoided anyways and have no impact on rating
				[result.entry]: Array(DIFFICULTY_COUNT).fill(0)
			}
		}

		dictionary[result.entry] = dictionary[result.entry].map((accuracy, index) => {
			// ex. play an UNBEATABLE chart get 0.95 accuracy, if you got 0.8 on Beginner, it would be replaced with the more difficult 0.95
			if(difficultyToNumber(result.difficulty) >= index && result.accuracy > accuracy) {
				return result.accuracy;
			}

			return accuracy;
		})

		return dictionary;
	}, {} as { [k: string]: number[] });

	console.log(accuracyResultList);

	// Now the odd part, for each result, we exponentiate it by our accuracy and sum those all together.
	// This results in low accuracies contributing More completion and high accuracies contributing Less
	const completionRating = Object.values(accuracyResultList).flat().reduce((completion, accuracy) => {
		return accuracy === 0 ? completion : completion + Math.pow(base, accuracy);
	}, 0);
	
	return Math.min(completionRating, MAX_COMPLETION_RATING);
}

export const getPlayerRank = (results: HighScoreResult[]) => {
	if(results.length === 0) return 0;

	const relevantResults = results.filter(shouldCountResult);

	return relevantResults.reduce((totalScore, result) => {
		const newTotalScore = totalScore + result.score;

		return newTotalScore;
	}, 0);
}
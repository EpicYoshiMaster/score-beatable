// Based on Ratings as of 2.0.6 (PlayerStatsHelper.cs)
import { HighScoreResult, SongEntry } from "@/types";
import songs from "@/data/songs.json";
import { difficultyToNumber } from "./sort";
import { getGradeCoefArcade } from "./grades";
import { formatAccuracy } from "./format";

// Beginner, Easy, Normal, Hard, UNBEATABLE, Star
const DIFFICULTY_COUNT = 6;

// disclaimer you are awesome dcell i just thought having a really long variable name would be funny
const ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL = 1;
const MAX_COMPLETION_RATING = 2.0;
export const RATING_TOP_CUT = 25;

export const shouldCountResult = (result: HighScoreResult) => result.cleared && !result.custom && (result.modifier === 'Classic' || result.modifier === 'DoubleTime');

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

	// Now the odd part, for each result, we exponentiate it by our accuracy and sum those all together.
	// This results in low accuracies contributing More completion and high accuracies contributing Less
	const completionRating = Object.values(accuracyResultList).flat().reduce((completion, accuracy) => {
		return accuracy === 0 ? completion : completion + Math.pow(base, accuracy);
	}, 0);
	
	return Math.min(completionRating, MAX_COMPLETION_RATING);
}

export const getCombinedHighScore = (results: HighScoreResult[]): number => {
	if(results.length === 0) return 0;

	const relevantResults = results.filter((result) => result.cleared && !result.custom);

	return relevantResults.reduce((totalScore, result) => {
		return totalScore + result.score;
	}, 0);
}

export const getSongRating = (accuracy: number, level: number, isNoMiss: boolean, cleared: boolean) => {
	if(!cleared) return 0;

	const levelScale = level / 2.25; //[1, 25] => [0.444..., 11.111...] 
	
	// as long as your accuracy is > 0.51 this will be beneficial scaling
	const scaledAccuracy = ((accuracy <= 0.5) ? 0 : Math.pow((accuracy - 0.5) * 100, 1.12)); //[0, 0.5, 0.501, 0.51, 1] => [0, 0, 0.076, 1, 79.956]
	const gradeCoefArcade = getGradeCoefArcade(accuracy, isNoMiss, true); // [10, 12, 15, 20, 25]
	const total = scaledAccuracy + gradeCoefArcade; // [(0, 10), (79.956, 25)] => [10, 104.955]
	const rating = levelScale * (total / 100.0); // [(0.444, 10), (11.111, 104.955)] => [0.044, 11.662]

	return rating;
}

export const getResultRating = (result: HighScoreResult) => {
	return getSongRating(result.accuracy, result.level, result.isNoMiss, result.cleared);
}

export const getTotalSongRating = (results: HighScoreResult[]) => {
	if(results.length === 0) return 0;

	const relevantResults = results.filter(shouldCountResult);

	const dictionary = relevantResults.reduce((dictionary, result) => {
		const rating = getResultRating(result);
		const entryAndDifficulty = `${result.entry}/${result.difficulty}`;

		if(!(entryAndDifficulty in dictionary)) {
			return {
				...dictionary,
				[entryAndDifficulty]: rating
			}
		}

		dictionary[entryAndDifficulty] = dictionary[entryAndDifficulty] < rating ? rating : dictionary[entryAndDifficulty];

		return dictionary;
	}, {} as { [k: string]: number });

	const totalRating = Object.entries(dictionary)
		.sort(([, ratingA], [, ratingB]) => ratingB - ratingA) //descending
		.filter((_value, index) => index < RATING_TOP_CUT)
		.reduce((totalRating, [,rating]) => {
			return totalRating + rating;
		}, 0);

	const averagedRating = totalRating / RATING_TOP_CUT;

	return averagedRating;
}

export const buildRatingTable = () => {
	const levels =[...Array(25).keys()].map((level) => level + 1); // 1-25
	const accuracies = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99, 1];

	return levels.reduce((table, level) => {
		return { 
			...table,
			[`${level}`]: accuracies.reduce((rows, accuracy) => {
				return { ...rows, [`${formatAccuracy(accuracy)}`]: getSongRating(accuracy, level, accuracy === 1, true) }
			}, {}) 
		}
	}, {} as { [key: string]: { [key: string]: number }});
}
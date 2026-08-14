// Based on Ratings as of 2.2.1 (PlayerStatsHelper.cs)
import type { AccuracyRange, HeaderRow, HighScoreEntry, HighScoreResult, SongEntry, TableRow } from "~/types";
import songs from "~/data/songs.json";
import { difficultyToNumber, sortResultsByRating } from "./sort";
import { getGradeCoefArcade } from "./grades";
import { formatAccuracy } from "./format";
import { processScores } from "./process";

// Beginner, Easy, Normal, Hard, UNBEATABLE, Star
const DIFFICULTY_COUNT = 6;

// disclaimer you are awesome dcell i just thought having a really long variable name would be funny
const ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL = 1;
export const MAX_COMPLETION_RATING = 2.0;
export const RATING_TOP_CUT = 25;

export const UNPLAYED_ENTRY: HighScoreEntry = {
	song: '',
	score: 0,
	accuracy: 0,
	maxCombo: 0,
	level: 0,
	cleared: false,
	updateCount: 0,
	isNoMiss: false,
	isFullCombo: false,
	isPerfectFullCombo: false,
	modifierMask: 0,
	grade: null,
	notes: [],
}

export const shouldCountResult = (result: HighScoreResult) => result.cleared && !result.isCustom && (result.modifier === 'Classic' || result.modifier === 'DoubleTime');

export const getTotalNumArcadeCharts = (includeDlc: boolean = true) => {
	return Object.values(songs).filter((song: SongEntry) => includeDlc || !song.isDlc).length 
		+ ADD_FAMILIAR_TUTORIAL_BECAUSE_FOR_SOME_REASON_ITS_DIFFERENT_SO_IT_DOESNT_SHOW_UP_IN_THE_DATABASE_BUT_IT_DOES_SHOW_IN_VISIBLE_SONGS_EVEN_THOUGH_YOU_LITERALLY_CANNOT_PLAY_IT_WOW_DCELL;
}

export const getUnplayedArcadeCharts = (results: HighScoreResult[]): HighScoreResult[] => {
	const entries: HighScoreEntry[] = Object.entries(songs).filter(([key]: [string, SongEntry]) => {
		return results.findIndex((result) => `${result.entry}/${result.difficulty}` === key) === -1
	}).map(([key]) => ({
		...UNPLAYED_ENTRY,
		song: `${key}\\Classic`,
	}));

	return processScores(entries, true);
}

export const getCompletionRating = (results: HighScoreResult[], includeDlc: boolean = true) => {
	const base = MAX_COMPLETION_RATING / getTotalNumArcadeCharts(includeDlc);

	const relevantResults = results.filter(shouldCountResult).filter((result) => includeDlc || !result.isDlc);

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

export const getCombinedHighScore = (results: HighScoreResult[], includeDlc: boolean = true): number => {
	if(results.length === 0) return 0;

	const relevantResults = results.filter((result) => (result.cleared && !result.isCustom) && (includeDlc || !result.isDlc));

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

const buildResultsDictionary = (results: HighScoreResult[]) => {
	return results.reduce((dictionary, result) => {
		const entryAndDifficulty = `${result.entry}/${result.difficulty}`;

		if(!(entryAndDifficulty in dictionary)) {
			return {
				...dictionary,
				[entryAndDifficulty]: result
			}
		}

		dictionary[entryAndDifficulty] = dictionary[entryAndDifficulty].rating < result.rating ? result : dictionary[entryAndDifficulty];

		return dictionary;
	}, {} as { [k: string]: HighScoreResult });
}

export const getTopCut = (results: HighScoreResult[], includeDlc: boolean = true) => {
	if(results.length === 0) return [];

	const relevantResults = results.filter(shouldCountResult).filter((result) => includeDlc || !result.isDlc);
	const dictionary = buildResultsDictionary(relevantResults);

	return Object.entries(dictionary)
		.map(([, result]) => result)
		.sort(sortResultsByRating)
		.filter((_value, index) => index < RATING_TOP_CUT)
}

export const getTotalSongRating = (results: HighScoreResult[], includeDlc: boolean = true) => {
	if(results.length === 0) return 0;

	const topCut = getTopCut(results, includeDlc);

	const totalRating = topCut.reduce((totalRating, result) => {
		return totalRating + result.rating;
	}, 0);

	const averagedRating = totalRating / RATING_TOP_CUT;

	return averagedRating;
}

export const GENERAL_ACCURACIES = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
export const MIDDLE_ACCURACIES = [0.75, 0.775, 0.8, 0.825, 0.85, 0.875, 0.9, 0.925, 0.95, 0.975, 1];
export const UPPER_ACCURACIES = [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1];
export const TOP_ACCURACIES = [0.95, 0.955, 0.96, 0.965, 0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1];

export const buildRatingTable = (accuracyRange: AccuracyRange, noMiss: boolean) => {
	const levels = [...Array(25).keys()].map((level) => level + 1); // 1-25

	let accuracies = [];

	switch(accuracyRange) {
		case 'General': accuracies = GENERAL_ACCURACIES; break;
		case 'Middle': accuracies = MIDDLE_ACCURACIES; break;
		case 'Upper': accuracies = UPPER_ACCURACIES; break;
		case 'Top': accuracies = TOP_ACCURACIES; break;
	}

	const headerRow: HeaderRow = {
		header: '',
		columns: ['LV / ACC'].concat(accuracies.map((accuracy) => formatAccuracy(accuracy)))
	}

	const levelRows: TableRow[] = levels.map((level) => {
		return {
			header: `${level < 10 ? `0${level}` : level}`,
			columns: accuracies.map((accuracy) => { 
				const rating = getSongRating(accuracy, level, noMiss, true);

				return { averagedRating: rating / RATING_TOP_CUT, rating };
			})
		}
	})

	return {
		headerRow,
		levelRows
	};
}
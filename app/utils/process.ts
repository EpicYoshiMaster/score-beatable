import type { HighScoreResult, HighScoreEntry, Modifier, Difficulty, SongEntry, ClearState, SongType } from "~/types";
import songs from "~/data/songs.json";
import { getGrade } from "./grades";
import { getSongRating, RATING_TOP_CUT } from "./ratings";

// They're formatted as Internal Song Name/Difficulty\Modifier
const splitSongField = (song: string): { entry: string, difficulty: Difficulty, modifier: Modifier } => {
	const firstSplit = song.split('/');

	if(firstSplit.length === 2) {
		const entry = firstSplit[0];

		const secondSplit = firstSplit[1].split('\\');

		if(secondSplit.length === 2) {
			const difficulty = secondSplit[0] as Difficulty;
			const modifier = secondSplit[1] as Modifier;

			return {
				entry,
				difficulty,
				modifier
			};
		}

		return {
			entry,
			difficulty: 'Unknown',
			modifier: 'Unknown',
		}
	}

	return {
		entry: 'Unknown',
		difficulty: 'Unknown',
		modifier: 'Unknown',
	}
}

const getClearState = (scoreEntry: HighScoreEntry, isUnplayed = false): ClearState => {
	if(isUnplayed) return 'Unplayed';
	if(!scoreEntry.cleared) return 'Fail';
	if(scoreEntry.isPerfectFullCombo) return 'PerfectFullCombo';
	if(scoreEntry.isFullCombo) return 'FullCombo';

	return 'Clear';
}

const UNKNOWN_SONG_ENTRY: SongEntry = {
	title: '',
	difficulty: '',
	artist: '',
	creator: '',
	level: -1,
	songLength: -1,
	flavorText: '',
	isDlc: false,
}

export const processScores = (highScoresData: HighScoreEntry[], isUnplayed = false): HighScoreResult[] => {
	return highScoresData.map((score) => {

		const songFields = splitSongField(score.song);

		const entryAndDifficulty = `${songFields.entry}/${songFields.difficulty}`;
		const songDatabase = songs as { [key: string]: SongEntry };

		const songEntry: SongEntry = entryAndDifficulty in songDatabase ? songDatabase[entryAndDifficulty] : UNKNOWN_SONG_ENTRY;

		// Several charts in score data have levels that don't match what is in-game :(
		const level = entryAndDifficulty in songDatabase ? songDatabase[entryAndDifficulty].level : score.level;

		const title = songFields.entry;
		const isCustom = title.startsWith("CUSTOM_");
		const isDlc = entryAndDifficulty in songDatabase ? songDatabase[entryAndDifficulty].isDlc : false;
		const songType: SongType = isCustom ? 'Custom' : (isDlc ? 'DLC' : 'Base');
		
		const resultGrade = getGrade(score.accuracy, score.isNoMiss, score.cleared);
		const rating = getSongRating(score.accuracy, level, score.isNoMiss, score.cleared);
		const averagedRating = rating / RATING_TOP_CUT;
		const clearState = getClearState(score, isUnplayed);

		return {
			...score,
			...songFields,
			title,
			isCustom,
			isDlc,
			resultGrade,
			rating,
			averagedRating,
			level,
			clearState,
			songType,
			songEntry
		};
	});
}
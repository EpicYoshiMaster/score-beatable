import { HighScoreResult, HighScoreEntry, Modifier, Difficulty, SongEntry } from "@/types";
import songs from "@/data/songs.json";
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

export const processScores = (highScoresData: HighScoreEntry[]): HighScoreResult[] => {
	return highScoresData.map((score) => {

		const songFields = splitSongField(score.song);

		const entryAndDifficulty = `${songFields.entry}/${songFields.difficulty}`;
		const songDatabase = songs as { [key: string]: SongEntry };
		const title = entryAndDifficulty in songDatabase ? songDatabase[entryAndDifficulty].title : songFields.entry;
		const custom = title.startsWith("CUSTOM_");
		const difficultyName = entryAndDifficulty in songDatabase ? songDatabase[entryAndDifficulty].difficulty : songFields.difficulty;
		const resultGrade = getGrade(score.accuracy, score.isNoMiss, score.cleared);
		const rating = getSongRating(score.accuracy, score.level, score.isNoMiss, score.cleared);
		const averagedRating = rating / RATING_TOP_CUT;

		return {
			...score,
			...songFields,
			title,
			custom,
			difficultyName,
			resultGrade,
			rating,
			averagedRating
		};
	});
}
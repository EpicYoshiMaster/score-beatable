import { HighScore, HighScoreEntry } from "@/types";

// They're formatted as Internal Song Name/Difficulty\Modifier
const splitSongField = (song: string) => {
	const firstSplit = song.split('/');

	if(firstSplit.length === 2) {
		const entry = firstSplit[0];

		const secondSplit = firstSplit[1].split('\\');

		if(secondSplit.length === 2) {
			const difficulty = secondSplit[0];
			const modifier = secondSplit[1];

			return {
				entry,
				difficulty,
				modifier
			};
		}

		return {
			entry,
			difficulty: 'Unknown',
			modifier: 'Unknown'
		}
	}

	return {
		entry: 'Unknown',
		difficulty: 'Unknown',
		modifier: 'Unknown',
	}
}

export const processScores = (highScoresData: HighScoreEntry[]): HighScore[] => {
	return highScoresData.map((score) => {

		const songFields = splitSongField(score.song);

		return {
			...score,
			...songFields,
			title: songFields.entry //Fix this later
		};
	});
}
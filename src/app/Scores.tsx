import { HighScoreResult, Modifier } from "@/types";
import { getCombinedHighScore, getCompletionRating, getTotalSongRating, shouldCountResult } from "@/utils/ratings";
import { useCallback, useMemo, useState } from "react";
import styles from "./scores.module.scss";
import { formatAccuracy, formatModifier, formatRating, formatResultRating, formatTitle } from "@/utils/format";
import Result from "@/components/Result";

interface ScoresProps {
	scores: HighScoreResult[];
}

// Filter by:
// Modifiers, [Uncleared, Cleared, Full Cleared, PFC], [Base Game, DLC, Custom]

// Sort by:
// Accuracy, Score, Rating, Level, Artist, Charter, Song Title

const TOGGLEABLE_MODIFIERS: Modifier[] = ['Classic', 'HalfTime', 'DoubleTime'];

const Scores: React.FC<ScoresProps> = ({ scores }) => {
	const [shownModifiers, setShownModifiers] = useState<Modifier[]>(['Classic', 'HalfTime', 'DoubleTime']);

	const relevantScores = useMemo(() => {
		return scores.filter((score) => {
			return shownModifiers.includes(score.modifier);
		})
	}, [scores, shownModifiers]);

	const combinedHighScore = useMemo(() => {
		return getCombinedHighScore(relevantScores);
	}, [relevantScores]);

	const completionRating = useMemo(() => {
		return getCompletionRating(scores);
	}, [scores]);

	const songRating = useMemo(() => {
		return getTotalSongRating(scores);
	}, [scores]);

	const playerRating = useMemo(() => {
		return completionRating + songRating;
	}, [completionRating, songRating]);

	const toggleShowModifier = useCallback((modifier: Modifier) => {
		if(shownModifiers.includes(modifier)) {
			setShownModifiers((modifiers) => modifiers.filter((mod) => mod !== modifier));
		}
		else {
			setShownModifiers((modifiers) => [...modifiers, modifier]);
		}
	}, [shownModifiers]);

	return (
		<>
			<div className={styles.highScore}>
				{`Total High Score: ${combinedHighScore}`}
			</div>
			<div className={styles.rating}>
				{formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
			</div>
			<div>
				{TOGGLEABLE_MODIFIERS.map((modifier, index) => (
					<div key={index}>
						<label htmlFor={modifier}>{formatModifier(modifier)}</label>
						<input 
							type="checkbox" 
							name={modifier} 
							checked={shownModifiers.includes(modifier)} 
							onChange={() => toggleShowModifier(modifier)}
						/>
					</div>
				))}
			</div>
			<div className={styles.grid}>
				{relevantScores.map((score, index) => {
					return (
						<Result result={score} key={index} ratingDisplay="Proper" detailed />
					)
				})}
			</div>
		</>
	);
}

export default Scores;
import { ClearState, HighScoreResult, Modifier, SongType } from "@/types";
import { getCombinedHighScore, getCompletionRating, getTotalSongRating } from "@/utils/ratings";
import { useMemo } from "react";
import styles from "./scores.module.scss";
import {formatRating } from "@/utils/format";
import Result from "@/components/Result";
import useListState from "@/hooks/useListState";
import { toHeaderCase } from "js-convert-case";

interface ScoresProps {
	scores: HighScoreResult[];
}

// Filter by:
// Modifiers, [Uncleared, Cleared, Full Cleared, PFC], [Base Game, DLC, Custom]

// Sort by:
// Accuracy, Score, Rating, Level, Artist, Charter, Song Title

const TOGGLEABLE_MODIFIERS: Modifier[] = ['Classic', 'HalfTime', 'DoubleTime'];
const TOGGLEABLE_CLEAR_STATES: ClearState[] = ['Fail', 'Clear', 'FullCombo', 'PerfectFullCombo'];
const TOGGLEABLE_SONG_TYPES: SongType[] = ['Base', 'DLC', 'Custom'];

const Scores: React.FC<ScoresProps> = ({ scores }) => {
	const [shownModifiers, toggleModifier] = useListState<Modifier>(['Classic', 'HalfTime', 'DoubleTime']);
	const [shownClearStates, toggleClearState] = useListState<ClearState>(['Clear', 'FullCombo', 'PerfectFullCombo']);
	const [shownSongTypes, toggleSongType] = useListState<SongType>(['Base', 'DLC']);

	const relevantScores = useMemo(() => {
		return scores.filter((score) => {
			const matchesModifier = shownModifiers.includes(score.modifier);
			const matchesClearState = shownClearStates.includes(score.clearState);
			const matchesSongType = shownSongTypes.includes(score.songType);

			return matchesModifier && matchesClearState && matchesSongType;
		})
	}, [scores, shownClearStates, shownModifiers, shownSongTypes]);

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

	return (
		<>
			<div className={styles.highScore}>
				{`Total High Score: ${combinedHighScore}`}
			</div>
			<div className={styles.rating}>
				{formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
			</div>
			<div className={styles.filters}>
				<div>
					{TOGGLEABLE_MODIFIERS.map((modifier, index) => (
						<div key={index}>
							<label htmlFor={modifier}>{toHeaderCase(modifier)}</label>
							<input 
								type="checkbox" 
								name={modifier} 
								checked={shownModifiers.includes(modifier)} 
								onChange={() => toggleModifier(modifier)}
							/>
						</div>
					))}
				</div>
				<div>
					{TOGGLEABLE_CLEAR_STATES.map((clearState, index) => (
						<div key={index}>
							<label htmlFor={clearState}>{toHeaderCase(clearState)}</label>
							<input 
								type="checkbox" 
								name={clearState} 
								checked={shownClearStates.includes(clearState)} 
								onChange={() => toggleClearState(clearState)}
							/>
						</div>
					))}
				</div>
				<div>
					{TOGGLEABLE_SONG_TYPES.map((songType, index) => (
						<div key={index}>
							<label htmlFor={songType}>{songType}</label>
							<input 
								type="checkbox" 
								name={songType} 
								checked={shownSongTypes.includes(songType)} 
								onChange={() => toggleSongType(songType)}
							/>
						</div>
					))}
				</div>
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
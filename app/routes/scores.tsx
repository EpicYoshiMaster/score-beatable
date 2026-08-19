import type { ClearState, Difficulty, Grade, Modifier, SongType } from "~/types";
import { getCombinedHighScore, getCompletionRating, getTotalSongRating, getUnplayedArcadeCharts } from "../utils/ratings";
import { useMemo, useState } from "react";
import {formatDifficulty, formatRating } from "../utils/format";
import Result from "../components/Result";
import useListState from "../hooks/useListState";
import { toHeaderCase } from "js-convert-case";
import { SORT_METHODS } from "../utils/sort";
import { useLayoutContext } from "~/hooks/useLayoutContext";
import { Select } from "~/components/common";

const TOGGLEABLE_MODIFIERS: Modifier[] = ['Classic', 'HalfTime', 'DoubleTime'];
const TOGGLEABLE_DIFFICULTIES: Difficulty[] = ['Beginner', 'Easy', 'Normal', 'Hard', 'UNBEATABLE', 'Star'];
const TOGGLEABLE_GRADES: Grade[] = ['HOW?', 'F', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++'];
const TOGGLEABLE_CLEAR_STATES: ClearState[] = ['Unplayed', 'Fail', 'Clear', 'FullCombo', 'PerfectFullCombo'];
const TOGGLEABLE_SONG_TYPES: SongType[] = ['Base', 'DLC', 'Custom'];

const Scores: React.FC = () => {
	const { scores, ratingDisplay } = useLayoutContext();

	const [shownModifiers, toggleModifier] = useListState<Modifier>(['Classic']);
	const [shownDifficulties, toggleDifficulty] = useListState<Difficulty>(['Beginner', 'Easy', 'Normal', 'Hard', 'UNBEATABLE', 'Star']);
	const [shownGrades, toggleGrade] = useListState<Grade>(['HOW?', 'F', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++']);
	const [shownClearStates, toggleClearState] = useListState<ClearState>(['Clear', 'FullCombo', 'PerfectFullCombo']);
	const [shownSongTypes, toggleSongType] = useListState<SongType>(['Base', 'DLC']);

	const [primarySort, setPrimarySort] = useState<number>(0); // Rating
	const [secondarySort, setSecondarySort] = useState<number>(2); // Level
	const [reversePrimary, setReversePrimary] = useState(false);
	const [reverseSecondary, setReverseSecondary] = useState(false);

	const unplayed = useMemo(() => {
		return getUnplayedArcadeCharts(scores);
	}, [scores]);

	const relevantScores = useMemo(() => {
		return scores.concat(unplayed).filter((score) => {
			const matchesModifier = shownModifiers.includes(score.modifier);
			const matchesDifficulty = shownDifficulties.includes(score.difficulty);
			const matchesGrade = shownGrades.includes(score.resultGrade.grade);
			const matchesClearState = shownClearStates.includes(score.clearState);
			const matchesSongType = shownSongTypes.includes(score.songType);

			return matchesModifier && matchesDifficulty && matchesGrade && matchesClearState && matchesSongType;
		}).sort((scoreA, scoreB) => {
			const primarySortResult = SORT_METHODS[primarySort].function(scoreA, scoreB);

			if(primarySortResult === 0) {
				const secondarySortResult = SORT_METHODS[secondarySort].function(scoreA, scoreB);

				return reverseSecondary ? secondarySortResult * -1 : secondarySortResult;
			}

			return reversePrimary ? primarySortResult * -1 : primarySortResult;
		})
	}, [primarySort, reversePrimary, reverseSecondary, scores, secondarySort, shownClearStates, shownDifficulties, shownGrades, shownModifiers, shownSongTypes, unplayed]);

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
		<div className="scores">
			<div className="scores__highScore">
				{`Total High Score: ${combinedHighScore}`}
			</div>
			<div className="common__rating">
				{formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
			</div>
			<div className="scores__filters">
				<div>
					{TOGGLEABLE_MODIFIERS.map((modifier) => (
						<div key={modifier}>
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
					{TOGGLEABLE_DIFFICULTIES.map((difficulty) => (
						<div key={difficulty}>
							<label htmlFor={difficulty}>{formatDifficulty(difficulty)}</label>
							<input 
								type="checkbox" 
								name={difficulty} 
								checked={shownDifficulties.includes(difficulty)} 
								onChange={() => toggleDifficulty(difficulty)}
							/>
						</div>
					))}
				</div>
				<div>
					{TOGGLEABLE_GRADES.map((grade) => (
						<div key={grade}>
							<label htmlFor={grade}>{grade}</label>
							<input 
								type="checkbox" 
								name={grade} 
								checked={shownGrades.includes(grade)} 
								onChange={() => toggleGrade(grade)}
							/>
						</div>
					))}
				</div>
				<div>
					{TOGGLEABLE_CLEAR_STATES.map((clearState) => (
						<div key={clearState}>
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
					{TOGGLEABLE_SONG_TYPES.map((songType) => (
						<div key={songType}>
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
			<div className="scores__sorts">
				<label htmlFor="primary-sort">Primary Sort</label>
				<Select name="primary-sort" value={primarySort} onChange={(event) => setPrimarySort(Number(event.target.value))}>
					{SORT_METHODS.map((method, index) => (
						<option key={method.name} value={index}>{method.name}</option>
					))}
				</Select>
				<label htmlFor="reverse-primary">Reverse</label>
				<input type="checkbox" checked={reversePrimary} onChange={() => setReversePrimary(!reversePrimary)} />
				|
				<label htmlFor="secondary-sort">Secondary Sort</label>
				<Select name="secondary-sort" value={secondarySort} onChange={(event) => setSecondarySort(Number(event.target.value))}>
					{SORT_METHODS.map((method, index) => (
						<option key={method.name} value={index}>{method.name}</option>
					))}
				</Select>
				<label htmlFor="reverse-secondary">Reverse</label>
				<input type="checkbox" checked={reverseSecondary} onChange={() => setReverseSecondary(!reverseSecondary)} />
			</div>
			<div className="scores__grid">
				{relevantScores.map((score) => {
					return (
						<Result result={score} key={score.song} ratingDisplay={ratingDisplay} detailed />
					)
				})}
			</div>
		</div>
	);
}

export default Scores;
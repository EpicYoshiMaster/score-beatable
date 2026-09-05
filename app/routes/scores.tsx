import type { ClearState, Difficulty, Grade, Modifier, SongType } from "~/types";
import { getCombinedHighScore, getCompletionRating, getTotalSongRating, getUnplayedArcadeCharts } from "../utils/ratings";
import { useMemo, useState } from "react";
import Result from "../components/Result";
import useListState from "../hooks/useListState";
import { toHeaderCase } from "js-convert-case";
import { SORT_METHODS } from "../utils/sort";
import { useLayoutContext } from "~/hooks/useLayoutContext";
import { Button, Rating, Select } from "~/components/common";
import { Filter } from "~/components/Filter";

const TOGGLEABLE_MODIFIERS: Modifier[] = ['None', 'HalfTime', 'DoubleTime', 'Not-Critical', 'Critical'];
const TOGGLEABLE_DIFFICULTIES: Difficulty[] = ['Beginner', 'Easy', 'Normal', 'Hard', 'UNBEATABLE', 'Star'];
const TOGGLEABLE_GRADES: Grade[] = ['HOW?', 'F', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++'];
const TOGGLEABLE_CLEAR_STATES: ClearState[] = ['Unplayed', 'Fail', 'Clear', 'FullCombo', 'PerfectFullCombo'];
const TOGGLEABLE_SONG_TYPES: SongType[] = ['Base', 'DLC', 'Custom'];

const Scores: React.FC = () => {
	const { scores, ratingDisplay } = useLayoutContext();

	const [shownModifiers, toggleModifier] = useListState<Modifier>(['None', 'Not-Critical', 'Critical']);
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
			const matchesModifier = score.modifierList.every((modifier) => shownModifiers.includes(modifier));
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
			<div className="common__rating common__rating-total">
				<Rating value={completionRating} /> + <Rating value={songRating} /> = <Rating value={playerRating} />
			</div>
			<div className="scores__filters">
				<Filter options={TOGGLEABLE_SONG_TYPES} title="Song Type Filter" selected={shownSongTypes} toggleItem={toggleSongType}  />
				<Filter options={TOGGLEABLE_MODIFIERS} title="Modifier Filter" selected={shownModifiers} toggleItem={toggleModifier}  />
				<Filter options={TOGGLEABLE_DIFFICULTIES} title="Difficulty Filter" selected={shownDifficulties} toggleItem={toggleDifficulty}  />
				<Filter options={TOGGLEABLE_GRADES} title="Grade Filter" selected={shownGrades} toggleItem={toggleGrade}  />
				<Filter options={TOGGLEABLE_CLEAR_STATES} title="Clear State Filter" selected={shownClearStates} toggleItem={toggleClearState} formatOption={toHeaderCase}  />
			</div>
			<div className="scores__sorts">
				<fieldset className="filter">
					<legend className="common__label" aria-label="Primary Sort">[primary_sort]</legend>
					<Select className="filter__item filter__control" name="primary-sort" value={primarySort} onChange={(event) => setPrimarySort(Number(event.target.value))}>
						{SORT_METHODS.map((method, index) => (
							<option key={method.name} value={index}>{method.name}</option>
						))}
					</Select>
					<Button className="filter__item filter__control" selected={reversePrimary} onClick={() => setReversePrimary(!reversePrimary)}>Reverse?</Button>
				</fieldset>
				<fieldset className="filter">
					<legend className="common__label" aria-label="Secondary Sort">[secondary_sort]</legend>
					<Select className="filter__item filter__control" name="secondary-sort" value={secondarySort} onChange={(event) => setSecondarySort(Number(event.target.value))}>
						{SORT_METHODS.map((method, index) => (
							<option key={method.name} value={index}>{method.name}</option>
						))}
					</Select>
					<Button className="filter__item filter__control" selected={reverseSecondary} onClick={() => setReverseSecondary(!reverseSecondary)}>Reverse?</Button>
				</fieldset>
			</div>
			<div className="scores__grid">
				{relevantScores.map((score) => {
					return (
						<Result result={score} key={score.song} ratingDisplay={ratingDisplay} />
					)
				})}
			</div>
		</div>
	);
}

export default Scores;
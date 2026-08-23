import type { HighScoreResult, RatingDisplay } from "~/types";
import { formatAccuracy, formatLevel, formatScore, formatTitle, getDisplayedRating } from "~/utils/format";
import { shouldCountResult } from "~/utils/ratings";
import { toHeaderCase } from "js-convert-case";
import classNames from "classnames";
import { useState } from "react";
import { Rating } from "./common";
import { ReactFitty } from "react-fitty";

interface ResultProps {
	result: HighScoreResult;
	ratingDisplay: RatingDisplay;
	detailed?: boolean; // Detailed includes more information to really dive in
}

const Result: React.FC<ResultProps> = ({ result, ratingDisplay, detailed }) => {
	const [showMore, setShowMore] = useState(false);

	const shouldCount = shouldCountResult(result);
	const modifierText = result.modifier === "Classic" ? '' : `[${toHeaderCase(result.modifier)}]${shouldCount ? '' : '*'}`;
	const title = result.songEntry.title === '' ? result.title : result.songEntry.title;
	const difficultyName = result.songEntry.difficulty === '' ? result.difficulty : result.songEntry.difficulty;

	const ratingClassName = classNames({
		'result__unranked': !shouldCount
	});

	const showMoreClassName = classNames('result__show-more', {
		'result__show-more--collapsed': !showMore
	});

	return (
		<div className="result">
			<button className="result__container" onClick={() => setShowMore(!showMore)}>
				<div className="result__title">
					<span>
						{`${formatTitle(title)}`}
					</span>
					{detailed && (<span className="result__modifier">
						{modifierText}
					</span>)}
				</div>
				{detailed && result.songEntry.artist !== '' && (
					<div className="result__metadata">
						<span className="result__bold">Artist:</span>
						<span>{result.songEntry.artist}</span>
					</div>
				)}
				{detailed && result.songEntry.creator !== '' && (
					<div className="result__metadata">
						<span className="result__bold">Charted By:</span>
						<span>{result.songEntry.creator}</span>
					</div>
				)}
				<div className="result__bottom">
					<div className="result__left">
						<div className="result__difficulty"><ReactFitty minSize={5} maxSize={16}>{difficultyName}</ReactFitty></div>
						<div className="result__level">{formatLevel(result.level)}</div>
					</div>
					<div className="result__right">
						{detailed ? (<div className="result__score">{formatScore(result.score)}</div>) : <span></span>}
						<div className="result__accuracy">{`(${detailed ? `${result.resultGrade.grade} ` : ''}${formatAccuracy(result.accuracy)})`}</div>
						<Rating duration={1.5} className={ratingClassName} value={getDisplayedRating(result, ratingDisplay)} />
					</div>
				</div>
			</button>
			<div className={showMoreClassName}>
				{result.notes.map((note) => (
					<div key={note.timing}>{`${note.timing}: ${note.count}`}</div>
				))}
				<div>{result.isFullCombo ? 'Full Combo' : ''}</div>
				<div>{result.isPerfectFullCombo ? 'Perfect Full Combo' : ''}</div>
			</div>
		</div>
	);
}

export default Result;
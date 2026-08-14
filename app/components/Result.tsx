import type { HighScoreResult, RatingDisplay } from "~/types";
import { formatAccuracy, formatResultRating, formatScore, formatTitle } from "~/utils/format";
import { shouldCountResult } from "~/utils/ratings";
import { toHeaderCase } from "js-convert-case";

interface ResultProps {
	result: HighScoreResult;
	ratingDisplay: RatingDisplay;
	detailed?: boolean; // Detailed includes more information to really dive in
}

const Result: React.FC<ResultProps> = ({ result, ratingDisplay, detailed }) => {
	const shouldCount = shouldCountResult(result);
	const modifierText = result.modifier === "Classic" ? '' : `[${toHeaderCase(result.modifier)}]${shouldCount ? '' : '*'}`;
	const title = result.songEntry.title === '' ? result.title : result.songEntry.title;
	const difficultyName = result.songEntry.difficulty === '' ? result.difficulty : result.songEntry.difficulty;

	return (
		<div className="result">
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
					<div className="result__difficulty">{difficultyName}</div>
					<div className="result__level">{result.level}</div>
				</div>
				<div className="result__right">
					{detailed && (<div className="result__score">{formatScore(result.score)}</div>)}
					<div className="result__accuracy">{`(${detailed ? `${result.resultGrade.grade} ` : ''}${formatAccuracy(result.accuracy)})`}</div>
					<div className={`result__rating ${shouldCount ? '' : 'result__unranked'}`}>{formatResultRating(result, ratingDisplay)}</div>
				</div>
			</div>
		</div>
	);
}

export default Result;
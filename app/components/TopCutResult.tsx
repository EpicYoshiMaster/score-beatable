import type { HighScoreResult, RatingDisplay } from "~/types";
import { formatAccuracy, formatLevel, formatTitle, getDisplayedRating } from "~/utils/format";
import { shouldCountResult } from "~/utils/ratings";
import classNames from "classnames";
import { useState } from "react";
import { Rating } from "./common";
import { ReactFitty } from "react-fitty";

interface TopCutResultProps {
	result: HighScoreResult;
	ratingDisplay: RatingDisplay;
}

const TOP_CUT_MAX_LENGTH = 35;

const TopCutResult: React.FC<TopCutResultProps> = ({ result, ratingDisplay }) => {
	const [showMore, setShowMore] = useState(false);

	const shouldCount = shouldCountResult(result);
	const modifierText = result.modifier === "DoubleTime" ? '1.5x' : result.modifier === 'HalfTime' ? '0.75x' : '';
	const title = result.songEntry.title === '' ? result.title : result.songEntry.title;
	const difficultyName = result.songEntry.difficulty === '' ? result.difficulty : result.songEntry.difficulty;

	const showMoreClassName = classNames('result__show-more', {
		'result__show-more--collapsed': !showMore
	});

	return (
		<div className="result result--top-cut">
			<button className="result__container" onClick={() => setShowMore(!showMore)}>
				<div className="result__title">
					<span>
						{`${formatTitle(title, TOP_CUT_MAX_LENGTH)}`}
					</span>
					<span className="result__modifier">
						{modifierText}
					</span>
				</div>
				<div className="result__bottom">
					<div className="result__left">
						<div className="result__difficulty"><ReactFitty minSize={5} maxSize={16}>{difficultyName}</ReactFitty></div>
						<div className="result__level">{formatLevel(result.level)}</div>
					</div>
					<div className="result__right">
						<div className="result__accuracy">{`(${formatAccuracy(result.accuracy)})`}</div>
						<Rating unranked={!shouldCount} className="result__rating" value={getDisplayedRating(result, ratingDisplay)} />
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

export default TopCutResult;
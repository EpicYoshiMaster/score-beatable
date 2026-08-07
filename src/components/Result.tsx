import { HighScoreResult, RatingDisplay } from "@/types";
import styles from "./result.module.scss";
import { formatAccuracy, formatResultRating, formatScore, formatTitle } from "@/utils/format";
import { shouldCountResult } from "@/utils/ratings";
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
		<div className={styles.container}>
			<div className={styles.title}>
				<span>
					{`${formatTitle(title)}`}
				</span>
				{detailed && (<span className={styles.modifier}>
					{modifierText}
				</span>)}
			</div>
			{detailed && result.songEntry.artist !== '' && (
				<div className={styles.metadata}>
					<span className={styles.bold}>Artist:</span>
					<span>{result.songEntry.artist}</span>
				</div>
			)}
			{detailed && result.songEntry.creator !== '' && (
				<div className={styles.metadata}>
					<span className={styles.bold}>Charted By:</span>
					<span>{result.songEntry.creator}</span>
				</div>
			)}
			<div className={styles.bottom}>
				<div className={styles.left}>
					<div className={styles.difficulty}>{difficultyName}</div>
					<div className={styles.level}>{result.level}</div>
				</div>
				<div className={styles.right}>
					{detailed && (<div className={styles.score}>{formatScore(result.score)}</div>)}
					<div className={styles.accuracy}>{`(${detailed ? `${result.resultGrade.grade} ` : ''}${formatAccuracy(result.accuracy)})`}</div>
					<div className={`${styles.rating} ${shouldCount ? '' : styles.unranked}`}>{formatResultRating(result, ratingDisplay)}</div>
				</div>
			</div>
		</div>
	);
}

export default Result;
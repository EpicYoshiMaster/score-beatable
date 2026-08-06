import { HighScoreResult, RatingDisplay } from "@/types";
import styles from "./result.module.scss";
import { formatAccuracy, formatResultRating, formatTitle } from "@/utils/format";

interface ResultProps {
	result: HighScoreResult;
	ratingDisplay: RatingDisplay;
}

const Result: React.FC<ResultProps> = ({ result, ratingDisplay }) => {
	return (
		<div className={styles.container}>
			<div className={styles.title}>{formatTitle(result.title)}</div>
			<div className={styles.bottom}>
				<div className={styles.left}>
					<div className={styles.difficulty}>{result.difficultyName}</div>
					<div className={styles.level}>{result.level}</div>
				</div>
				<div className={styles.right}>
					<div className={styles.rating}>{formatResultRating(result, ratingDisplay)}</div>
					<div className={styles.accuracy}>{`(${formatAccuracy(result.accuracy)})`}</div>
				</div>
			</div>
		</div>
	);
}

export default Result;
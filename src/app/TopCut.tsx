import { HighScoreResult, RatingDisplay } from "@/types";
import { getCombinedHighScore, getCompletionRating, getTopCut, getTotalSongRating } from "@/utils/ratings";
import { useMemo, useState } from "react";
import styles from "./top-cut.module.scss";
import { formatAccuracy, formatRating, formatResultRating, formatTitle } from "@/utils/format";
import Result from "@/components/Result";

interface TopCutProps {
	scores: HighScoreResult[];
}

const TopCut: React.FC<TopCutProps> = ({ scores }) => {
	const [ratingDisplay, setRatingDisplay] = useState<RatingDisplay>('Proper');

	const combinedHighScore = useMemo(() => {
		return getCombinedHighScore(scores);
	}, [scores]);

	const completionRating = useMemo(() => {
		return getCompletionRating(scores);
	}, [scores]);

	const songRating = useMemo(() => {
		return getTotalSongRating(scores);
	}, [scores]);

	const playerRating = useMemo(() => {
		return completionRating + songRating;
	}, [completionRating, songRating]);

	const topCut = useMemo(() => {
		return getTopCut(scores);
	}, [scores]);

	return (
		<>
			<div>
				<button onClick={() => setRatingDisplay('Averaged')}>Averaged</button>
				<button onClick={() => setRatingDisplay('Total')}>Total</button>
				<button onClick={() => setRatingDisplay('Proper')}>Proper</button>
			</div>
			<div className={styles.rating}>
				{formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
			</div>
			<div className={styles.grid}>
				{topCut.map((score, index) => {
					return (
						<Result key={index} result={score} ratingDisplay={ratingDisplay} />
					)
				})}
			</div>
		</>
	);
}

export default TopCut;
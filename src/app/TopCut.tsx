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
	const [includeDlc, setIncludeDlc] = useState(true);
	const [ratingDisplay, setRatingDisplay] = useState<RatingDisplay>('Proper');

	const completionRating = useMemo(() => {
		return getCompletionRating(scores, includeDlc);
	}, [includeDlc, scores]);

	const songRating = useMemo(() => {
		return getTotalSongRating(scores, includeDlc);
	}, [includeDlc, scores]);

	const playerRating = useMemo(() => {
		return completionRating + songRating;
	}, [completionRating, songRating]);

	const topCut = useMemo(() => {
		return getTopCut(scores, includeDlc);
	}, [includeDlc, scores]);

	return (
		<>
			<div>
				<label htmlFor="includeDlc">Include DLC in Ratings</label>
				<input type="checkbox" checked={includeDlc} onChange={() => setIncludeDlc(!includeDlc)} />
			</div>
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
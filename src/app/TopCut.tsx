import { HighScoreResult, RatingDisplay } from "@/types";
import { getCompletionRating, getTopCut, getTotalSongRating } from "@/utils/ratings";
import { useMemo, useState } from "react";
import styles from "./top-cut.module.scss";
import { formatRating } from "@/utils/format";
import Result from "@/components/Result";

interface TopCutProps {
	scores: HighScoreResult[];
	ratingDisplay: RatingDisplay;
}

const TopCut: React.FC<TopCutProps> = ({ scores, ratingDisplay }) => {
	const [includeDlc, setIncludeDlc] = useState(true);

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
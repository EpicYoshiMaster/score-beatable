import { getCompletionRating, getTopCut, getTotalSongRating } from "~/utils/ratings";
import { useMemo, useState } from "react";
import { useLayoutContext } from "~/hooks/useLayoutContext";
import TopCutResult from "~/components/TopCutResult";
import { Rating } from "~/components/common";

const TopCut: React.FC = () => {
	const { scores, ratingDisplay } = useLayoutContext();

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
		return getTopCut(scores, includeDlc, true);
	}, [includeDlc, scores]);

	return (
		<div className="top-cut">
			<div>
				<label htmlFor="includeDlc">Include DLC in Ratings</label>
				<input type="checkbox" checked={includeDlc} onChange={() => setIncludeDlc(!includeDlc)} />
			</div>
			<div className="common__rating common__rating-total">
				<Rating value={completionRating} /> + <Rating value={songRating} /> = <Rating value={playerRating} />
			</div>
			<div className="top-cut__grid">
				{topCut.map((score, index) => {
					return (
						<TopCutResult key={index} result={score} ratingDisplay={ratingDisplay} />
					)
				})}
			</div>
		</div>
	);
}

export default TopCut;
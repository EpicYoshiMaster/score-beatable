import { getCompletionRating, getTopCut, getTotalSongRating } from "~/utils/ratings";
import { useMemo, useState } from "react";
import { formatRating } from "~/utils/format";
import Result from "~/components/Result";
import { useLayoutContext } from "~/hooks/useLayoutContext";

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
		return getTopCut(scores, includeDlc);
	}, [includeDlc, scores]);

	return (
		<div className="top-cut">
			<div>
				<label htmlFor="includeDlc">Include DLC in Ratings</label>
				<input type="checkbox" checked={includeDlc} onChange={() => setIncludeDlc(!includeDlc)} />
			</div>
			<div className="common__rating">
				{formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
			</div>
			<div className="top-cut__grid">
				{topCut.map((score, index) => {
					return (
						<Result key={index} result={score} ratingDisplay={ratingDisplay} />
					)
				})}
			</div>
		</div>
	);
}

export default TopCut;
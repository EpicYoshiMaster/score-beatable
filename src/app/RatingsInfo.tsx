import { AccuracyRange, HighScoreResult } from "@/types";
import { buildRatingTable, getCombinedHighScore, getCompletionRating, getTotalSongRating, MAX_COMPLETION_RATING } from "@/utils/ratings";
import { useMemo, useState } from "react";
import styles from "./ratings-info.module.scss";
import { formatRating } from "@/utils/format";

interface RatingsInfoProps {
	scores: HighScoreResult[];
}

const RatingsInfo: React.FC<RatingsInfoProps> = ({ scores }) => {
	const [ratingThreshold, setRatingThreshold] = useState(10.0);
	const [noMiss, setNoMiss] = useState(true);
	const [accuracyRange, setAccuracyRange] = useState<AccuracyRange>('General');

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

	const { headerRow, levelRows } = useMemo(() => {
		return buildRatingTable(accuracyRange, noMiss);
	}, [accuracyRange, noMiss]);

	return (
		<>
			<input
				id="threshold"
				type="number"
				step="0.1"
				min="0"
				max="14"
				value={ratingThreshold}
				onChange={(event) => setRatingThreshold(Number(event.target.value))}
			/>
			<div>
				<span>No Miss</span>
				<input type="checkbox" checked={noMiss} onChange={() => setNoMiss(!noMiss)} />
			</div>
			<select className={`${styles.control} ${styles.select}`} value={accuracyRange} onChange={(event) => { setAccuracyRange(event.target.value as AccuracyRange); }}>
				<option value="General">General</option>
				<option value="Middle">Middle</option>
				<option value="Upper">Upper</option>
				<option value="Top">Top</option>
      </select>
			<table className={styles.table}>
				<thead>
					<tr>
						{headerRow.columns.map((value, index) => (
							<th className={styles.header} scope="col" key={index}>{value}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{levelRows.map((row, rowIndex) => {
						return (
							<tr key={rowIndex}>
								<th className={styles.header} scope="row">{row.header}</th>
								{row.columns.map((rating, columnIndex) => {

									const formattedRating = formatRating(MAX_COMPLETION_RATING + rating);

									return (<td className={`${styles.data} ${MAX_COMPLETION_RATING + rating >= ratingThreshold ? styles.highlight : ''}`} key={columnIndex}>{formattedRating}</td>);
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	);
}

export default RatingsInfo;
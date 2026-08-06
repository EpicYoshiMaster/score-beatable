import { HighScoreResult } from "@/types";
import { buildRatingTable, getCombinedHighScore, getCompletionRating, getTotalSongRating } from "@/utils/ratings";
import { useMemo } from "react";
import styles from "./ratings-info.module.scss";

interface RatingsInfoProps {
	scores: HighScoreResult[];
}

const RatingsInfo: React.FC<RatingsInfoProps> = ({ scores }) => {

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
		return buildRatingTable('General', true);
	}, []);

	return (
		<>
			<div>RATING INFO</div>
			<table className={styles.table}>
				<thead>
					<tr>
						{headerRow.columns.map((value, index) => (
							<th className={styles['table__header']} scope="col" key={index}>{value}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{levelRows.map((row, rowIndex) => {
						return (
							<tr key={rowIndex}>
								<th className={styles['table__header']} scope="row">{row.header}</th>
								{row.columns.map((rating, columnIndex) => (
									<td className={styles['table__data']} key={columnIndex}>{rating}</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	);
}

export default RatingsInfo;
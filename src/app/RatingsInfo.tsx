import { AccuracyRange, DisplayThreshold, RatingDisplay } from "@/types";
import { buildRatingTable } from "@/utils/ratings";
import { useMemo, useState } from "react";
import styles from "./ratings-info.module.scss";
import { formatResultRating, getDisplayedRating } from "@/utils/format";

interface RatingsInfoProps {
	ratingDisplay: RatingDisplay;
}

const DISPLAY_THRESHOLDS: DisplayThreshold[] = [
	{ ratingDisplay: 'Averaged', default: 0.3, min: 0, max: 0.5, step: 0.01 },
	{ ratingDisplay: 'Total', default: 8.0, min: 0, max: 12, step: 0.1 },
	{ ratingDisplay: 'Proper', default: 10.0, min: 0, max: 14, step: 0.1 },
];

const RatingsInfo: React.FC<RatingsInfoProps> = ({ ratingDisplay }) => {
	const [ratingThreshold, setRatingThreshold] = useState(10.0);
	const [noMiss, setNoMiss] = useState(true);
	const [accuracyRange, setAccuracyRange] = useState<AccuracyRange>('General');
	const [prevRatingDisplay, setPrevRatingDisplay] = useState('');

	const displayThreshold = useMemo(() => {
		return DISPLAY_THRESHOLDS.find((threshold) => threshold.ratingDisplay === ratingDisplay);
	}, [ratingDisplay])

	if(ratingDisplay !== prevRatingDisplay) {
		if(displayThreshold) {
			setRatingThreshold(displayThreshold.default);
		}

		setPrevRatingDisplay(ratingDisplay);
	}

	const { headerRow, levelRows } = useMemo(() => {
		return buildRatingTable(accuracyRange, noMiss);
	}, [accuracyRange, noMiss]);

	return (
		<>
			<p>Explain how Max Completion works</p>
			<input
				id="threshold"
				type="number"
				step={displayThreshold?.step}
				min={displayThreshold?.min}
				max={displayThreshold?.max}
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
								{row.columns.map((ratingSet, columnIndex) => {
									const displayedRating = getDisplayedRating(ratingSet, ratingDisplay);
									const formattedRating = formatResultRating(ratingSet, ratingDisplay);

									return (<td className={`${styles.data} ${displayedRating >= ratingThreshold ? styles.highlight : ''}`} key={columnIndex}>{formattedRating}</td>);
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			<p>Explain how Rating works</p>
		</>
	);
}

export default RatingsInfo;
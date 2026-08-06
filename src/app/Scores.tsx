import { HighScoreResult } from "@/types";
import { getCombinedHighScore, getCompletionRating, getTotalSongRating } from "@/utils/ratings";
import { useMemo } from "react";
import styles from "./scores.module.scss";
import { formatAccuracy, formatRating, formatResultRating, formatTitle } from "@/utils/format";

interface ScoresProps {
	scores: HighScoreResult[];
}

const Scores: React.FC<ScoresProps> = ({ scores }) => {
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

	return (
		<>
			<div>
        {combinedHighScore}
      </div>
      <div className={styles.rating}>
        {formatRating(completionRating)} + {formatRating(songRating)} = {formatRating(playerRating)}
      </div>
      {scores.map((score, index) => {
        return (
          <div className={styles.score} key={index}>
            <span>{score.level}: {formatTitle(score.title)} - {score.difficultyName} ({score.modifier})</span>
            <span>{score.resultGrade.grade}</span>
            <span>{score.score}</span>
            <span>{formatAccuracy(score.accuracy)}</span>
            <span>{formatResultRating(score, 'Averaged')}</span>
          </div>
        )
      })}
		</>
	);
}

export default Scores;
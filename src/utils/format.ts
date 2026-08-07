import { Difficulty, HighScoreResult, RatingDisplay } from "@/types";
import { MAX_COMPLETION_RATING } from "./ratings";

const MAX_LENGTH = 60;
const SCORE_LEADING_PLACES = 6;

export const formatTitle = (title: string) => {
	if(title.length <= MAX_LENGTH) return title;

	return `${title.substring(0, MAX_LENGTH)}...`;
}

export const formatAccuracy = (accuracy: number): string => {
	return `${(accuracy * 100).toPrecision(3)}%`;
}

export const formatResultRating = (result: HighScoreResult, ratingDisplay: RatingDisplay) => {
	const rating = ratingDisplay === 'Averaged' ? result.averagedRating : (ratingDisplay === 'Proper' ? MAX_COMPLETION_RATING + result.rating : result.rating);

	return `${formatRating(rating)}`
}

export const formatDifficulty = (difficulty: Difficulty): string => {
	switch(difficulty) {
		case 'Beginner': return 'Beginner';
		case 'Easy': return 'Normal';
		case 'Normal': return 'Hard';
		case 'Hard': return 'Expert';
		case 'UNBEATABLE': return 'UNBEATABLE';
		case 'Star': return 'Star';
		default: return difficulty;
	}
}

export const formatScore = (score: number): string => {
	const leadingThresholds = [...Array(SCORE_LEADING_PLACES).keys()].map((index) => Math.pow(10, index + 1)) // 10, 100, 1000, ...

	return leadingThresholds.reduce((formattedScore, threshold) => {
		return score < threshold ? `0${formattedScore}` : formattedScore;
	}, `${score}`);
}

export const formatRating = (rating: number): string => {
	return `${rating < 100 ? '0' : ''}${rating < 10 ? '0' : ''}${rating.toFixed(3)}`;
}
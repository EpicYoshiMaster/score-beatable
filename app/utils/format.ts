import type { Difficulty, RatingDisplay, SongSpeed } from "~/types";
import { MAX_COMPLETION_RATING } from "./ratings";

const MAX_LENGTH = 60;
const SCORE_LEADING_PLACES = 6;

export const formatTitle = (title: string, maxLength = MAX_LENGTH) => {
	if(title.length <= maxLength) return title;

	return `${title.substring(0, maxLength)}...`;
}

export const formatAccuracy = (accuracy: number): string => {
	return `${(accuracy * 100).toPrecision(3)}%`;
}

export const getDisplayedRating = ({ averagedRating, rating }: { averagedRating: number, rating: number }, ratingDisplay: RatingDisplay) => {
	const finalRating = ratingDisplay === 'Averaged' ? averagedRating : (ratingDisplay === 'Proper' ? MAX_COMPLETION_RATING + rating : rating);

	return finalRating;
}

export const formatResultRating = ({ averagedRating, rating }: { averagedRating: number, rating: number }, ratingDisplay: RatingDisplay) => {
	return `${formatRating(getDisplayedRating({ averagedRating, rating }, ratingDisplay))}`
}

export const formatSongSpeed = (songSpeed: SongSpeed): string => {
	switch(songSpeed) {
		case 'Classic': return '';
		case 'HalfTime': return '[Half Time]';
		case 'DoubleTime': return '[Double Time]';
		default: return `[${songSpeed}]`;
	}
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

export const formatLevel = (level: number): string => {
	return `${level < 10 ? '0' : ''}${level}`;
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
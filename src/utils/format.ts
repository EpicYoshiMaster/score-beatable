import { HighScoreResult, RatingDisplay } from "@/types";
import { MAX_COMPLETION_RATING, shouldCountResult } from "./ratings";

const MAX_LENGTH = 40;

export const formatTitle = (title: string) => {
	if(title.length <= MAX_LENGTH) return title;

	return `${title.substring(0, MAX_LENGTH)}...`;
}

export const formatAccuracy = (accuracy: number): string => {
	return `${(accuracy * 100).toPrecision(3)}%`;
}

export const formatResultRating = (result: HighScoreResult, ratingDisplay: RatingDisplay) => {
	const shouldCount = shouldCountResult(result);

	const rating = ratingDisplay === 'Averaged' ? result.averagedRating : (ratingDisplay === 'Proper' ? MAX_COMPLETION_RATING + result.rating : result.rating);

	return `${formatRating(rating)}${shouldCount ? '' : '*'}`
}

export const formatRating = (rating: number): string => {
	return `${rating < 100 ? '0' : ''}${rating < 10 ? '0' : ''}${rating.toFixed(3)}`;
}
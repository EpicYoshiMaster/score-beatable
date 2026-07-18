import { HighScoreResult } from "@/types";
import { shouldCountResult } from "./ratings";

const MAX_LENGTH = 40;

export const formatTitle = (title: string) => {
	if(title.length <= MAX_LENGTH) return title;

	return `${title.substring(0, MAX_LENGTH)}...`;
}

export const formatAccuracy = (accuracy: number): string => {
	return `${(accuracy * 100).toPrecision(3)}%`;
}

export const formatResultRating = (result: HighScoreResult, averagedRating: boolean) => {
	const shouldCount = shouldCountResult(result);

	return `${formatRating(averagedRating ? result.averagedRating : result.rating)}${shouldCount ? '' : '*'}`
}

export const formatRating = (rating: number): string => {
	return rating.toFixed(3);
}
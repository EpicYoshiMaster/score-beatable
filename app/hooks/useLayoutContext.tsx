import { useOutletContext } from "react-router";
import type { HighScoreResult, RatingDisplay } from "~/types";

export type LayoutContextType = {
	scores: HighScoreResult[];
	ratingDisplay: RatingDisplay;
}

export function useLayoutContext() {
  return useOutletContext<LayoutContextType>();
}
import songs from "~/data/songs.json";
import type { SongEntry } from "~/types";

export const PALETTES = [
  { title: "default", primary: "#FF257D", background: "#F9F7D5", detail: "#E0DEBF", secondary: "#B4B399", highlight: "#000000", rating: "#FF257D" },
  { title: "Beat", primary: "#FF97B0", background: "#FFFFFF", detail: "#FFCBD5", secondary: "#FF6483", highlight: "#FFAF00", rating: "#FFAF00" },
  { title: "Quaver", primary: "#70DAFF", background: "#318CD0", detail: "#EFEFEF", secondary: "#FF97B0", highlight: "#4FDAB5", rating: "#4FDAB5" },
  { title: "Clef", primary: "#7552BF", background: "#F9D33B", detail: "#EDEDED", secondary: "#646D7C", highlight: "#FF4B75", rating: "#FF4B75" },
  { title: "Penny", primary: "#B29595", background: "#2F2F2F", detail: "#FEDD00", secondary: "#D87342", highlight: "#E2E6E8", rating: "#E2E6E8" },
  { title: "Trans Rights", primary: "#F7889D", background: "#F7F7F7", detail: "#35B4E4", secondary: "#EA7D92", highlight: "#3C3C3C", rating: "#3C3C3C" },
  { title: "EpicYoshiMaster", primary: "#6A47B6", background: "#f2daf4", detail: "#D996E3", secondary: "#1960ac", highlight: "#c92e7e", rating: "#c92e7e" },
];

export const getRandomSong = () => {
	const songTitles = Object.values(songs).map((entry: SongEntry) => entry.title);

	const uniqueTitles = [...new Set(songTitles)];

	const randomIndex = Math.floor(Math.random() * uniqueTitles.length);

	return uniqueTitles[randomIndex];
}
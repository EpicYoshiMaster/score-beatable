'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import { useDropzone } from 'react-dropzone';
import { useMemo, useState } from "react";

// How is rating calculated?
// have scores in an easy grid format to take a screenshot
// probably fixed max width content display up to 3 column grid, mobile just do one column (..idk how you would have the files though??)

// pull whatever we can out of this file
// arcade-highscores.json
// song name, difficulty, classic v half time v double time
// score
// accuracy
// max combo
// individual note judgement rating counts
// chart level
// cleared or not
// update count
// grade?
// no miss, full combo, perfect full combo?

// need to map to proper song name

// would be nice to visualize how ratings work?

// obv want to optimize display for top 25 since thats whats used a lot in-game

// show the rating big at the top

// do we worry about album art? means more work to update.....

const PALETTES = [
  { title: "default", primary: "#FF257D", background: "#F9F7D5", detail: "#E0DEBF", secondary: "#B4B399", highlight: "#000000" },
  { title: "Beat", primary: "#FF97B0", background: "#FFFFFF", detail: "#FFCBD5", secondary: "#FF6483", highlight: "#FFAF00" },
  { title: "Quaver", primary: "#70DAFF", background: "#318CD0", detail: "#EFEFEF", secondary: "#FF97B0", highlight: "#4FDAB5" },
  { title: "Clef", primary: "#7552BF", background: "#F9D33B", detail: "#EDEDED", secondary: "#646D7C", highlight: "#FF4B75" },
  { title: "Penny", primary: "#B29595", background: "#2F2F2F", detail: "#FEDD00", secondary: "#D87342", highlight: "#E2E6E8" },
  { title: "Trans Rights", primary: "#F7889D", background: "#F7F7F7", detail: "#35B4E4", secondary: "#EA7D92", highlight: "#3C3C3C" },
  //{ title: "EpicYoshiMaster", primary: "", background: "", detail: "", secondary: "", highlight: "" },
];

// for parsing
type HighscoreEntry = {
  song: string; // SONG NAME/SONG DIFFICULTY\SONG MODIFIER
  score: number;
  accuracy: number;
  maxCombo: number;
  notes: {
    timing: string;
    count: number;
  }[];
  modifierMask: number;
  level: number;
  cleared: boolean;
  updateCount: number;
  grade: number | null;
  isNoMiss: boolean;
  isFullCombo: boolean;
  isPerfectFullCombo: boolean;
}

// for actual processed data
type Highscore = {
  entry: string; // Internal name
  title: string; // Proper name
  difficulty: string; // Beginner, Hard, Expert, UNBEATABLE, Star
  modifier: string; // Classic DoubleTime HalfTime
  cover: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  notes: {
    timing: string;
    count: number;
  }[];
  modifierMask: number;
  level: number;
  cleared: boolean;
  updateCount: number;
  grade: number | null; // what is this?
  isNoMiss: boolean;
  isFullCombo: boolean;
  isPerfectFullCombo: boolean;
}

// windows high scores path: [USER]/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      console.log(acceptedFiles);
    }
  });

  const paletteVariables: React.CSSProperties = useMemo(() => {
    const palette = PALETTES[paletteIndex];

    if(!palette) return {};

    return {
      '--primary': PALETTES[paletteIndex].primary,
      '--background': PALETTES[paletteIndex].background,
      '--detail': PALETTES[paletteIndex].detail,
      '--secondary': PALETTES[paletteIndex].secondary,
      '--highlight': PALETTES[paletteIndex].highlight,
    } as React.CSSProperties;
  }, [paletteIndex]);

  return (
    <div className={styles.page} style={paletteVariables}>
      <header>
        
      </header>
      <main className={styles.main}>
        <select value={paletteIndex} onChange={(event) => { setPaletteIndex(Number(event.target.value)); }}>
          {PALETTES.map((palette, index) => (
            <option key={index} value={`${index}`}>{palette.title}</option>
          ))}
        </select>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>arcade-highscores.json</p>
        </div>
      </main>
    </div>
  );
}

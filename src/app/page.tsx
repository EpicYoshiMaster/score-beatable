'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import { useDropzone } from 'react-dropzone';
import { useCallback, useMemo, useState } from "react";
import { processScores } from "@/utils/process";
//import { useLocalStorage } from "@/utils/hooks";
import { HighScoreResult } from "@/types";
import { sortResultsByAccuracy, sortResultsByTitle } from "@/utils/sort";
import { getCompletionRating } from "@/utils/ratings";

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

// would be nice to visualize how ratings work?

// obv want to optimize display for top 25 since thats whats used a lot in-game

// show the rating big at the top

// linux high scores path: /home/[user]/.local/share/Steam/steamapps/compatdata/2240620/pfx/drive_c/users/steamuser/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json
// windows high scores path: [user]/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json

const PALETTES = [
  { title: "default", primary: "#FF257D", background: "#F9F7D5", detail: "#E0DEBF", secondary: "#B4B399", highlight: "#000000" },
  { title: "Beat", primary: "#FF97B0", background: "#FFFFFF", detail: "#FFCBD5", secondary: "#FF6483", highlight: "#FFAF00" },
  { title: "Quaver", primary: "#70DAFF", background: "#318CD0", detail: "#EFEFEF", secondary: "#FF97B0", highlight: "#4FDAB5" },
  { title: "Clef", primary: "#7552BF", background: "#F9D33B", detail: "#EDEDED", secondary: "#646D7C", highlight: "#FF4B75" },
  { title: "Penny", primary: "#B29595", background: "#2F2F2F", detail: "#FEDD00", secondary: "#D87342", highlight: "#E2E6E8" },
  { title: "Trans Rights", primary: "#F7889D", background: "#F7F7F7", detail: "#35B4E4", secondary: "#EA7D92", highlight: "#3C3C3C" },
  //{ title: "EpicYoshiMaster", primary: "", background: "", detail: "", secondary: "", highlight: "" },
];

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);//useLocalStorage<number>("paletteIndex", 0);
  const [importError, setImportError] = useState<string | null>(null);
  const [scores, setScores] = useState<HighScoreResult[]>([]);

  const handleImport = useCallback(async (acceptedFiles: File[]) => {
    if(acceptedFiles.length > 1)
		{
			setImportError("Only one file can be imported at a time.");
			return;
		}

		if(acceptedFiles.length == 0)
		{
			setImportError("An unknown issue occurred while trying to load the file.");
			return;
		}

		const [ file ] = acceptedFiles;

		if(!file.name.endsWith('.json'))
		{
			setImportError("Files must end in .json");
			return;
		}

    try {
      const importedFile = await file.text();
      const importedJSON = JSON.parse(importedFile);

      if(importedJSON.highScores) {
          const processedScores = processScores(importedJSON.highScores);

          setScores(processedScores.sort((a, b) => sortResultsByAccuracy(a,b)));

          setImportError(null);
        }
        else {
          setImportError("The file provided failed to be matched as an UNBEATABLE high scores file.");
        }
    }
    catch (error) {
      setImportError(`The scores file could not be read: ${error}.`);
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleImport, 
    accept: { 'application/json': ['.json'] }, 
    noClick: true, 
    noDrag: true, 
    noKeyboard: true, 
    multiple: false 
  });

  const completionRating = useMemo(() => {
    return getCompletionRating(scores);
  }, [scores]);

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
      <div className={styles['page__content']}>
        <header >
          <h1>SCOREBEATABLE</h1>
        </header>
        <main className={styles.main}>
          <select className={`${styles.control} ${styles.select}`} value={paletteIndex} onChange={(event) => { setPaletteIndex(Number(event.target.value)); }}>
            {PALETTES.map((palette, index) => (
              <option key={index} value={`${index}`}>{palette.title}</option>
            ))}
          </select>

          {importError && (
            <div className={styles.alert}>{importError}</div>
          )}
          
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button className={`${styles.control} ${styles.button}`} onClick={open}>{'// Select your Arcade Scores file'}</button>
          </div>
          <div>
            {completionRating}
          </div>

          {scores.map((score, index) => {
            return (
              <div className={styles.score} key={index}>
                <span>{score.level}: {score.title} - {score.difficulty} ({score.modifier})</span>
                <span>{score.score}</span>
                <span>{score.accuracy}</span>
                <span>{score.updateCount}</span>
              </div>
            )
          })}
        </main>
      </div>
    </div>
  );
}

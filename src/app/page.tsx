'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import { useDropzone } from 'react-dropzone';
import { useCallback, useMemo, useState } from "react";
import { processScores } from "@/utils/process";
//import { useLocalStorage } from "@/utils/hooks";
import { HighScoreResult } from "@/types";
import { sortResultsByAccuracy, sortResultsByRating, sortResultsByTitle } from "@/utils/sort";
import { buildRatingTable, getCombinedHighScore, getCompletionRating, getTotalSongRating } from "@/utils/ratings";
import { formatAccuracy, formatRating, formatResultRating, formatTitle } from "@/utils/format";

// tabs: Scores, Top 25, Ratings Info
// Scores is the main tab which lets you manipulate and view everything in different ways
// Top 25 gives a simple format optimized to showing what you'd see in-game
// Rating Info dives into how ratings work, you can tweak the values to see how they change, and view a full table 

// sort by dropdown: score, accuracy, rating, song name (default to averaged rating to show what you'd see in-game)
// filter: half time, classic, double time, cleared, custom
// rating vs. averaged rating (what you see in-game)

// mobile: put all the options in a side drawer primary bg style like the game does with option menu
// regular screen should just focus song results / prose, maybe a title. maybe nav at the top ?

// desktop should use all the screen real estate I'd like something more stylized need to think about it more

// have scores in an easy grid format to take a screenshot
// probably fixed max width content display up to 3 column grid, mobile just do one column (..idk how you would have the files though??)

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

          setScores(processedScores.sort((a, b) => sortResultsByRating(a,b)));

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

  const { headerRow, levelRows } = useMemo(() => {
    return buildRatingTable('General', true);
  }, []);

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
      <div aria-hidden className={`${styles.bigText} ${styles.topRight}`}>
        SCORE
      </div>
      <div aria-hidden className={`${styles.bigText} ${styles.bottomLeft}`}>
        BEATABLE
      </div>
      <div className={styles['page__content']}>
        <header>
          <h1 className={styles.heading}>SCOREBEATABLE</h1>
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
            <button className={`${styles.control} ${styles.button}`} onClick={open}>{'// select your arcade scores file.'}</button>
          </div>
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
                <span>{formatResultRating(score, true)}</span>
              </div>
            )
          })}

          <table className={styles.table}>
            <thead>
              <tr>
                {headerRow.columns.map((value, index) => (
                  <th className={styles['table__header']} scope="col" key={index}>{value}</th>
                ))}
              </tr>
            </thead>
            <tbody>
                {levelRows.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    <th className={styles['table__header']} scope="row">{row.header}</th>
                    {row.columns.map((rating, columnIndex) => (
                      <td className={styles['table__data']} key={columnIndex}>{rating}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

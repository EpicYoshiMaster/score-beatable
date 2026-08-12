'use client'

import styles from "./page.module.scss";
import { useDropzone } from 'react-dropzone';
import { useCallback, useMemo, useState } from "react";
import { processScores } from "@/utils/process";
import { HighScoreResult, RatingDisplay } from "@/types";
import Scores from "@/app/Scores";
import RatingsInfo from "@/app/RatingsInfo";
import TopCut from "@/app/TopCut";

// tabs: Scores, Top 25, Ratings Info
// Scores is the main tab which lets you manipulate and view everything in different ways
// Top 25 gives a simple format optimized to showing what you'd see in-game
// Rating Info dives into how ratings work, you can tweak the values to see how they change, and view a full table 

// what are the global settings?
// palette, rating display preference, arcade scores once imported

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

type PageState = 'scores' | 'top-cut' | 'ratings-info';

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);//useLocalStorage<number>("paletteIndex", 0);
  const [importError, setImportError] = useState<string | null>(null);
  const [scores, setScores] = useState<HighScoreResult[]>([]);
  const [pageState, setPageState] = useState<PageState>('scores');
  const [ratingDisplay, setRatingDisplay] = useState<RatingDisplay>('Proper');

  const handleImport = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setImportError("Only one file can be imported at a time.");
      return;
    }

    if (acceptedFiles.length == 0) {
      setImportError("An unknown issue occurred while trying to load the file.");
      return;
    }

    const [file] = acceptedFiles;

    if (!file.name.endsWith('.json')) {
      setImportError("Files must end in .json");
      return;
    }

    try {
      const importedFile = await file.text();
      const importedJSON = JSON.parse(importedFile);

      if (importedJSON.highScores) {
        const processedScores = processScores(importedJSON.highScores);

        setScores(processedScores);
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

  const paletteVariables: React.CSSProperties = useMemo(() => {
    const palette = PALETTES[paletteIndex];

    if (!palette) return {};

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
      <div className={styles.container}>
        <div aria-hidden className={styles.circle} >
          <div className={styles.circleCut}></div>
        </div>
        <div className={styles.content}>
          <header>
            <h1 className={styles.heading}>SCOREBEATABLE</h1>
          </header>
          <main className={styles.main}>
            <div>
              <button onClick={() => setPageState('scores')}>Scores</button>
              <button onClick={() => setPageState('top-cut')}>Top 25</button>
              <button onClick={() => setPageState('ratings-info')}>Ratings Info</button>
            </div>

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
            <p>On Windows, you can find this at <span className={styles.path}>[user]/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json</span></p>

            <div>
              <button onClick={() => setRatingDisplay('Averaged')}>Averaged</button>
              <button onClick={() => setRatingDisplay('Total')}>Total</button>
              <button onClick={() => setRatingDisplay('Proper')}>Proper</button>
            </div>

            {pageState === 'scores' && (
              <Scores scores={scores} ratingDisplay={ratingDisplay} />
            )}
            {pageState === 'top-cut' && (
              <TopCut scores={scores} ratingDisplay={ratingDisplay} />
            )}
            {pageState === 'ratings-info' && (
              <RatingsInfo ratingDisplay={ratingDisplay} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

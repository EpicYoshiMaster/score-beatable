import { useDropzone } from 'react-dropzone';
import { useCallback, useMemo, useState } from "react";
import { processScores } from "../utils/process";
import type { HighScoreResult, RatingDisplay } from "~/types";
import { Outlet } from "react-router";
import type { LayoutContextType } from "~/hooks/useLayoutContext";
import { useLocalStorage } from '~/utils/hooks';
import { Button, CustomNavLink, Select } from '~/components/common';

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

export function meta() {
	return [
		{ title: "SCOREBEATABLE" },
		{ name: "description", content: "the website where you see your scores so you can beat them" },
	];
}

export default function Layout() {
  const [paletteIndex, setPaletteIndex] = useLocalStorage<number>('paletteIndex', 0);
  const [importError, setImportError] = useState<string | null>(null);
  const [scores, setScores] = useState<HighScoreResult[]>([]);
  const [ratingDisplay, setRatingDisplay] = useLocalStorage<RatingDisplay>('ratingDisplay', 'Proper');//useState<RatingDisplay>('Proper');

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

  const outletContext: LayoutContextType = useMemo(() => {
    return {
      scores,
      ratingDisplay
    }
  }, [ratingDisplay, scores]);

  return (
    <div className="layout" style={paletteVariables}>
      <div aria-hidden className="layout__big-text layout__big-text--top-right">
        SCORE
      </div>
      <div aria-hidden className="layout__big-text layout__big-text--bottom-left">
        BEATABLE
      </div>
      <div className="layout__container">
        <div aria-hidden className="layout__circle" >
          <div className="layout__circleCut"></div>
        </div>
        <div className="layout__content">
          <header className="layout__header">
            <div className="layout__corner">
              <Button className="layout__corner__button" noSlash>Settings</Button>
            </div>
            <h1 className="layout__heading">SCOREBEATABLE</h1>
            <nav className="layout__nav">
              <ul className="layout__nav-list">
                <li><CustomNavLink to="/scores">Scores</CustomNavLink></li>
                <li><CustomNavLink to="/top-cut">Top 25</CustomNavLink></li>
                <li><CustomNavLink to="/ratings-info">Ratings Info</CustomNavLink></li>
              </ul>
            </nav>

            <Select value={paletteIndex} onChange={(event) => { setPaletteIndex(Number(event.target.value)); }}>
              {PALETTES.map((palette, index) => (
                <option key={palette.title} value={`${index}`}>{palette.title}</option>
              ))}
            </Select>

            {importError && (
              <div className="layout__alert">{importError}</div>
            )}

            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button onClick={open}>{'select your arcade scores file.'}</Button>
            </div>
            <p>On Windows, you can find this at <span className="layout__path">[user]/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json</span></p>

            <div>
              <Button selected={ratingDisplay === 'Averaged'} onClick={() => setRatingDisplay('Averaged')}>Averaged</Button>
              <Button selected={ratingDisplay === 'Total'} onClick={() => setRatingDisplay('Total')}>Total</Button>
              <Button selected={ratingDisplay === 'Proper'} onClick={() => setRatingDisplay('Proper')}>Proper</Button>
            </div>
          </header>
          <main className="layout__main">
						<Outlet context={outletContext} />
          </main>
        </div>
      </div>
    </div>
  );
}

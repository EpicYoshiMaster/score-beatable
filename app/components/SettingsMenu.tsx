import classNames from "classnames";
import { Button, Label, Select } from "./common";
import { PALETTES } from "~/utils/misc";
import type { GlobalSettings } from "~/types";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { processScores } from "~/utils/process";

interface SettingsMenuProps {
	isOpen: boolean;
	globalSettings: GlobalSettings;
	updateGlobalSettings: (changedSettings: Partial<GlobalSettings>) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, globalSettings, updateGlobalSettings }) => {
	const settingsClassName = classNames('settings-menu', {
		'settings-menu--open': isOpen
	});

	const [importError, setImportError] = useState<string | null>(null);

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

				updateGlobalSettings({ results: processedScores });
				setImportError(null);
			}
			else {
				setImportError("The file provided failed to be matched as an UNBEATABLE high scores file.");
			}
		}
		catch (error) {
			setImportError(`The scores file could not be read: ${error}.`);
		}
	}, [updateGlobalSettings]);

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop: handleImport,
		accept: { 'application/json': ['.json'] },
		noClick: true,
		noDrag: true,
		noKeyboard: true,
		multiple: false
	});

	return (
		<div className={settingsClassName}>
			<div className="settings-menu__container">
				<div className="settings-menu__grid">
					{importError && (
            <div className="settings-menu__alert">{importError}</div>
          )}

					<Label noSlash htmlFor="scoresFile" className="settings-menu__label">arcade scores file</Label>
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<Button id="scoresFile" className="settings-menu__control" onClick={open}>{'select your arcade scores file.'}</Button>
					</div>
					<p className="settings-menu__description">
						Import your <span className="settings-menu__bold">arcade-highscores.json</span> file to see all of your results.<br />
						On Windows, you can find this at <span className="settings-menu__bold">[user]/AppData/LocalLow/D-CELL GAMES/UNBEATABLE/PROFILES/[uuid]/arcade-highscores.json</span>
					</p>

					<Label noSlash className="settings-menu__label">
						rating display style
					</Label>
					<div className="settings-menu__button-row">
						<Button className="settings-menu__control" selected={globalSettings.ratingDisplay === 'Averaged'} onClick={() => updateGlobalSettings({ ratingDisplay: 'Averaged' })}>Averaged</Button>
						<Button className="settings-menu__control" selected={globalSettings.ratingDisplay === 'Total'} onClick={() => updateGlobalSettings({ ratingDisplay: 'Total' })}>Total</Button>
						<Button className="settings-menu__control" selected={globalSettings.ratingDisplay === 'Proper'} onClick={() => updateGlobalSettings({ ratingDisplay: 'Proper' })}>Proper</Button>
					</div>
					<p className="settings-menu__description">
						Select how to display <span className="settings-menu__bold">Star Ratings</span> for individual results throughout the website.<br />
						<span className="settings-menu__bold">Averaged</span> is the number you would see in-game, it's the averaged out numerical contribution of this result to your final rating.<br />
						<span className="settings-menu__bold">Total</span> is what's stored internally, it's the raw rating value this result was worth.<br />
						<span className="settings-menu__bold">Proper</span> sums <span className="settings-menu__bold">Total</span> plus <span className="settings-menu__bold">Max Completion</span>, it's your final rating if this were the only result that counted.
					</p>

					<Label noSlash htmlFor="paletteIndex" className="settings-menu__label">palette</Label>
					<Select id="paletteIndex" className="settings-menu__control settings-menu__select" value={globalSettings.paletteIndex} onChange={(event) => { updateGlobalSettings({ paletteIndex: Number(event.target.value) }); }}>
						{PALETTES.map((palette, index) => (
							<option key={palette.title} value={`${index}`}>{palette.title}</option>
						))}
					</Select>
					<p className="settings-menu__description">
						Ooo fun colors!!!
					</p>
				</div>
			</div>
		</div>
	);
}

export default SettingsMenu;
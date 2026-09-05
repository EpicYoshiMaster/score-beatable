import { toSnakeCase } from "js-convert-case";
import { Button } from "./common";

interface FilterProps<T extends string> {
	options: T[];
	selected: T[];
	toggleItem: (item: T) => void;
	title: string;
	formatOption?: (option: T) => string;
};

export function Filter<T extends string>({ options, selected, toggleItem, title, formatOption }: FilterProps<T>) {
	return (
		<fieldset className="filter">
			<legend className="common__label" aria-label={title}>[{toSnakeCase(title)}]</legend>
			{options.map((option) => (
				<div className="filter__item" key={option}>
					<Button 
						className="filter__control" 
						selected={selected.includes(option)} 
						onClick={() => toggleItem(option)}
					>
						{formatOption ? formatOption(option) : option}
					</Button>
				</div>
			))}
		</fieldset>
	);
}
import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T, onParseValue?: (parsedValue: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(() => {
		try {
			const savedValue = localStorage.getItem(key);

			if (savedValue !== null) {
				const parsedValue = JSON.parse(savedValue);

				if(onParseValue) {
					onParseValue(parsedValue);
				}
				
				return parsedValue;
			}

			return defaultValue;
		}
		catch {
			return defaultValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}
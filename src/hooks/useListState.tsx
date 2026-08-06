import { useCallback, useState } from "react";

function useListState<T>(defaultState: T[]): [T[], (item: T) => void] {
	const [listState, setListState] = useState<T[]>(defaultState);

	const toggleListItem = useCallback((item: T) => {
		if(listState.includes(item)) {
			setListState((items) => items.filter((currentItem) => currentItem !== item));
		}
		else {
			setListState((items) => [...items, item]);
		}
	}, [listState]);

	return [listState, toggleListItem];
}

export default useListState;
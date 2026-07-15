// for parsing
export type HighScoreEntry = {
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
export type HighScoreResult = HighScoreEntry & {
  entry: string; // Internal name
  title: string; // Proper name
  difficulty: Difficulty; // Beginner, Hard, Expert, UNBEATABLE, Star
  modifier: Modifier; // Classic DoubleTime HalfTime
  custom: boolean;
  difficultyName: string | null;
}

export type SongEntry = {
  title: string;
  difficulty: string;
  artist: string;
  creator: string;
}

export type Difficulty = 'Tutorial' | 'Beginner' | 'Easy' | 'Normal' | 'Hard' | 'UNBEATABLE' | 'Star' | 'OFFSETWIZARD' | 'Trailer' | 'Unknown';
export type Modifier = 'Classic' | 'HalfTime' | 'DoubleTime' | 'Unknown';
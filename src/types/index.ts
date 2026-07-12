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
export type HighScore = HighScoreEntry & {
  entry: string; // Internal name
  title: string; // Proper name
  difficulty: string; // Beginner, Hard, Expert, UNBEATABLE, Star
  modifier: string; // Classic DoubleTime HalfTime
}
// for parsing
export type HighScoreEntry = {
  song: string; // SONG NAME/SONG DIFFICULTY\SONG MODIFIER
  score: number;
  accuracy: number;
  maxCombo: number;
  notes: {
    timing: Judgement;
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
  rating: number;
  averagedRating: number;
  resultGrade: ResultGrade;
}

export type SongEntry = {
  title: string;
  difficulty: string;
  artist: string;
  creator: string;
}

export type ResultGrade = {
  grade: Grade;
  accuracy: number;
  rankingCoef: number;
  options: GradeOption[];
}

export type Grade = 'F' | 'C++' | 'S++' | 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' | 'HOW?';
export type GradeOption = 'Greater' | 'Equal' | 'NoMiss' | 'Bonus';
export type Difficulty = 'Tutorial' | 'Beginner' | 'Easy' | 'Normal' | 'Hard' | 'UNBEATABLE' | 'Star' | 'OFFSETWIZARD' | 'Trailer' | 'Unknown';
export type Modifier = 'Classic' | 'HalfTime' | 'DoubleTime' | 'Unknown';
export type Judgement = 'Miss' | 'Barely' | 'Ok' | 'Good' | 'Great' | 'Perfect' | 'Critical';

export type TableRow = {
  header: string;
  columns: string[];
}
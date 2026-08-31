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
  songSpeed: SongSpeed; // Classic DoubleTime HalfTime
  modifierList: Modifier[];
  isCustom: boolean;
  isDlc: boolean;
  isCritical: boolean;
  songEntry: SongEntry;
  rating: number;
  averagedRating: number;
  resultGrade: ResultGrade;
  clearState: ClearState;
  songType: SongType;
}

export type SongEntry = {
  title: string;
  difficulty: string;
  artist: string;
  creator: string;
  level: number;
  songLength: number;
  flavorText: string;
  isDlc: boolean;
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
export type SongSpeed = 'Classic' | 'HalfTime' | 'DoubleTime' | 'Unknown';
export type Modifier = 'None' | 'NoFail' | 'AssistMode' | 'DoubleTime' | 'HalfTime' | 'Critical' | 'Stealth' | 'Not-Critical';
export type Judgement = 'Miss' | 'Barely' | 'Ok' | 'Good' | 'Great' | 'Perfect' | 'Critical';
export type ClearState = 'Unplayed' | 'Fail' | 'Clear' | 'FullCombo' | 'PerfectFullCombo';
export type SongType = 'Base' | 'DLC' | 'Custom';

export type AccuracyRange = 'General' | 'Middle' | 'Upper' | 'Top';
export type RatingDisplay = 'Averaged' | 'Total' | 'Proper'; // still not sure on these names
export type SortType = 'rating' | 'accuracy' | 'level' | 'difficulty' | 'score' | 'title' | 'artist' | 'creator';

export type HeaderRow = {
  header: string;
  columns: string[]; 
}

export type TableRow = {
  header: string;
  columns: { averagedRating: number, rating: number }[];
}

export type SortMethod = {
  name: string;
  value: SortType;
  function: (a: HighScoreResult, b: HighScoreResult) => number;
}

export type DisplayThreshold = {
  ratingDisplay: RatingDisplay;
  default: number;
  min: number;
  max: number;
  step: number;
}
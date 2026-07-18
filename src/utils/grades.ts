import consts from '@/data/consts.json';
import { ResultGrade } from '@/types';

const RESULT_GRADES = consts.resultGrades as ResultGrade[];
const A_PLUS_GRADE = consts.aPlusGrade as ResultGrade;

const NO_MISS_BONUS = 0.01;

export const checkGrade = (grade: ResultGrade, accuracy: number, noMiss: boolean) => {
	let gradeAccuracy = grade.accuracy;

	if(grade.options.includes("Bonus") && noMiss) {
		gradeAccuracy -= NO_MISS_BONUS;
	}

	const flag = (!grade.options.includes("Equal") ? (accuracy > gradeAccuracy) : accuracy === gradeAccuracy);

	if(grade.options.includes("NoMiss")) return flag && noMiss;

	return flag;
}

export const getGrade = (accuracy: number, noMiss: boolean, cleared: boolean): ResultGrade => {
	if(!cleared) return RESULT_GRADES[0]; // F

	const resultGrade = RESULT_GRADES.find((grade) => {
		return grade.accuracy >= 0 && checkGrade(grade as ResultGrade, accuracy, noMiss);
	})

	if(resultGrade) return resultGrade;

	return RESULT_GRADES[RESULT_GRADES.length - 1]; // HOW?
}

// Arcade limits your coefficient to cap at A+ by making it the first grade check
export const getGradeCoefArcade = (accuracy: number, noMiss: boolean, cleared: boolean) => {
	if(checkGrade(A_PLUS_GRADE, accuracy, noMiss)) {
		return A_PLUS_GRADE.rankingCoef;
	}

	return getGrade(accuracy, noMiss, cleared).rankingCoef;
}
// User types
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  goals?: string[];
  preferences?: UserPreferences;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  darkMode: boolean;
  useMetric: boolean; // true for kg, false for lbs
  restTimerDuration: number; // in seconds
  showRestTimer: boolean;
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  instructions: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  equipmentNeeded: string[];
  imageUrl?: string;
  videoUrl?: string;
}

// Workout types
export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  isWarmup: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  timestamp: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  targetSets?: number;
  targetReps?: number;
  restTime?: number; // in seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  startTime: number;
  endTime?: number;
  duration?: number; // in seconds
  notes?: string;
  programId?: string;
  userId: string;
}

// Program types
export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  workouts: ProgramWorkout[];
  duration: number; // in weeks
  frequency: number; // workouts per week
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: string[]; // e.g., ['strength', 'hypertrophy', 'endurance']
  createdBy: string; // user ID or 'system' for defaults
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProgramWorkout {
  id: string;
  name: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  repsPerSet: number | string; // can be a number or a range like "8-12"
  restTime: number; // in seconds
  notes?: string;
}

// Progress tracking types
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: number;
  weight?: number;
  bodyFat?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    leftArm?: number;
    rightArm?: number;
    leftThigh?: number;
    rightThigh?: number;
    leftCalf?: number;
    rightCalf?: number;
    shoulders?: number;
    neck?: number;
  };
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: number;
  photoUrl: string;
  category: 'front' | 'back' | 'side' | 'other';
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  value: number; // weight
  reps: number;
  date: number;
  workoutId?: string;
}

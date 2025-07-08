import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

// Define types for our store
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

interface WorkoutState {
  activeWorkout: any | null;
  workoutHistory: any[];
  startWorkout: (workout: any) => void;
  endWorkout: (workout: any) => void;
  logSet: (exerciseId: string, set: any) => void;
}

interface ProgramState {
  programs: any[];
  selectedProgram: any | null;
  setPrograms: (programs: any[]) => void;
  selectProgram: (program: any) => void;
}

// Create the user store
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Create the workout store
export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      workoutHistory: [],
      startWorkout: (workout) => set({ activeWorkout: workout }),
      endWorkout: (workout) => {
        set((state) => ({
          activeWorkout: null,
          workoutHistory: [workout, ...state.workoutHistory],
        }));
      },
      logSet: (exerciseId, set) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        
        // Find the exercise and add the set
        const updatedWorkout = {
          ...activeWorkout,
          exercises: activeWorkout.exercises.map((exercise: any) => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: [...(exercise.sets || []), set],
              };
            }
            return exercise;
          }),
        };
        
        set({ activeWorkout: updatedWorkout });
      },
    }),
    {
      name: 'workout-storage',
    }
  )
);

// Create the program store
export const useProgramStore = create<ProgramState>()(
  persist(
    (set) => ({
      programs: [],
      selectedProgram: null,
      setPrograms: (programs) => set({ programs }),
      selectProgram: (program) => set({ selectedProgram: program }),
    }),
    {
      name: 'program-storage',
    }
  )
);

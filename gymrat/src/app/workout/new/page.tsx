'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkoutStore, useProgramStore } from '@/lib/store';
import { FiPlus, FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

// Mock exercise database
const exerciseDatabase = [
  { id: 'ex1', name: 'Bench Press', muscleGroups: ['chest', 'triceps'], equipmentNeeded: ['barbell', 'bench'] },
  { id: 'ex2', name: 'Squat', muscleGroups: ['quadriceps', 'glutes'], equipmentNeeded: ['barbell', 'rack'] },
  { id: 'ex3', name: 'Deadlift', muscleGroups: ['back', 'hamstrings'], equipmentNeeded: ['barbell'] },
  { id: 'ex4', name: 'Pull-up', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['pull-up bar'] },
  { id: 'ex5', name: 'Push-up', muscleGroups: ['chest', 'triceps'], equipmentNeeded: [] },
  { id: 'ex6', name: 'Dumbbell Curl', muscleGroups: ['biceps'], equipmentNeeded: ['dumbbells'] },
  { id: 'ex7', name: 'Tricep Extension', muscleGroups: ['triceps'], equipmentNeeded: ['cable machine'] },
  { id: 'ex8', name: 'Leg Press', muscleGroups: ['quadriceps', 'glutes'], equipmentNeeded: ['leg press machine'] },
];

export default function NewWorkoutPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { programs, selectedProgram } = useProgramStore();
  
  const [workoutName, setWorkoutName] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [programWorkouts, setProgramWorkouts] = useState<any[]>([]);
  const [selectedProgramWorkout, setSelectedProgramWorkout] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
    
    // Set default workout name
    setWorkoutName(`Workout - ${new Date().toLocaleDateString()}`);
    
    // If there's a selected program, populate the program workouts
    if (selectedProgram) {
      setSelectedProgramId(selectedProgram.id);
      setProgramWorkouts(selectedProgram.workouts || []);
    }
  }, [currentUser, router, selectedProgram]);

  // Filter exercises based on search term
  const filteredExercises = exerciseDatabase.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle program selection
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);
    
    if (programId) {
      const program = programs.find(p => p.id === programId);
      if (program) {
        setProgramWorkouts(program.workouts || []);
      } else {
        setProgramWorkouts([]);
      }
    } else {
      setProgramWorkouts([]);
    }
    
    setSelectedProgramWorkout(null);
  };

  // Handle program workout selection
  const handleProgramWorkoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workoutId = e.target.value;
    if (workoutId) {
      const workout = programWorkouts.find(w => w.id === workoutId);
      if (workout) {
        setSelectedProgramWorkout(workout);
        setWorkoutName(workout.name);
        
        // Convert program exercises to workout exercises
        const workoutExercises = workout.exercises.map((exercise: any) => ({
          id: `temp-${Date.now()}-${Math.random()}`,
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sets: [],
          targetSets: exercise.sets,
          targetReps: exercise.repsPerSet,
          restTime: exercise.restTime,
          notes: exercise.notes
        }));
        
        setSelectedExercises(workoutExercises);
      }
    } else {
      setSelectedProgramWorkout(null);
      setSelectedExercises([]);
    }
  };

  // Add exercise to workout
  const addExercise = (exercise: any) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        id: `temp-${Date.now()}-${Math.random()}`,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: []
      }
    ]);
  };

  // Remove exercise from workout
  const removeExercise = (index: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
  };

  // Start the workout
  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise to your workout');
      return;
    }

    const newWorkout = {
      id: `workout-${Date.now()}`,
      name: workoutName,
      description: '',
      exercises: selectedExercises,
      startTime: Date.now(),
      notes: workoutNotes,
      programId: selectedProgramId || undefined,
      userId: currentUser?.uid || 'anonymous'
    };

    startWorkout(newWorkout);
    router.push('/workout/active');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Workout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 mb-1">
            Workout Name
          </label>
          <input
            type="text"
            id="workout-name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="My Workout"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="workout-notes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            placeholder="Any notes about this workout..."
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
              Program (Optional)
            </label>
            <select
              id="program"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProgramId}
              onChange={handleProgramChange}
            >
              <option value="">No Program</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedProgramId && programWorkouts.length > 0 && (
            <div>
              <label htmlFor="program-workout" className="block text-sm font-medium text-gray-700 mb-1">
                Program Workout
              </label>
              <select
                id="program-workout"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProgramWorkout?.id || ''}
                onChange={handleProgramWorkoutChange}
              >
                <option value="">Select Workout</option>
                {programWorkouts.map(workout => (
                  <option key={workout.id} value={workout.id}>
                    {workout.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Exercises</h2>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Exercise
          </button>
        </div>
        
        {selectedExercises.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No exercises added yet. Click "Add Exercise" to start building your workout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{exercise.exerciseName}</h3>
                  <button
                    onClick={() => removeExercise(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                </div>
                
                {exercise.targetSets && (
                  <div className="mt-2 text-sm text-gray-600">
                    Target: {exercise.targetSets} sets × {exercise.targetReps} reps
                  </div>
                )}
                
                {exercise.notes && (
                  <div className="mt-1 text-sm text-gray-500">
                    {exercise.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleStartWorkout}
          disabled={selectedExercises.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          Start Workout
        </button>
      </div>
      
      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowExerciseModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Exercises</h3>
                
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {filteredExercises.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredExercises.map(exercise => (
                        <li key={exercise.id} className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{exercise.name}</h4>
                              <p className="text-xs text-gray-500">
                                {exercise.muscleGroups.join(', ')}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                addExercise(exercise);
                                setShowExerciseModal(false);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiPlus className="mr-1" />
                              Add
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No exercises found matching your search.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowExerciseModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

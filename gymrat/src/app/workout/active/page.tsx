'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkoutStore } from '@/lib/store';
import { FiClock, FiPlus, FiCheck, FiX, FiSave, FiTrash2 } from 'react-icons/fi';

export default function ActiveWorkoutPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { activeWorkout, completeWorkout, updateActiveWorkout, cancelWorkout } = useWorkoutStore();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!activeWorkout) {
      router.push('/workout/new');
      return;
    }

    // Set initial notes from active workout
    setNotes(activeWorkout.notes || '');

    // Start timer
    const startTime = activeWorkout.startTime;
    const timer = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWorkout, currentUser, router]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add a set to an exercise
  const addSet = (exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    
    const newSet = {
      id: `set-${Date.now()}-${Math.random()}`,
      weight: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].weight : 0,
      reps: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].reps : 0,
      completed: false,
      timestamp: Date.now()
    };
    
    exercise.sets = [...exercise.sets, newSet];
    
    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  // Update set data
  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const updatedSets = [...exercise.sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value
    };
    
    exercise.sets = updatedSets;
    
    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  // Toggle set completion
  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const updatedSets = [...exercise.sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      completed: !updatedSets[setIndex].completed
    };
    
    exercise.sets = updatedSets;
    
    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  // Delete a set
  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const updatedSets = [...exercise.sets];
    
    updatedSets.splice(setIndex, 1);
    exercise.sets = updatedSets;
    
    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  // Update workout notes
  const updateNotes = () => {
    if (!activeWorkout) return;
    
    updateActiveWorkout({
      ...activeWorkout,
      notes: notes
    });
  };

  // Complete the workout
  const handleCompleteWorkout = () => {
    if (!activeWorkout) return;
    
    completeWorkout({
      ...activeWorkout,
      endTime: Date.now(),
      duration: elapsedTime,
      notes: notes
    });
    
    router.push('/workouts');
  };

  // Cancel the workout
  const handleCancelWorkout = () => {
    cancelWorkout();
    router.push('/dashboard');
  };

  if (!activeWorkout) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{activeWorkout.name}</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <FiClock className="mr-1" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-3">
          <button
            onClick={() => setShowConfirmCancel(true)}
            className="px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
          >
            Cancel Workout
          </button>
          <button
            onClick={handleCompleteWorkout}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Complete Workout
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Exercises</h2>
        
        {activeWorkout.exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">{exercise.exerciseName}</h3>
              <button
                onClick={() => addSet(exerciseIndex)}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiPlus className="mr-1" />
                Add Set
              </button>
            </div>
            
            {exercise.targetSets && (
              <div className="text-sm text-gray-600 mb-3">
                Target: {exercise.targetSets} sets × {exercise.targetReps} reps
              </div>
            )}
            
            {exercise.sets.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500 text-sm">No sets added yet. Click "Add Set" to start tracking.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={set.id} className={set.completed ? 'bg-green-50' : ''}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {setIndex + 1}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={set.weight}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                          />
                          <span className="ml-1 text-gray-500">kg</span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={set.reps}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => toggleSetCompleted(exerciseIndex, setIndex)}
                            className={`p-1 rounded-full ${set.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {set.completed ? <FiCheck /> : <FiCheck />}
                          </button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => deleteSet(exerciseIndex, setIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Notes</h2>
          <button
            onClick={updateNotes}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiSave className="mr-1" />
            Save
          </button>
        </div>
        
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about your workout..."
          rows={4}
        />
      </div>
      
      {/* Fixed bottom action bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="flex justify-between">
          <button
            onClick={() => setShowConfirmCancel(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCompleteWorkout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Complete Workout
          </button>
        </div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiX className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Workout
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this workout? All progress will be lost.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelWorkout}
                >
                  Yes, Cancel
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmCancel(false)}
                >
                  Continue Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

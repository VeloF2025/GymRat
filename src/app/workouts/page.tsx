'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkoutStore } from '@/lib/store';
import { FiPlus, FiFilter, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';

export default function WorkoutsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { workoutHistory } = useWorkoutStore();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, we would fetch this data from Firebase
    // For now, we'll just use the data from the store
    setWorkouts(workoutHistory);
    setLoading(false);
  }, [workoutHistory]);

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  const filteredWorkouts = filter === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.programId === filter);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Workout History</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/workout/new" 
            className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            New Workout
          </Link>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Workouts</option>
              {/* In a real app, we would dynamically populate this with program options */}
              <option value="program1">Program 1</option>
              <option value="program2">Program 2</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiFilter className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workout
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercises
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkouts.map((workout) => (
                  <tr key={workout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{workout.name}</div>
                      {workout.notes && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">{workout.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(workout.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(workout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {workout.duration ? `${Math.floor(workout.duration / 60)} min` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiActivity className="mr-1 text-gray-400" />
                        {workout.exercises.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {workout.programId ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Program Name
                          </span>
                        ) : (
                          <span className="text-gray-500">Custom</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/workouts/${workout.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <FiCalendar className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-500 mb-6">You haven't logged any workouts yet. Start your fitness journey today!</p>
            <Link 
              href="/workout/new" 
              className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Start New Workout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

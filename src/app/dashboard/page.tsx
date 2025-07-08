'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkoutStore, useProgramStore } from '@/lib/store';
import { FiActivity, FiCalendar, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { activeWorkout, workoutHistory } = useWorkoutStore();
  const { programs } = useProgramStore();
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this data from Firebase
    // For now, we'll just use the data from the store
    setRecentWorkouts(workoutHistory.slice(0, 5));
    setLoading(false);
  }, [workoutHistory]);

  useEffect(() => {
    // Check authentication and redirect if needed
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);
  
  // Show loading state while checking authentication
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link 
          href="/workout/new" 
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex flex-col items-center justify-center text-center"
        >
          <FiActivity className="text-3xl mb-2" />
          <h3 className="font-bold text-lg">Start Workout</h3>
          <p className="text-sm opacity-80 mt-1">Begin a new training session</p>
        </Link>
        
        <Link 
          href="/programs" 
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex flex-col items-center justify-center text-center"
        >
          <FiCalendar className="text-3xl mb-2" />
          <h3 className="font-bold text-lg">My Programs</h3>
          <p className="text-sm opacity-80 mt-1">View and manage workout plans</p>
        </Link>
        
        <Link 
          href="/progress" 
          className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex flex-col items-center justify-center text-center"
        >
          <FiTrendingUp className="text-3xl mb-2" />
          <h3 className="font-bold text-lg">Progress</h3>
          <p className="text-sm opacity-80 mt-1">Track your fitness journey</p>
        </Link>
        
        <Link 
          href="/exercises" 
          className="bg-orange-600 text-white p-6 rounded-lg shadow-md hover:bg-orange-700 transition-colors flex flex-col items-center justify-center text-center"
        >
          <FiAward className="text-3xl mb-2" />
          <h3 className="font-bold text-lg">Exercise Library</h3>
          <p className="text-sm opacity-80 mt-1">Browse exercises and techniques</p>
        </Link>
      </div>
      
      {/* Active Workout */}
      {activeWorkout && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Active Workout</h2>
            <Link 
              href="/workout/active" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Continue
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiClock className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold">{activeWorkout.name}</h3>
              <p className="text-sm text-gray-600">
                Started {new Date(activeWorkout.startTime).toLocaleTimeString()} • {activeWorkout.exercises.length} exercises
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Workouts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Workouts</h2>
          <Link 
            href="/workouts" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recentWorkouts.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentWorkouts.map((workout) => (
                  <tr key={workout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{workout.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(workout.startTime).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {workout.duration ? `${Math.floor(workout.duration / 60)} min` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {workout.exercises.length} exercises
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/workouts/${workout.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No workout history yet. Start your first workout!</p>
            <Link 
              href="/workout/new" 
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Start Workout
            </Link>
          </div>
        )}
      </div>
      
      {/* My Programs */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Programs</h2>
          <Link 
            href="/programs" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.slice(0, 3).map((program) => (
              <Link 
                key={program.id} 
                href={`/programs/${program.id}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{program.workouts.length} workouts</span>
                    <span className="text-gray-500">{program.duration} weeks</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No programs yet. Create or browse program templates!</p>
            <Link 
              href="/programs/templates" 
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProgramStore } from '@/lib/store';
import { FiPlus, FiCalendar, FiClock, FiActivity, FiMoreVertical } from 'react-icons/fi';

export default function ProgramsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { programs, setSelectedProgram } = useProgramStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-programs');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // In a real app, we would fetch this data from Firebase
    // For now, we'll just use the data from the store
    setLoading(false);
  }, [currentUser, router]);

  const handleSelectProgram = (program: any) => {
    setSelectedProgram(program);
    router.push(`/programs/${program.id}`);
  };

  // Mock program templates for the templates tab
  const programTemplates = [
    {
      id: 'template-1',
      name: 'Beginner Strength',
      description: 'A 12-week program designed for beginners to build strength and muscle.',
      duration: 12,
      level: 'Beginner',
      category: 'Strength',
      workoutsPerWeek: 3,
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'template-2',
      name: 'Intermediate Hypertrophy',
      description: 'An 8-week program focused on muscle growth for intermediate lifters.',
      duration: 8,
      level: 'Intermediate',
      category: 'Hypertrophy',
      workoutsPerWeek: 4,
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'template-3',
      name: 'Advanced Powerlifting',
      description: 'A 16-week program for advanced lifters focusing on powerlifting.',
      duration: 16,
      level: 'Advanced',
      category: 'Powerlifting',
      workoutsPerWeek: 5,
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'template-4',
      name: 'Full Body Fitness',
      description: 'A 6-week full body program suitable for all levels.',
      duration: 6,
      level: 'All Levels',
      category: 'General Fitness',
      workoutsPerWeek: 3,
      imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Programs</h1>
        
        <Link 
          href="/programs/create" 
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Create Program
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-programs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-programs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Programs
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'my-programs' ? (
        programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div 
                key={program.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectProgram(program)}
              >
                <div className="h-40 bg-gray-200 relative">
                  {program.imageUrl ? (
                    <img 
                      src={program.imageUrl} 
                      alt={program.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
                      <FiActivity className="text-white text-4xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{program.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{program.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span>{program.duration} weeks</span>
                    </div>
                    <div className="flex items-center">
                      <FiActivity className="mr-1" />
                      <span>{program.workouts?.length || 0} workouts</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <FiCalendar className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
              <p className="text-gray-500 mb-6">Create your own program or choose from our templates</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/programs/create" 
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create Program
                </Link>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Browse Templates
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        // Templates tab
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programTemplates.map((template) => (
            <div 
              key={template.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/programs/templates/${template.id}`)}
            >
              <div className="h-40 bg-gray-200 relative">
                {template.imageUrl && (
                  <img 
                    src={template.imageUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-2 py-1 text-xs font-medium">
                  {template.level}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    <span>{template.duration} weeks</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{template.workoutsPerWeek}x / week</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

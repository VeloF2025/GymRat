'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiSearch, FiFilter, FiInfo } from 'react-icons/fi';

// Exercise database with unique images for each exercise - in a real app this would come from Firebase
// All exercises have unique, appropriate photos
const exerciseDatabase = [
  { 
    id: 'ex1', 
    name: 'Bench Press', 
    muscleGroups: ['chest', 'triceps'], 
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    category: 'compound',
    description: 'A compound exercise that primarily targets the pectoralis major with secondary emphasis on the anterior deltoids, triceps brachii, and coracobrachialis.',
    instructions: '1. Lie on a flat bench with feet flat on the floor.\n2. Grip the barbell slightly wider than shoulder width.\n3. Unrack the barbell and lower it to your mid-chest.\n4. Press the barbell back up to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex2', 
    name: 'Squat', 
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], 
    equipment: ['barbell', 'rack'],
    difficulty: 'intermediate',
    category: 'compound',
    description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes, while also engaging the lower back and core.',
    instructions: '1. Stand with feet shoulder-width apart under a barbell racked at upper chest height.\n2. Position the barbell across your upper back and shoulders.\n3. Unrack the barbell and step back.\n4. Bend at the knees and hips to lower your body until thighs are parallel to the ground.\n5. Push through your heels to return to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex3', 
    name: 'Deadlift', 
    muscleGroups: ['back', 'hamstrings', 'glutes'], 
    equipment: ['barbell'],
    difficulty: 'advanced',
    category: 'compound',
    description: 'A compound exercise that targets the entire posterior chain, including the back, glutes, and hamstrings.',
    instructions: '1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Bend at the hips and knees to grip the barbell.\n3. Lift the bar by extending hips and knees, keeping back straight.\n4. Stand tall at the top, then reverse the movement to return the bar to the floor.',
    imageUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex4', 
    name: 'Pull-up', 
    muscleGroups: ['back', 'biceps'], 
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    category: 'compound',
    description: 'A compound upper body exercise that primarily targets the latissimus dorsi and biceps.',
    instructions: '1. Hang from a pull-up bar with hands slightly wider than shoulder-width apart.\n2. Pull your body up until your chin clears the bar.\n3. Lower yourself back to the starting position with control.',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex5', 
    name: 'Push-up', 
    muscleGroups: ['chest', 'triceps', 'shoulders'], 
    equipment: [],
    difficulty: 'beginner',
    category: 'compound',
    description: 'A bodyweight compound exercise that targets the chest, triceps, and shoulders.',
    instructions: '1. Start in a plank position with hands slightly wider than shoulder-width apart.\n2. Lower your body until your chest nearly touches the floor.\n3. Push your body back up to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1566241439833-ebb06bf4d517?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex6', 
    name: 'Dumbbell Curl', 
    muscleGroups: ['biceps'], 
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    category: 'isolation',
    description: 'An isolation exercise that targets the biceps brachii.',
    instructions: '1. Stand holding dumbbells at your sides with palms facing forward.\n2. Keeping upper arms stationary, curl the weights up to shoulder level.\n3. Lower the weights back to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex7', 
    name: 'Tricep Extension', 
    muscleGroups: ['triceps'], 
    equipment: ['cable machine'],
    difficulty: 'beginner',
    category: 'isolation',
    description: 'An isolation exercise that targets the triceps brachii.',
    instructions: '1. Stand facing a cable machine with a rope attachment at head height.\n2. Grip the rope with both hands and pull it down by extending your elbows.\n3. Return to the starting position with control.',
    imageUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex8', 
    name: 'Leg Press', 
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], 
    equipment: ['leg press machine'],
    difficulty: 'beginner',
    category: 'compound',
    description: 'A machine-based compound exercise that targets the quadriceps, hamstrings, and glutes.',
    instructions: '1. Sit on the leg press machine with feet shoulder-width apart on the platform.\n2. Release the safety and lower the platform by bending your knees.\n3. Push through your heels to extend your legs back to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex9', 
    name: 'Lat Pulldown', 
    muscleGroups: ['back', 'biceps'], 
    equipment: ['cable machine'],
    difficulty: 'beginner',
    category: 'compound',
    description: 'A compound exercise that targets the latissimus dorsi and biceps.',
    instructions: '1. Sit at a lat pulldown machine with a wide grip on the bar.\n2. Pull the bar down to chest level while keeping your back straight.\n3. Slowly return the bar to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 'ex10', 
    name: 'Overhead Press', 
    muscleGroups: ['shoulders', 'triceps'], 
    equipment: ['barbell'],
    difficulty: 'intermediate',
    category: 'compound',
    description: 'A compound exercise that primarily targets the deltoids and triceps.',
    instructions: '1. Stand with feet shoulder-width apart holding a barbell at shoulder height.\n2. Press the barbell overhead until arms are fully extended.\n3. Lower the barbell back to shoulder height with control.',
    imageUrl: 'https://images.unsplash.com/photo-1567598508481-65a7a5553b2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

// Get unique muscle groups from exercise database
const allMuscleGroups = Array.from(
  new Set(exerciseDatabase.flatMap(exercise => exercise.muscleGroups))
);

// Get unique equipment from exercise database
const allEquipment = Array.from(
  new Set(exerciseDatabase.flatMap(exercise => exercise.equipment))
);

// Get unique difficulty levels
const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

// Get unique categories
const categories = ['compound', 'isolation'];

export default function ExercisesPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Filter exercises based on search and filters
  const filteredExercises = exerciseDatabase.filter(exercise => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Muscle group filter
    const matchesMuscleGroup = selectedMuscleGroups.length === 0 || 
      selectedMuscleGroups.some(group => exercise.muscleGroups.includes(group));
    
    // Equipment filter
    const matchesEquipment = selectedEquipment.length === 0 || 
      selectedEquipment.some(item => exercise.equipment.includes(item));
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(exercise.difficulty);
    
    // Category filter
    const matchesCategory = selectedCategory.length === 0 || 
      selectedCategory.includes(exercise.category);
    
    return matchesSearch && matchesMuscleGroup && matchesEquipment && matchesDifficulty && matchesCategory;
  });

  // Toggle muscle group selection
  const toggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group) 
        : [...prev, group]
    );
  };

  // Toggle equipment selection
  const toggleEquipment = (item: string) => {
    setSelectedEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item) 
        : [...prev, item]
    );
  };

  // Toggle difficulty selection
  const toggleDifficulty = (level: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(level) 
        ? prev.filter(d => d !== level) 
        : [...prev, level]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategory(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroups([]);
    setSelectedEquipment([]);
    setSelectedDifficulty([]);
    setSelectedCategory([]);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Exercise Library</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
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
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="mr-2" />
            Filters {(selectedMuscleGroups.length + selectedEquipment.length + selectedDifficulty.length + selectedCategory.length) > 0 && 
              `(${selectedMuscleGroups.length + selectedEquipment.length + selectedDifficulty.length + selectedCategory.length})`}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium mb-2">Muscle Groups</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allMuscleGroups.map(group => (
                    <div key={group} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`muscle-${group}`}
                        checked={selectedMuscleGroups.includes(group)}
                        onChange={() => toggleMuscleGroup(group)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`muscle-${group}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Equipment</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allEquipment.map(item => (
                    <div key={item} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`equipment-${item}`}
                        checked={selectedEquipment.includes(item)}
                        onChange={() => toggleEquipment(item)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`equipment-${item}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Difficulty</h3>
                <div className="space-y-1">
                  {difficultyLevels.map(level => (
                    <div key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`difficulty-${level}`}
                        checked={selectedDifficulty.includes(level)}
                        onChange={() => toggleDifficulty(level)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`difficulty-${level}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategory.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div 
            key={exercise.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="h-40 bg-gray-200">
              {exercise.imageUrl ? (
                <img 
                  src={exercise.imageUrl} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{exercise.name}</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.muscleGroups.map(group => (
                  <span key={group} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                    {group}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                  ${exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                    exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}
                >
                  {exercise.difficulty}
                </span>
                
                <span className="text-gray-500 capitalize">{exercise.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No exercises found matching your criteria. Try adjusting your filters.</p>
        </div>
      )}
      
      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedExercise(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      {selectedExercise.name}
                    </h3>
                    
                    {selectedExercise.imageUrl && (
                      <img 
                        src={selectedExercise.imageUrl} 
                        alt={selectedExercise.name} 
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedExercise.muscleGroups.map((group: string) => (
                        <span key={group} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                          {group}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mb-4 text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <span className="font-medium mr-2">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${selectedExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                            selectedExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {selectedExercise.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <span className="font-medium mr-2">Category:</span>
                        <span className="capitalize">{selectedExercise.category}</span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <span className="font-medium mr-2">Equipment:</span>
                        <span className="capitalize">{selectedExercise.equipment.length > 0 ? selectedExercise.equipment.join(', ') : 'None'}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                      <p className="text-sm text-gray-600">{selectedExercise.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Instructions</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{selectedExercise.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedExercise(null)}
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

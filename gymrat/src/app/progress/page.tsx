'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiPlus, FiCalendar, FiTrendingUp, FiCamera, FiPieChart } from 'react-icons/fi';

// Mock data for charts
const mockWeightData = [
  { date: '2023-01-01', value: 80 },
  { date: '2023-01-08', value: 79.5 },
  { date: '2023-01-15', value: 79 },
  { date: '2023-01-22', value: 78.2 },
  { date: '2023-01-29', value: 77.8 },
  { date: '2023-02-05', value: 77.5 },
  { date: '2023-02-12', value: 77.3 },
];

const mockBodyMeasurements = [
  { id: 'chest', name: 'Chest', unit: 'cm', history: [
    { date: '2023-01-01', value: 95 },
    { date: '2023-01-15', value: 95.5 },
    { date: '2023-02-01', value: 96 },
  ]},
  { id: 'waist', name: 'Waist', unit: 'cm', history: [
    { date: '2023-01-01', value: 82 },
    { date: '2023-01-15', value: 81 },
    { date: '2023-02-01', value: 80 },
  ]},
  { id: 'arms', name: 'Arms', unit: 'cm', history: [
    { date: '2023-01-01', value: 35 },
    { date: '2023-01-15', value: 35.5 },
    { date: '2023-02-01', value: 36 },
  ]},
];

const mockPersonalRecords = [
  { id: 'pr1', exerciseId: 'ex1', exerciseName: 'Bench Press', value: 100, unit: 'kg', date: '2023-01-20' },
  { id: 'pr2', exerciseId: 'ex2', exerciseName: 'Squat', value: 140, unit: 'kg', date: '2023-01-25' },
  { id: 'pr3', exerciseId: 'ex3', exerciseName: 'Deadlift', value: 160, unit: 'kg', date: '2023-02-05' },
];

const mockProgressPhotos = [
  { id: 'photo1', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', date: '2023-01-01', notes: 'Starting point' },
  { id: 'photo2', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', date: '2023-02-01', notes: 'One month progress' },
];

export default function ProgressPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAddMeasurementModal, setShowAddMeasurementModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // In a real app, we would fetch this data from Firebase
    setLoading(false);
  }, [currentUser, router]);

  // Simple chart component using divs
  const SimpleChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(item => item.value)) * 1.1;
    const minValue = Math.min(...data.map(item => item.value)) * 0.9;
    
    return (
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => {
          const height = ((item.value - minValue) / (maxValue - minValue)) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t-sm" 
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Progress Tracking</h1>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddMeasurementModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Measurement
          </button>
          <button
            onClick={() => setShowAddPhotoModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <FiCamera className="mr-2" />
            Add Photo
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'weight'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Weight
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'measurements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Body Measurements
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Personal Records
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Progress Photos
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Weight Trend</h2>
                  <button
                    onClick={() => setActiveTab('weight')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
                
                {mockWeightData.length > 0 ? (
                  <div>
                    <SimpleChart data={mockWeightData} />
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>Starting: {mockWeightData[0].value} kg</span>
                      <span>Current: {mockWeightData[mockWeightData.length - 1].value} kg</span>
                      <span>Change: {(mockWeightData[mockWeightData.length - 1].value - mockWeightData[0].value).toFixed(1)} kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No weight data recorded yet
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Recent Personal Records</h2>
                  <button
                    onClick={() => setActiveTab('records')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                
                {mockPersonalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {mockPersonalRecords.slice(0, 3).map(record => (
                      <div key={record.id} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{record.exerciseName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-lg font-bold">
                          {record.value} {record.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No personal records yet
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Progress Photos</h2>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                
                {mockProgressPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockProgressPhotos.map(photo => (
                      <div key={photo.id} className="relative">
                        <img 
                          src={photo.url} 
                          alt={`Progress photo from ${photo.date}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                          {new Date(photo.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No progress photos yet
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Weight Tab */}
          {activeTab === 'weight' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Weight History</h2>
                <button
                  onClick={() => setShowAddMeasurementModal(true)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  Add Weight
                </button>
              </div>
              
              {mockWeightData.length > 0 ? (
                <>
                  <div className="mb-6">
                    <SimpleChart data={mockWeightData} />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight (kg)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockWeightData.map((entry, index) => {
                          const prevValue = index > 0 ? mockWeightData[index - 1].value : entry.value;
                          const change = entry.value - prevValue;
                          
                          return (
                            <tr key={entry.date}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(entry.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {entry.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {index > 0 && (
                                  <span className={change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-500'}>
                                    {change > 0 ? '+' : ''}{change.toFixed(1)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No weight data recorded yet</p>
                  <button
                    onClick={() => setShowAddMeasurementModal(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add First Weight Entry
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Body Measurements</h2>
                <button
                  onClick={() => setShowAddMeasurementModal(true)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  Add Measurement
                </button>
              </div>
              
              {mockBodyMeasurements.length > 0 ? (
                <div className="space-y-8">
                  {mockBodyMeasurements.map(measurement => (
                    <div key={measurement.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-medium mb-4">{measurement.name}</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {measurement.name} ({measurement.unit})
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Change
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {measurement.history.map((entry, index) => {
                              const prevValue = index > 0 ? measurement.history[index - 1].value : entry.value;
                              const change = entry.value - prevValue;
                              
                              return (
                                <tr key={entry.date}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {entry.value}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {index > 0 && (
                                      <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}>
                                        {change > 0 ? '+' : ''}{change.toFixed(1)}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No body measurements recorded yet</p>
                  <button
                    onClick={() => setShowAddMeasurementModal(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add First Measurement
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Personal Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-6">Personal Records</h2>
              
              {mockPersonalRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exercise
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Record
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockPersonalRecords.map(record => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{record.exerciseName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold">
                            {record.value} {record.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No personal records yet. They will be automatically tracked when you log new workout bests.
                </div>
              )}
            </div>
          )}
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Progress Photos</h2>
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  Add Photo
                </button>
              </div>
              
              {mockProgressPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mockProgressPhotos.map(photo => (
                    <div key={photo.id} className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={`Progress photo from ${photo.date}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {new Date(photo.date).toLocaleDateString()}
                          </span>
                        </div>
                        {photo.notes && (
                          <p className="text-sm text-gray-600">{photo.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No progress photos yet</p>
                  <button
                    onClick={() => setShowAddPhotoModal(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiCamera className="mr-2" />
                    Add First Photo
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Add Measurement Modal - Simplified placeholder */}
      {showAddMeasurementModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowAddMeasurementModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Measurement</h3>
                <p className="text-gray-500 mb-4">This is a placeholder modal. In a real app, this would contain a form to add body measurements.</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddMeasurementModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Photo Modal - Simplified placeholder */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowAddPhotoModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Progress Photo</h3>
                <p className="text-gray-500 mb-4">This is a placeholder modal. In a real app, this would contain a form to upload progress photos.</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddPhotoModal(false)}
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

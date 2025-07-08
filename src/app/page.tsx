import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">GymRat</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">Track your workouts, monitor progress, and achieve your fitness goals</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
            Get Started
          </Link>
          <Link href="/login" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Program Management</h3>
              <p className="text-gray-600">Create and follow structured workout programs with exercises, sets, reps, and rest periods.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Logging</h3>
              <p className="text-gray-600">Fast, intuitive interface to log sets, reps, and weights during workouts.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Visual graphs showing strength progression over time and personal records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
          <p className="text-xl mb-8">Join GymRat today and take your training to the next level.</p>
          <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold"><span className="text-blue-400">Gym</span>Rat</h3>
            <p className="text-gray-400">© 2025 GymRat. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

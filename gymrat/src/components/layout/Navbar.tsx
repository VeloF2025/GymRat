'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/lib/store';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  const { user } = useUserStore();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed w-full z-20 top-0 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <span className="text-blue-600">Gym</span>Rat
          </span>
        </Link>
        
        <div className="flex md:order-2">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              
              <div className="relative">
                <button 
                  type="button" 
                  className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  {currentUser.photoURL ? (
                    <Image 
                      className="w-8 h-8 rounded-full"
                      src={currentUser.photoURL}
                      alt="User photo"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {(currentUser.displayName || currentUser.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                
                {/* User dropdown menu - can be expanded with JS */}
                <div 
                  className="hidden absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" 
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {currentUser.displayName || 'User'}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {currentUser.email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              
              <button 
                data-collapse-toggle="navbar-user" 
                type="button" 
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                aria-controls="navbar-user" 
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Login
              </Link>
              <Link href="/signup" className="hidden md:block text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="/dashboard" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/programs" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                Programs
              </Link>
            </li>
            <li>
              <Link href="/workouts" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                Workouts
              </Link>
            </li>
            <li>
              <Link href="/exercises" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                Exercises
              </Link>
            </li>
            <li>
              <Link href="/progress" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                Progress
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

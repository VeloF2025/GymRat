'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiCalendar, 
  FiList, 
  FiActivity, 
  FiSettings,
  FiUser,
  FiBarChart2,
  FiPlay
} from 'react-icons/fi';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <FiHome className="w-5 h-5" />
    },
    {
      name: 'Programs',
      href: '/programs',
      icon: <FiCalendar className="w-5 h-5" />
    },
    {
      name: 'Workouts',
      href: '/workouts',
      icon: <FiList className="w-5 h-5" />
    },
    {
      name: 'Active Workout',
      href: '/workout/active',
      icon: <FiPlay className="w-5 h-5" />
    },
    {
      name: 'Exercises',
      href: '/exercises',
      icon: <FiActivity className="w-5 h-5" />
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: <FiBarChart2 className="w-5 h-5" />
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: <FiUser className="w-5 h-5" />
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <FiSettings className="w-5 h-5" />
    }
  ];

  const handleClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={`${isMobile ? 'fixed inset-0 z-40 transform transition-transform ease-in-out duration-300' : 'hidden md:block'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 h-full`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center mb-5 p-2">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <span className="text-blue-600">Gym</span>Rat
          </span>
        </div>
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={handleClick}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

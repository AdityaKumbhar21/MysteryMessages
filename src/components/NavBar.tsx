"use client"

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { MessageSquare, LogOut, User as UserIcon, Home } from 'lucide-react'


const NavBar = () => {
    const {data: session} = useSession()
    const user: User = session?.user as User


  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300">
              Mystery Messages
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Dashboard Link */}
                <Link href="/dashboard">
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                  <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {user.username || user.email}
                  </span>
                </div>

                {/* Logout Button */}
                <Button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  variant="outline"
                  className="flex items-center space-x-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button 
                    variant="ghost"
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile User Info */}
        {session && (
          <div className="md:hidden mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {user.username || user.email}
                </span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


export default NavBar;
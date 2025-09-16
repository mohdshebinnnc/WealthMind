import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async() => {
    await checkUser()

    return (
        <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 px-4 py-2 shadow-md border-b'>
            <nav className='container mx-auto flex px-4 py-3 items-center justify-between'>
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={200} height={60} 
                        className='cursor-pointer h-12 w-auto object-contain'
                    />
                </Link>

                <div className='flex items-center space-x-4'>
                    <SignedIn>
                        <Link href="/dashboard" 
                            className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
                        >
                            <Button variant="outline">
                                <LayoutDashboard size={18}/>
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transaction/create">
                            <Button className="flex items-center gap-2">
                                <PenBox size={18}/>
                                <span className='hidden md:inline'>Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl='/dashboard'>
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                        {/* <SignUpButton/> */}
                            {/* <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                Sign Up
                            </button> */}
                        {/* </SignUpButton> */}
                    </SignedOut>
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: 'w-10 h-10',
                                    
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>
        </div>
    )
}

export default Header;

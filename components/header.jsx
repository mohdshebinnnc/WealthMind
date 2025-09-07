import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Header = () => {
  return (
    <div className='fixed top-0'>
        <nav>
            <Link href="/">
                <Image src="/logo.png" alt="Logo" width={200} height={60} 
                    className='cursor-pointer h-12 w-auto object-contain'
                />
            </Link>
        </nav>


        <SignedOut>
            <SignInButton/>
            <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                </button>
            </SignUpButton>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </div>
  )
}

export default Header;

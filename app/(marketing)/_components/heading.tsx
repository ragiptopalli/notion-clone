'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { SignInButton } from '@clerk/clerk-react';

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents & Plans. Unified. Welcome to
        <span className='underline'> Jottit</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Jottit is the perfect workspace <br />
        to jott down your work better and faster!
      </h3>
      {isLoading && (
        <div className='w-full flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href='/documents'>
            Enter Jottit <ArrowRight className='h-4 w-4 ml-2' />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button>
            Get Jottit free
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

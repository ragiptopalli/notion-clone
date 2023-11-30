'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { File } from 'lucide-react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { useUser } from '@clerk/clerk-react';
import { useSearch } from '@/hooks/use-search';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export const SearchCommand = () => {
  const router = useRouter();

  const { user } = useUser();
  const documents = useQuery(api.documents.getSearch);

  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, onClose, toggle } = useSearch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Jottit...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className='mr-2 text-[18px]'>{document.icon}</p>
              ) : (
                <File className='mr-2 h-4 w-4' />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
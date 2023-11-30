'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@clerk/clerk-react';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  isSearch?: boolean;
  level?: number;
  active?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
}

export const Item = ({
  id,
  documentIcon,
  isSearch,
  level = 0,
  active,
  expanded,
  onExpand,
  onClick,
  label,
  icon: Icon,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const createDocument = useMutation(api.documents.create);
  const archiveDocument = useMutation(api.documents.archive);

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleOnArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = archiveDocument({ id }).then(() =>
      router.push('/documents')
    );

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Moved to trash!',
      error: 'Failed to archive the note. Please try again!',
    });
  };

  const handleOnCreate = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = createDocument({
      title: 'Untitled',
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) {
        onExpand?.();
      }
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note. Please try again!',
    });
  };

  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {Boolean(id) && (
        <div
          onClick={handleExpand}
          role='button'
          className='h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
        >
          <ChevronIcon className='h-5 w-5 shrink-0 text-muted-foreground/50' />
        </div>
      )}

      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>
      ) : (
        <Icon className='shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground' />
      )}

      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>CTRL</span>K
        </kbd>
      )}

      {Boolean(id) && (
        <div className='ml-auto flex items-center gap-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role='button'
                className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
              >
                <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-60'
              align='start'
              side='right'
              forceMount
            >
              <DropdownMenuItem onClick={handleOnArchive}>
                <Trash className='h-4 w-4 mr-2' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className='text-xs text-muted-foreground p-2'>
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role='button'
            onClick={handleOnCreate}
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
          >
            <Plus className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className='flex gap-x-2 py-[3px]'
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
    >
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[30%]' />
    </div>
  );
};

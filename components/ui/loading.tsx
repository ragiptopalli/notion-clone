import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <Loader2 size={48} strokeWidth={1.25} />
    </div>
  );
};

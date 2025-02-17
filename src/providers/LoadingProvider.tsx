import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MegaLoading } from '../components/ui';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (isLoading: boolean, options?: LoadingOptions) => void;
};

type LoadingOptions = {
  title?: string;
  queueName?: string;
};

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: (_: boolean, __?: LoadingOptions) => {},
});

export const useLoadingContext = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [loadingQueue, setLoadingQueue] = useState<string[]>([]);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const setLoading = (isLoading: boolean, options?: LoadingOptions) => {
    const queueName = options?.queueName || 'generic';

    if (options?.title) {
      setTitle(options.title || '');
    }

    if (isLoading) {
      setLoadingQueue([...loadingQueue, queueName]);
      setIsLoading(true);
    } else {
      const newQueue = loadingQueue.filter((item) => item !== queueName);
      setLoadingQueue(newQueue);
      const newStatus = newQueue.length > 0;
      setIsLoading(newStatus);

      if (!newStatus && timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(undefined);
      }
    }
  };

  useEffect(() => {
    if (isLoading && !timeoutId) {
      const id = setTimeout(() => {
        setIsLoading(false);
        setLoadingQueue([]);

        if (timeoutId) {
          console.log('clearing loading timeout');
          clearTimeout(timeoutId);
          setTimeoutId(undefined);
        }
      }, 30000);

      setTimeoutId(id);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(undefined);
      }
    };
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      {isLoading && <MegaLoading title={title} />}
      {children}
    </LoadingContext.Provider>
  );
};

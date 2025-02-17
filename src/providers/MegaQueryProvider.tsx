import { createContext, PropsWithChildren } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  setLogger,
} from 'react-query';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  setLogger({
    log: console.log,
    warn: console.warn,
    error: console.error,
  });
}

const MegaQueryProviderContext = createContext({});

export const MegaQueryProvider = ({ children }: PropsWithChildren) => {
  // Create a client
  const queryClient = new QueryClient({
    queryCache: new QueryCache(),
    defaultOptions: {
      queries: {
        retry: (failureCount: number, error: any) => {
          if (((error.message as string) || '').includes('status code 401')) {
            return false;
          }

          if (failureCount >= 3) {
            return false;
          }

          return true;
        },
        retryDelay: 500,
        refetchOnWindowFocus: false,
        staleTime: 300000, // 5 mins
      },
    },
  });

  return (
    <MegaQueryProviderContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MegaQueryProviderContext.Provider>
  );
};

// lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Number of retries if a query fails
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
  },
});

export default queryClient;



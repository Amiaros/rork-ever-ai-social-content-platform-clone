// Mock trpc client for the app
import React from 'react';

export const trpc = {
  Provider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {},
  }),
  useMutation: () => [
    () => Promise.resolve({}),
    { isLoading: false, error: null },
  ],
};

export const trpcClient = {
  query: () => Promise.resolve({}),
  mutation: () => Promise.resolve({}),
};
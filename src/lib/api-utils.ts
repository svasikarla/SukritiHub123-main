import { supabase } from '@/integrations/supabase/client';
import { createLogger } from './logger';

const logger = createLogger({ module: 'API' });

/**
 * Standard response format for API requests
 */
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: 'success' | 'error';
}

/**
 * Wraps an async function to provide consistent error handling and response format
 * @param fn - Async function to wrap
 * @returns A function that returns a standardized ApiResponse
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<ApiResponse<T>> {
  return async (...args: Args): Promise<ApiResponse<T>> => {
    try {
      const data = await fn(...args);
      return { data, error: null, status: 'success' };
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      logger.error(`API Error: ${typedError.message}`, typedError);
      return { data: null, error: typedError, status: 'error' };
    }
  };
}

/**
 * Utility for making Supabase database queries with consistent error handling
 */
export const dbQuery = {
  /**
   * Executes a single table query with error handling
   * @param tableName - Name of the table to query
   * @param queryFn - Function that builds and executes the query
   * @returns Standardized response with data or error
   */
  async single<T>(
    tableName: string,
    queryFn: (query: ReturnType<typeof supabase.from>) => Promise<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> {
    try {
      const query = supabase.from(tableName);
      const { data, error } = await queryFn(query);
      
      if (error) {
        throw error;
      }
      
      return { data, error: null, status: 'success' };
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      logger.error(`Database query error (${tableName}): ${typedError.message}`, typedError);
      return { data: null, error: typedError, status: 'error' };
    }
  },
  
  /**
   * Executes multiple queries in parallel with consistent error handling
   * @param queries - Array of query functions that return promises
   * @returns Array of responses for each query
   */
  async batch<T extends any[]>(
    queries: Array<() => Promise<any>>
  ): Promise<Array<ApiResponse<any>>> {
    try {
      const results = await Promise.all(
        queries.map(async (queryFn) => {
          try {
            return { 
              data: await queryFn(), 
              error: null, 
              status: 'success' as const 
            };
          } catch (error) {
            const typedError = error instanceof Error ? error : new Error(String(error));
            logger.error(`Batch query error: ${typedError.message}`, typedError);
            return { 
              data: null, 
              error: typedError, 
              status: 'error' as const 
            };
          }
        })
      );
      
      return results;
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      logger.error(`Batch query execution error: ${typedError.message}`, typedError);
      
      // Return error for all queries
      return queries.map(() => ({
        data: null,
        error: typedError,
        status: 'error' as const
      }));
    }
  }
};

/**
 * Example usage:
 * 
 * // Single query
 * const { data, error } = await dbQuery.single('users', 
 *   (query) => query.select('*').eq('id', userId)
 * );
 * 
 * // Batch queries
 * const [usersResponse, postsResponse] = await dbQuery.batch([
 *   () => supabase.from('users').select('*').eq('id', userId),
 *   () => supabase.from('posts').select('*').eq('author_id', userId)
 * ]);
 */

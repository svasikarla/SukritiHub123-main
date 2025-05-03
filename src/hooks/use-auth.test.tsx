import { render, screen, act, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { createContext, useContext } from 'react';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      })),
      signInWithPassword: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(),
        in: jest.fn()
      }))
    }))
  }
}));

// Test component that uses the auth hook
function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="roles">{JSON.stringify(auth.roles)}</div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides authentication context to children', async () => {
    // Mock session data
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' }
        }
      }
    });

    // Mock user roles query
    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'user_roles') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{ role_id: 'role-1' }],
              error: null
            })
          })
        };
      }
      if (table === 'roles') {
        return {
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({
              data: [{ id: 'role-1', name: 'admin' }],
              error: null
            })
          })
        };
      }
      if (table === 'role_permissions') {
        return {
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({
              data: [],
              error: null
            })
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn(),
          in: jest.fn()
        })
      };
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Initially loading should be true
    expect(screen.getByTestId('loading').textContent).toBe('true');

    // Wait for auth state to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Check that user data is available
    expect(screen.getByTestId('user').textContent).not.toBe('null');
    expect(screen.getByTestId('user').textContent).toContain('test@example.com');

    // Check that roles are loaded
    expect(screen.getByTestId('roles').textContent).toContain('admin');
  });

  test('handles sign out correctly', async () => {
    // Mock successful sign out
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    // Mock initial auth state
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' }
        }
      }
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Wait for auth state to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Perform sign out
    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    // Verify sign out was called
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  test('handles authentication errors gracefully', async () => {
    // Mock session error
    (supabase.auth.getSession as jest.Mock).mockRejectedValue(new Error('Auth error'));

    // Suppress console errors for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Wait for loading to complete despite error
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // User should be null
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  test('throws error when used outside AuthProvider', () => {
    // Suppress console errors for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Expect error when rendering component that uses useAuth without AuthProvider
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});

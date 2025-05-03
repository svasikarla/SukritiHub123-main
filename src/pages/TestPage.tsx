import React from 'react';

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">This is a test page to verify routing is working correctly.</p>
        <p className="text-sm text-gray-500">If you can see this, the basic routing system is functioning.</p>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DebugInfo: React.FC = () => {
  const envVars = {
    'VITE_USE_MOCK_DATA': import.meta.env.VITE_USE_MOCK_DATA,
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'NODE_ENV': import.meta.env.NODE_ENV,
    'DEV': import.meta.env.DEV,
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Debug Information</span>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Development
          </Badge>
        </CardTitle>
        <CardDescription>
          Environment variables and configuration status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="font-mono text-sm font-medium">{key}</span>
              <Badge 
                variant={value === 'true' || value ? 'default' : 'secondary'}
                className={value === 'true' ? 'bg-green-100 text-green-800' : ''}
              >
                {String(value)}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-900 mb-2">Status:</h4>
          <p className="text-sm text-blue-800">
            {import.meta.env.VITE_USE_MOCK_DATA === 'true' 
              ? '✅ Mock authentication is ENABLED' 
              : '❌ Mock authentication is DISABLED - using real API'
            }
          </p>
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Create a <code>.env</code> file in the root directory</li>
            <li>Add <code>VITE_USE_MOCK_DATA=true</code></li>
            <li>Restart the development server</li>
            <li>Check this debug panel to confirm</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;

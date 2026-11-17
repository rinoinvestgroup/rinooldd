import { useEffect, useState } from 'react';
import Head from 'next/head';
import { isBraveBrowser, clearBraveCache, checkAppVersion, forceReloadInBrave } from '@/utils/braveCache';

export default function BraveCacheTest() {
  const [isBrave, setIsBrave] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const checkBrave = async () => {
      const brave = await isBraveBrowser();
      setIsBrave(brave);
      addLog(`Brave browser: ${brave ? 'Yes ✅' : 'No ❌'}`);
      
      if (brave) {
        const version = localStorage.getItem('app-version') || 'Not set';
        setAppVersion(version);
        addLog(`Current app version: ${version}`);
      }
    };
    
    checkBrave();
  }, []);

  const handleClearCache = async () => {
    addLog('Starting cache clear...');
    await clearBraveCache();
    setCacheCleared(true);
    addLog('Cache cleared successfully! ✅');
  };

  const handleCheckVersion = () => {
    const testVersion = '2026.02.26.999';
    const changed = checkAppVersion(testVersion);
    addLog(`Version check: ${changed ? 'Changed ⚠️' : 'Same ✅'}`);
    setAppVersion(testVersion);
  };

  const handleForceReload = async () => {
    addLog('Force reloading...');
    await forceReloadInBrave();
  };

  return (
    <>
      <Head>
        <title>Brave Cache Test | Rino Properties</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Brave Browser Cache Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Browser Detection</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Is Brave:</strong>{' '}
              <span className={isBrave ? 'text-green-600' : 'text-red-600'}>
                {isBrave ? 'Yes ✅' : 'No ❌'}
              </span>
            </p>
            <p className="text-lg">
              <strong>App Version:</strong> {appVersion || 'Not set'}
            </p>
            <p className="text-lg">
              <strong>Cache Cleared:</strong>{' '}
              <span className={cacheCleared ? 'text-green-600' : 'text-gray-600'}>
                {cacheCleared ? 'Yes ✅' : 'No'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleClearCache}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Clear Cache
            </button>
            <button
              onClick={handleCheckVersion}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Check Version
            </button>
            <button
              onClick={handleForceReload}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Force Reload
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Activity Log</h2>
          <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity yet...</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="mb-1">{log}</p>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open this page in Brave browser</li>
            <li>Check if Brave is detected correctly</li>
            <li>Click "Clear Cache" and check browser console</li>
            <li>Open DevTools → Application → Service Workers (should be empty)</li>
            <li>Open DevTools → Application → Cache Storage (should be empty)</li>
            <li>Click "Check Version" to test version management</li>
            <li>Click "Force Reload" to test emergency reload (Brave only)</li>
          </ol>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Browser Console Checks</h3>
          <p className="mb-2 text-gray-700">Open browser console and check for:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>✅ Service workers unregistered</li>
            <li>✅ Cache storage cleared</li>
            <li>✅ LocalStorage cleared (kept user preferences)</li>
            <li>Brave browser detected - clearing cache</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

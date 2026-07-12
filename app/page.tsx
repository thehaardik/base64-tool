'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) { setError('Enter text to process'); return; }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e: any) {
      setError(`Invalid input for ${mode}: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Base64 Tool</h1>
          <p className="text-xl text-gray-600">Encode and decode Base64 strings instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-semibold mb-3">Input</h2>
            <textarea className="w-full h-64 p-3 border rounded-lg font-mono text-sm" placeholder="Enter text to encode/decode..." value={input} onChange={(e) => setInput(e.target.value)} />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-lg border ${mode === 'encode' ? 'bg-blue-600 text-white' : ''}`}>Encode</button>
              <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-lg border ${mode === 'decode' ? 'bg-blue-600 text-white' : ''}`}>Decode</button>
              <button onClick={process} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-auto">Process</button>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Output</h2>
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-blue-600 hover:underline">Copy</button>
            </div>
            <pre className="h-64 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-auto text-sm font-mono break-all">{output || '// Result will appear here'}</pre>
          </div>
        </div>

        {error && <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>}
      </div>
    </main>
  );
}

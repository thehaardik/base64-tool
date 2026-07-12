'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processText = () => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);
    setFileType(file.type || 'unknown');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64 = result.split(',')[1] || result;
      setOutput(base64);
      setMode('encode');
    };
    reader.readAsDataURL(file);
  };

  const handleFileDownload = () => {
    if (!output || !fileName) return;

    try {
      const byteCharacters = atob(output);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decoded_${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(`Failed to decode file: ${e.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Base64 Tool</h1>
          <p className="text-xl text-gray-600">Encode and decode text and files to Base64 instantly</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('encode')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            Decode
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-semibold mb-4">
              {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
            </h2>

            <textarea
              className="w-full h-48 p-3 border rounded-lg font-mono text-sm mb-4"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={processText}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
            </button>

            {/* File Upload */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">
                {mode === 'encode' ? 'Or upload a file' : 'Or upload a Base64 file'}
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept={mode === 'encode' ? '*' : '.txt,.bin,.dat'}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              >
                <div className="text-slate-400 mb-2">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Click to upload file</p>
                <p className="text-sm text-gray-400 mt-1">Images, PDFs, Videos, Audio, Documents</p>
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}
              </h2>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <pre className="h-48 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-auto text-xs font-mono whitespace-pre-wrap break-all">
              {output || (mode === 'encode' ? '// Base64 output will appear here' : '// Decoded output will appear here')}
            </pre>

            {/* File Info */}
            {fileName && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{fileName}</p>
                    <p className="text-xs text-gray-500">{fileType}</p>
                  </div>
                  {output && mode === 'decode' && (
                    <button
                      onClick={handleFileDownload}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      Download File
                    </button>
                  )}
                </div>
                {output && (
                  <div className="mt-2 text-xs text-gray-500">
                    Base64 size: {formatSize(output.length)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Supported Formats */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-3">Supported File Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">Images</p>
              <p className="text-gray-500 text-xs">JPG, PNG, GIF, WebP, SVG</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">Documents</p>
              <p className="text-gray-500 text-xs">PDF, DOCX, XLSX, TXT</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">Video</p>
              <p className="text-gray-500 text-xs">MP4, WebM, AVI, MOV</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">Audio</p>
              <p className="text-gray-500 text-xs">MP3, WAV, OGG, AAC</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

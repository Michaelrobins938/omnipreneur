import React, { useState } from 'react';
import Head from 'next/head';
import ToolsLayout from '../../components/ToolsLayout';
import { FileText, ChevronRight, AlertCircle } from 'lucide-react';

const ReadFilePage = () => {
  const [filePath, setFilePath] = useState('');
  const [startLine, setStartLine] = useState('');
  const [endLine, setEndLine] = useState('');
  const [readEntireFile, setReadEntireFile] = useState(false);

  return (
    <ToolsLayout currentTool="read-file">
      <Head>
        <title>Read File | Development Tools</title>
        <meta name="description" content="View and analyze file contents with line number precision" />
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#2D1A45] mb-4">Read File</h1>
          <p className="text-gray-600 text-lg">
            View and analyze file contents with precise line number control. Perfect for understanding
            specific code sections or debugging issues.
          </p>
        </div>

        {/* File Reader Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">File Path</span>
              <div className="relative">
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="src/components/App.tsx"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D1A45] focus:border-transparent transition-shadow pl-12"
                />
                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </label>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="readEntire"
                checked={readEntireFile}
                onChange={(e) => setReadEntireFile(e.target.checked)}
                className="rounded border-gray-300 text-[#2D1A45] focus:ring-[#2D1A45]"
              />
              <label htmlFor="readEntire" className="ml-2 text-gray-700">
                Read entire file
              </label>
            </div>

            {!readEntireFile && (
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700 font-medium mb-2 block">Start Line</span>
                  <input
                    type="number"
                    value={startLine}
                    onChange={(e) => setStartLine(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D1A45] focus:border-transparent transition-shadow"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-medium mb-2 block">End Line</span>
                  <input
                    type="number"
                    value={endLine}
                    onChange={(e) => setEndLine(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D1A45] focus:border-transparent transition-shadow"
                  />
                </label>
              </div>
            )}
          </div>

          <button className="w-full bg-[#2D1A45] text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2">
            <ChevronRight size={20} />
            <span>Read File</span>
          </button>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2D1A45] mb-6">Important Notes</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-yellow-900">Line Number Limits</h3>
                <p className="text-yellow-800 mt-1">
                  You can view between 200-250 lines at a time. For larger sections, make multiple calls
                  or consider reading the entire file.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-blue-900">Complete Context</h3>
                <p className="text-blue-800 mt-1">
                  Always ensure you have sufficient context by checking lines before and after your target section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Usage */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2D1A45] mb-6">Example Usage</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">Reading Function Implementation</div>
              <div className="text-gray-600 mt-2">
                Specify the exact lines where a function is implemented to understand its logic
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">Debugging Issues</div>
              <div className="text-gray-600 mt-2">
                View the specific section of code where an error is occurring
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">Configuration Analysis</div>
              <div className="text-gray-600 mt-2">
                Read configuration files to understand system settings and dependencies
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolsLayout>
  );
};

export default ReadFilePage; 
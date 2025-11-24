
import React, { useState, useRef } from 'react';
import { Upload, Send, FileText, X, Loader2, MessageSquare, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface Message {
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp?: Date;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  preview: string;
}

export default function ChatPDF() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      // Create a mock preview URL (not used for react-pdf, but keeping for consistency)
      const previewUrl = URL.createObjectURL(file);

      setUploadedFile({
        file,
        name: file.name,
        size: file.size,
        preview: previewUrl
      });

      setMessages([{
        type: 'system',
        content: `Successfully uploaded "${file.name}". You can now ask questions about the document.`,
        timestamp: new Date()
      }]);

      setCurrentPage(1);
      setTotalPages(0);
      setZoomLevel(100);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    setMessages([]);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !uploadedFile) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        type: 'ai',
        content: 'This is a placeholder response. In production, this would be the RAG-based answer from your backend analyzing the PDF content.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 via-blue-900 to-slate-800 shadow-lg">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <FileText className="w-7 h-7 text-red-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ChatPDF
                </h1>
                <p className="text-xs text-red-200">AI-Powered Document Analysis</p>
              </div>
            </div>
            {uploadedFile && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">{uploadedFile.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* PDF Preview Section */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 h-full flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Preview
                </h2>
              </div>

              {!uploadedFile ? (
                <div className="flex-1 p-6 flex items-center justify-center">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`w-full h-full border-3 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center ${isDragging
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-full mb-4">
                      <Upload className="w-10 h-10 text-red-800" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload PDF Document</h3>
                    <p className="text-slate-600 mb-1 text-sm">Drag & drop your PDF here</p>
                    <p className="text-slate-500 text-xs mb-4">or</p>
                    <label className="inline-block">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <span className="px-6 py-2.5 bg-gradient-to-r from-red-800 to-orange-600 hover:from-red-700 hover:to-orange-500 text-white rounded-lg cursor-pointer inline-block transition-all font-medium shadow-md hover:shadow-lg">
                        Browse Files
                      </span>
                    </label>
                    <p className="text-xs text-slate-500 mt-4">Maximum file size: 10MB</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* PDF Controls */}
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleZoomOut}
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition-colors"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium text-slate-700 min-w-[50px] text-center">
                          {zoomLevel}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition-colors"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition-colors"
                        title="Remove File"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium text-slate-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* PDF Preview Area */}
                  <div className="flex-1 overflow-auto bg-slate-100 p-4">
                    <div
                      className="bg-white shadow-lg mx-auto rounded-lg border border-slate-200"
                      style={{
                        width: 'fit-content'
                        
                      }}
                    >
                      <Document
                        file={uploadedFile.file}
                        onLoadSuccess={onDocumentLoadSuccess}
                          loading={
                            <div className="text-center p-8 h-full w-full">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                              <p className="mt-4 text-gray-600">Loading PDF...</p>
                            </div>
                          }
                      >
                        <Page
                          pageNumber={currentPage}
                          scale={zoomLevel / 100}
                            loading={
                              <div className="text-center p-8 h-full w-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading page...</p>
                              </div>
                            }                        />
                      </Document>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Size:</span>
                        <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Pages:</span>
                        <span>{totalPages}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-medium">Ready for analysis</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 h-full flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-900 to-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Chat with Document</h2>
                      <p className="text-xs text-blue-200">Ask questions about your PDF</p>
                    </div>
                  </div>
                  {messages.length > 1 && (
                    <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
                      {messages.filter(m => m.type !== 'system').length} messages
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {messages.length === 0 && !uploadedFile && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                        <Upload className="w-10 h-10 text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">
                        Get Started with ChatPDF
                      </h3>
                      <p className="text-slate-600 mb-4">
                        Upload a PDF document to begin analyzing and asking questions about its content
                      </p>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-700 mb-2">You can ask things like:</p>
                        <ul className="text-xs text-slate-600 space-y-1 text-left">
                          <li>• "Summarize this document"</li>
                          <li>• "What are the main points discussed?"</li>
                          <li>• "Find information about [topic]"</li>
                          <li>• "Explain the conclusion section"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-5 py-3 shadow-md ${message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white'
                          : message.type === 'ai'
                            ? 'bg-white text-slate-800 border-2 border-slate-200'
                            : 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-900 border border-orange-200'
                        }`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                          <div className="bg-gradient-to-br from-red-800 to-orange-600 p-1 rounded">
                            <MessageSquare className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      {message.timestamp && (
                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                          }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white border-2 border-slate-200 rounded-xl px-5 py-3 shadow-md">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                        <span className="text-sm text-slate-700">Analyzing your question...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-white px-6 py-4 border-t-2 border-slate-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={uploadedFile ? "Ask a question about the PDF..." : "Upload a PDF to start chatting..."}
                    disabled={!uploadedFile}
                    className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg px-5 py-3 border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!uploadedFile || !inputMessage.trim() || isProcessing}
                    className="bg-gradient-to-r from-red-800 to-orange-600 hover:from-red-700 hover:to-orange-500 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg px-8 py-3 transition-all disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
                {uploadedFile && (
                  <p className="text-xs text-slate-500 mt-2">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
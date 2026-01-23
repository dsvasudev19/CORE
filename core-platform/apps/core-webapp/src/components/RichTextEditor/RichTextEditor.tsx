import { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link,
    Image,
    Video,
    Code,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Type,
    Palette,
    Highlighter,
    Undo,
    Redo,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...', minHeight = '300px' }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateContent();
    };

    const updateContent = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertLink = () => {
        if (linkUrl) {
            const text = linkText || linkUrl;
            execCommand('insertHTML', `<a href="${linkUrl}" target="_blank" class="text-blue-600 underline">${text}</a>`);
            setLinkUrl('');
            setLinkText('');
            setShowLinkModal(false);
        }
    };

    const insertImage = () => {
        if (imageUrl) {
            execCommand('insertHTML', `<img src="${imageUrl}" alt="Image" class="max-w-full h-auto my-2 rounded" />`);
            setImageUrl('');
            setShowImageModal(false);
        }
    };

    const insertVideo = () => {
        if (videoUrl) {
            // Support YouTube, Vimeo, and direct video URLs
            let embedCode = '';
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = videoUrl.includes('youtu.be')
                    ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                    : videoUrl.split('v=')[1]?.split('&')[0];
                embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="my-2 rounded"></iframe>`;
            } else if (videoUrl.includes('vimeo.com')) {
                const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
                embedCode = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen class="my-2 rounded"></iframe>`;
            } else {
                embedCode = `<video controls class="max-w-full h-auto my-2 rounded"><source src="${videoUrl}" /></video>`;
            }
            execCommand('insertHTML', embedCode);
            setVideoUrl('');
            setShowVideoModal(false);
        }
    };

    const setFontSize = (size: string) => {
        execCommand('fontSize', size);
    };

    const setTextColor = (color: string) => {
        execCommand('foreColor', color);
    };

    const setBackgroundColor = (color: string) => {
        execCommand('backColor', color);
    };

    const toolbarButtons = [
        {
            group: 'text',
            buttons: [
                { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
                { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
                { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
                { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
            ],
        },
        {
            group: 'headings',
            buttons: [
                { icon: Heading1, command: 'formatBlock', value: '<h1>', title: 'Heading 1' },
                { icon: Heading2, command: 'formatBlock', value: '<h2>', title: 'Heading 2' },
                { icon: Heading3, command: 'formatBlock', value: '<h3>', title: 'Heading 3' },
                { icon: Type, command: 'formatBlock', value: '<p>', title: 'Paragraph' },
            ],
        },
        {
            group: 'align',
            buttons: [
                { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
                { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
                { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
                { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
            ],
        },
        {
            group: 'lists',
            buttons: [
                { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
                { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
            ],
        },
        {
            group: 'insert',
            buttons: [
                { icon: Link, action: () => setShowLinkModal(true), title: 'Insert Link' },
                { icon: Image, action: () => setShowImageModal(true), title: 'Insert Image' },
                { icon: Video, action: () => setShowVideoModal(true), title: 'Insert Video' },
                { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code Block' },
                { icon: Quote, command: 'formatBlock', value: '<blockquote>', title: 'Quote' },
            ],
        },
        {
            group: 'history',
            buttons: [
                { icon: Undo, command: 'undo', title: 'Undo (Ctrl+Z)' },
                { icon: Redo, command: 'redo', title: 'Redo (Ctrl+Y)' },
            ],
        },
    ];

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                {toolbarButtons.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex gap-1 border-r border-gray-300 pr-2 last:border-r-0">
                        {group.buttons.map((btn, btnIdx) => (
                            <button
                                key={btnIdx}
                                type="button"
                                onClick={() => {
                                    if (btn.action) {
                                        btn.action();
                                    } else if (btn.value) {
                                        execCommand(btn.command, btn.value);
                                    } else {
                                        execCommand(btn.command);
                                    }
                                }}
                                title={btn.title}
                                className="p-2 hover:bg-gray-200 rounded transition-colors"
                            >
                                <btn.icon size={16} className="text-gray-700" />
                            </button>
                        ))}
                    </div>
                ))}

                {/* Font Size */}
                <select
                    onChange={(e) => setFontSize(e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                    defaultValue="3"
                >
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Huge</option>
                </select>

                {/* Text Color */}
                <div className="flex items-center gap-1">
                    <Palette size={16} className="text-gray-700" />
                    <input
                        type="color"
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 border-0 cursor-pointer"
                        title="Text Color"
                    />
                </div>

                {/* Background Color */}
                <div className="flex items-center gap-1">
                    <Highlighter size={16} className="text-gray-700" />
                    <input
                        type="color"
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 border-0 cursor-pointer"
                        title="Background Color"
                    />
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                onBlur={updateContent}
                className="p-4 outline-none prose max-w-none"
                style={{ minHeight }}
                data-placeholder={placeholder}
            />

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Text
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Enter link text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertLink}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertImage}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Insert Video</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video URL
                            </label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="YouTube, Vimeo, or direct video URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Supports YouTube, Vimeo, and direct video URLs
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowVideoModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertVideo}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
                
                [contenteditable] h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.67em 0;
                }
                
                [contenteditable] h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.75em 0;
                }
                
                [contenteditable] h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin: 0.83em 0;
                }
                
                [contenteditable] p {
                    margin: 1em 0;
                }
                
                [contenteditable] blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1em;
                    margin: 1em 0;
                    color: #6b7280;
                }
                
                [contenteditable] pre {
                    background-color: #f3f4f6;
                    padding: 1em;
                    border-radius: 0.375rem;
                    overflow-x: auto;
                    font-family: monospace;
                }
                
                [contenteditable] ul, [contenteditable] ol {
                    margin: 1em 0;
                    padding-left: 2em;
                }
                
                [contenteditable] a {
                    color: #2563eb;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;

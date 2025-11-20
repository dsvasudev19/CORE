import React, { useState, useRef, useEffect } from 'react';
import {
  StickyNote, Type, Square, Circle, Trash2,  ZoomIn, ZoomOut,
  Hand, Edit3 , MousePointer2,
  Bold, Italic, Underline, List, ListOrdered,  
   ChevronDown, Minus, Copy, Layers, Lock, Unlock, 
  ChevronUp, Menu
} from 'lucide-react';

interface Style {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface ContentLine {
  type: 'paragraph' | 'heading' | 'bullet' | 'numbered';
  text: string;
  style: Style;
}

interface Item {
  id: string;
  type: 'note' | 'text' | 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: ContentLine[];
  color: string;
  fontSize: number;
  locked: boolean;
  rotation: number;
  zIndex: number;
  column?: string;
  storyPoints?: number;
}

interface Column {
  id: string;
  title: string;
  width: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  color: string;
}

interface ContextMenuPosition {
  x: number;
  y: number;
  itemId: string;
}

interface ResizeStart {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AdvancedMiroBoard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      type: 'note',
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      content: [
        { type: 'paragraph', text: 'Welcome to the board!', style: { bold: false, italic: false, underline: false } }
      ],
      color: 'bg-yellow-200',
      fontSize: 14,
      locked: false,
      rotation: 0,
      zIndex: 1,
      column: 'backlog',
      storyPoints: 5
    },
    {
      id: '2',
      type: 'note',
      x: 400,
      y: 150,
      width: 250,
      height: 200,
      content: [
        { type: 'heading', text: 'Task List', style: { bold: true } },
        { type: 'bullet', text: 'Drag me around', style: {} },
        { type: 'bullet', text: 'Double-click to edit', style: {} },
        { type: 'bullet', text: 'Add formatting', style: { bold: true } }
      ],
      color: 'bg-pink-200',
      fontSize: 14,
      locked: false,
      rotation: 0,
      zIndex: 2,
      column: 'todo',
      storyPoints: 8
    }
  ]);
  const [columns] = useState<Column[]>([
    { id: 'backlog', title: 'Backlog', width: 250 },
    { id: 'todo', title: 'To Do', width: 250 },
    { id: 'inprogress', title: 'In Progress', width: 250 },
    { id: 'review', title: 'Review', width: 250 },
    { id: 'done', title: 'Done', width: 250 }
  ]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | 'note' | 'text' | 'rectangle' | 'circle' | 'connector'>('select');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [draggingItem, setDraggingItem] = useState<Item | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewOffset, setViewOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<ContentLine[]>([]);
  const [editingStoryPoints, setEditingStoryPoints] = useState<number>(0);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<ContextMenuPosition | null>(null);
  const [resizingItem, setResizingItem] = useState<Item | null>(null);
  const [, setResizeStart] = useState<ResizeStart>({ x: 0, y: 0, width: 0, height: 0 });
  const [, setIsDrawingConnection] = useState<boolean>(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const colors: { name: string; class: string }[] = [
    { name: 'Yellow', class: 'bg-yellow-200' },
    { name: 'Pink', class: 'bg-pink-200' },
    { name: 'Blue', class: 'bg-blue-200' },
    { name: 'Green', class: 'bg-green-200' },
    { name: 'Purple', class: 'bg-purple-200' },
    { name: 'Orange', class: 'bg-orange-200' },
    { name: 'Red', class: 'bg-red-200' },
    { name: 'Teal', class: 'bg-teal-200' }
  ];
  const shapeColors: { name: string; class: string }[] = [
    { name: 'Blue', class: 'bg-blue-300' },
    { name: 'Green', class: 'bg-green-300' },
    { name: 'Red', class: 'bg-red-300' },
    { name: 'Purple', class: 'bg-purple-300' },
    { name: 'Orange', class: 'bg-orange-300' },
    { name: 'Yellow', class: 'bg-yellow-300' },
    { name: 'Gray', class: 'bg-gray-300' }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedItems.length > 0) {
        e.preventDefault();
        handleCopy();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }
      if (e.key === 'Delete' && selectedItems.length > 0 && !editingItem) {
        e.preventDefault();
        handleDelete();
      }
      if (e.key === 'Escape') {
        setSelectedItems([]);
        setEditingItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, editingItem]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getColumnFromX = (x: number): string => {
    let currentPos = 0;
    for (const col of columns) {
      if (x >= currentPos && x < currentPos + col.width) {
        return col.id;
      }
      currentPos += col.width;
    }
    return 'backlog';
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isCanvasOrGrid = e.target === canvasRef.current ||
                          target.classList.contains('grid-background') ||
                          target.classList.contains('canvas-content');
   
    if (!isCanvasOrGrid) return;
   
    setShowContextMenu(null);
    setSelectedItems([]);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewOffset.x) / zoom;
    const y = (e.clientY - rect.top - viewOffset.y) / zoom;
    if (selectedTool === 'note') {
      addItem('note', x, y);
    } else if (selectedTool === 'text') {
      addItem('text', x, y);
    } else if (selectedTool === 'rectangle') {
      addItem('rectangle', x, y);
    } else if (selectedTool === 'circle') {
      addItem('circle', x, y);
    } else if (selectedTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
    }
  };

  const addItem = (type: Item['type'], x: number, y: number): void => {
    const newItem: Item = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width: type === 'note' ? 250 : type === 'text' ? 300 : type === 'circle' ? 150 : 200,
      height: type === 'note' ? 200 : type === 'text' ? 100 : type === 'circle' ? 150 : 150,
      content: type === 'note' || type === 'text' ? [{ type: 'paragraph', text: type === 'note' ? 'New note' : 'Enter text here', style: {} }] : undefined,
      color: type === 'note' ? 'bg-yellow-200' : type === 'text' ? 'bg-transparent' : 'bg-blue-300',
      fontSize: 14,
      locked: false,
      rotation: 0,
      zIndex: Math.max(...items.map(i => i.zIndex), 0) + 1,
      column: 'backlog',
      storyPoints: type === 'note' ? 1 : undefined
    };
    setItems([...items, newItem]);
    setSelectedTool('select');
    setSelectedItems([newItem.id]);
  };

  const handleItemMouseDown = (e: React.MouseEvent<HTMLDivElement>, item: Item): void => {
    e.stopPropagation();
    if (item.locked) return;
   
    if (selectedTool === 'connector') {
      if (!connectionStart) {
        setConnectionStart(item.id);
        setIsDrawingConnection(true);
      } else {
        addConnection(connectionStart, item.id);
        setConnectionStart(null);
        setIsDrawingConnection(false);
      }
      return;
    }
    if (selectedTool !== 'select' && selectedTool !== 'pan') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left - viewOffset.x) / zoom - item.x;
    const offsetY = (e.clientY - rect.top - viewOffset.y) / zoom - item.y;
    setDraggingItem(item);
    setDragOffset({ x: offsetX, y: offsetY });
    if (!selectedItems.includes(item.id)) {
      if (e.shiftKey) {
        setSelectedItems([...selectedItems, item.id]);
      } else {
        setSelectedItems([item.id]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (draggingItem && !draggingItem.locked) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const newX = (e.clientX - rect.left - viewOffset.x) / zoom - dragOffset.x;
      const newY = (e.clientY - rect.top - viewOffset.y) / zoom - dragOffset.y;
      const deltaX = newX - draggingItem.x;
      const deltaY = newY - draggingItem.y;
      setItems(prevItems => prevItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, x: item.x + deltaX, y: item.y + deltaY };
        }
        return item;
      }));
      setDraggingItem({ ...draggingItem, x: newX, y: newY });
    }
    if (resizingItem) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = (e.clientX - rect.left - viewOffset.x) / zoom;
      const mouseY = (e.clientY - rect.top - viewOffset.y) / zoom;
      const newWidth = Math.max(100, mouseX - resizingItem.x);
      const newHeight = Math.max(80, mouseY - resizingItem.y);
      setItems(prevItems => prevItems.map(item =>
        item.id === resizingItem.id
          ? { ...item, width: newWidth, height: newHeight }
          : item
      ));
    }
    if (isPanning && selectedTool === 'pan') {
      setViewOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = (): void => {
    setDraggingItem(null);
    setResizingItem(null);
    setIsPanning(false);

    // Snap to columns on drop
    if (selectedItems.length > 0) {
      setItems(prevItems => prevItems.map(item => {
        if (selectedItems.includes(item.id)) {
          const newColumn = getColumnFromX(item.x);
          return { ...item, column: newColumn };
        }
        return item;
      }));
    }
  };

  const handleItemMouseEnter = (itemId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItemId(itemId);
  };

  const handleItemMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 200);
  };

  const handleDoubleClick = (item: Item, e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>): void => {
    e.stopPropagation();
    if (item.locked || !item.content) return;
    setEditingItem(item.id);
    setEditingContent([...item.content]);
    setEditingStoryPoints(item.storyPoints || 0);
    setCurrentLineIndex(0);
  };

  const updateEditingContent = (index: number, updates: Partial<ContentLine>): void => {
    const newContent = [...editingContent];
    newContent[index] = { ...newContent[index], ...updates };
    setEditingContent(newContent);
  };

  const addNewLine = (index: number, lineType: ContentLine['type'] = 'paragraph'): void => {
    const newContent = [...editingContent];
    newContent.splice(index + 1, 0, { type: lineType, text: '', style: {} });
    setEditingContent(newContent);
    setCurrentLineIndex(index + 1);
  };

  const deleteLine = (index: number): void => {
    if (editingContent.length === 1) return;
    const newContent = editingContent.filter((_, i) => i !== index);
    setEditingContent(newContent);
    setCurrentLineIndex(Math.max(0, index - 1));
  };

  const toggleStyle = (styleKey: keyof Style): void => {
    const currentLine = editingContent[currentLineIndex];
    updateEditingContent(currentLineIndex, {
      style: { ...currentLine.style, [styleKey]: !(currentLine.style[styleKey] ?? false) }
    });
  };

  const changeLineType = (type: ContentLine['type']): void => {
    updateEditingContent(currentLineIndex, { type });
  };

  const saveEditing = (): void => {
    if (editingItem) {
      setItems(prevItems => prevItems.map(item =>
        item.id === editingItem
          ? { ...item, content: editingContent.filter(line => line.text.trim() !== ''), storyPoints: editingStoryPoints }
          : item
      ));
      setEditingItem(null);
      setEditingContent([]);
      setEditingStoryPoints(0);
    }
  };

  const handleDelete = (): void => {
    setItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
    setConnections(prevConnections => prevConnections.filter(conn =>
      !selectedItems.includes(conn.from) && !selectedItems.includes(conn.to)
    ));
    setSelectedItems([]);
  };

  const handleCopy = (): void => {
    const itemsToCopy = items.filter(item => selectedItems.includes(item.id));
    localStorage.setItem('copiedItems', JSON.stringify(itemsToCopy));
  };

  const handlePaste = (): void => {
    const copiedItems = localStorage.getItem('copiedItems');
    if (copiedItems) {
      const parsed = JSON.parse(copiedItems) as Item[];
      const newItems = parsed.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        x: item.x + 20,
        y: item.y + 20,
        zIndex: Math.max(...items.map(i => i.zIndex), 0) + 1
      }));
      setItems(prevItems => [...prevItems, ...newItems]);
      setSelectedItems(newItems.map(item => item.id));
    }
  };

  const bringToFront = (): void => {
    const maxZ = Math.max(...items.map(i => i.zIndex), 0);
    setItems(prevItems => prevItems.map(item =>
      selectedItems.includes(item.id) ? { ...item, zIndex: maxZ + 1 } : item
    ));
  };

  const sendToBack = (): void => {
    const minZ = Math.min(...items.map(i => i.zIndex), 0);
    setItems(prevItems => prevItems.map(item =>
      selectedItems.includes(item.id) ? { ...item, zIndex: minZ - 1 } : item
    ));
  };

  const toggleLock = (): void => {
    setItems(prevItems => prevItems.map(item =>
      selectedItems.includes(item.id) ? { ...item, locked: !item.locked } : item
    ));
  };

  const duplicateItems = (): void => {
    const itemsToDuplicate = items.filter(item => selectedItems.includes(item.id));
    const newItems = itemsToDuplicate.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(),
      x: item.x + 20,
      y: item.y + 20,
      zIndex: Math.max(...items.map(i => i.zIndex), 0) + 1
    }));
    setItems(prevItems => [...prevItems, ...newItems]);
    setSelectedItems(newItems.map(item => item.id));
  };

  const addConnection = (fromId: string, toId: string): void => {
    setConnections(prevConnections => [...prevConnections, {
      id: Date.now().toString(),
      from: fromId,
      to: toId,
      color: 'stroke-gray-600'
    }]);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, item: Item): void => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    setShowContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      itemId: item.id
    });
    if (!selectedItems.includes(item.id)) {
      setSelectedItems([item.id]);
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, item: Item): void => {
    e.stopPropagation();
    if (item.locked) return;
    setResizingItem(item);
    setResizeStart({ x: item.x, y: item.y, width: item.width, height: item.height });
  };

  const renderContent = (content: ContentLine[], fontSize: number) => {
    return content.map((line, idx) => {
      const style = {
        fontWeight: line.style.bold ? 'bold' : 'normal',
        fontStyle: line.style.italic ? 'italic' : 'normal',
        textDecoration: line.style.underline ? 'underline' : 'none',
        fontSize: line.type === 'heading' ? `${fontSize + 4}px` : `${fontSize}px`,
        marginBottom: '4px'
      };
      if (line.type === 'bullet') {
        return (
          <div key={idx} style={style} className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span className="flex-1">{line.text}</span>
          </div>
        );
      } else if (line.type === 'numbered') {
        return (
          <div key={idx} style={style} className="flex items-start gap-2">
            <span>{idx + 1}.</span>
            <span className="flex-1">{line.text}</span>
          </div>
        );
      } else if (line.type === 'heading') {
        return <div key={idx} style={style} className="font-bold mb-2">{line.text}</div>;
      } else {
        return <div key={idx} style={style}>{line.text}</div>;
      }
    });
  };

  const handleQuickActionsMouseEnter = (itemId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItemId(itemId);
  };

  const handleQuickActionsMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 200);
  };

  const handleColorPickerMouseEnter = (itemId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItemId(itemId);
  };

  const handleColorPickerMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 200);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Main Toolbar */}
      <div className="bg-white border-b border-gray-300 p-2 flex items-center gap-2 shadow-sm">
        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className="p-2 hover:bg-gray-100 rounded lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className={`${showToolbar ? 'flex' : 'hidden lg:flex'} flex-wrap items-center gap-2`}>
          {/* Selection Tools */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => setSelectedTool('select')}
              className={`p-2 rounded transition-colors ${selectedTool === 'select' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              <MousePointer2 size={18} />
            </button>
            <button
              onClick={() => setSelectedTool('pan')}
              className={`p-2 rounded transition-colors ${selectedTool === 'pan' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Pan"
            >
              <Hand size={18} />
            </button>
          </div>
          {/* Create Tools */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => setSelectedTool('note')}
              className={`p-2 rounded transition-colors ${selectedTool === 'note' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Sticky Note"
            >
              <StickyNote size={18} />
            </button>
            <button
              onClick={() => setSelectedTool('text')}
              className={`p-2 rounded transition-colors ${selectedTool === 'text' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Text"
            >
              <Type size={18} />
            </button>
            <button
              onClick={() => setSelectedTool('rectangle')}
              className={`p-2 rounded transition-colors ${selectedTool === 'rectangle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Rectangle"
            >
              <Square size={18} />
            </button>
            <button
              onClick={() => setSelectedTool('circle')}
              className={`p-2 rounded transition-colors ${selectedTool === 'circle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Circle"
            >
              <Circle size={18} />
            </button>
            <button
              onClick={() => setSelectedTool('connector')}
              className={`p-2 rounded transition-colors ${selectedTool === 'connector' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Connector"
            >
              <Minus size={18} className="rotate-45" />
            </button>
          </div>
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-medium min-w-[45px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
          </div>
          {/* Item Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <button onClick={duplicateItems} className="p-2 rounded hover:bg-gray-100" title="Duplicate">
                <Copy size={18} />
              </button>
              <button onClick={toggleLock} className="p-2 rounded hover:bg-gray-100" title="Lock/Unlock">
                {items.find(i => selectedItems.includes(i.id))?.locked ? <Lock size={18} /> : <Unlock size={18} />}
              </button>
              <button onClick={bringToFront} className="p-2 rounded hover:bg-gray-100" title="Bring to Front">
                <Layers size={18} />
              </button>
              <button onClick={handleDelete} className="p-2 rounded hover:bg-red-100 text-red-600" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="ml-auto text-xs text-gray-600 hidden md:block">
          Items: {items.length} | Selected: {selectedItems.length}
        </div>
      </div>
      {/* Editor Toolbar */}
      {editingItem && (
        <div className="bg-blue-50 border-b border-blue-200 p-2 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border-r border-blue-300 pr-2">
            <button
              onClick={() => toggleStyle('bold')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.style.bold ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => toggleStyle('italic')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.style.italic ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => toggleStyle('underline')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.style.underline ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <Underline size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 border-r border-blue-300 pr-2">
            <button
              onClick={() => changeLineType('paragraph')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.type === 'paragraph' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <Type size={16} />
            </button>
            <button
              onClick={() => changeLineType('heading')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.type === 'heading' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <Type size={18} className="font-bold" />
            </button>
            <button
              onClick={() => changeLineType('bullet')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.type === 'bullet' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => changeLineType('numbered')}
              className={`p-1.5 rounded ${editingContent[currentLineIndex]?.type === 'numbered' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
            >
              <ListOrdered size={16} />
            </button>
          </div>
          <button
            onClick={saveEditing}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            Done Editing
          </button>
          <span className="text-xs text-blue-700 ml-2">
            Press Enter for new line, Backspace on empty line to delete
          </span>
        </div>
      )}
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: selectedTool === 'pan' ? (isPanning ? 'grabbing' : 'grab') :
                  selectedTool === 'select' ? 'default' : 'crosshair'
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none grid-background"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${viewOffset.x}px ${viewOffset.y}px`
          }}
        />
        {/* Canvas Content */}
        <div
          className="canvas-content relative"
          style={{
            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            width: '8000px',
            height: '8000px'
          }}
        >
          {/* Column Headers */}
          <div className="absolute top-[-60px] left-0 w-full h-12 flex items-center border-b border-gray-300 bg-white z-10 pointer-events-none">
            {columns.map(col => (
              <div
                key={col.id}
                className="flex-shrink-0 flex items-center justify-center min-h-full border-r border-gray-300 bg-gray-50 text-sm font-medium text-gray-700"
                style={{ width: `${col.width}px` }}
              >
                {col.title}
              </div>
            ))}
          </div>
          {/* Column Separators */}
          {columns.slice(0, -1).map((col, idx) => {
            const left = columns.slice(0, idx + 1).reduce((sum, c) => sum + c.width, 0);
            return (
              <div
                key={col.id}
                className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 z-5"
                style={{ left: `${left}px` }}
              />
            );
          })}
          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', top: '60px' }}>
            {connections.map(conn => {
              const fromItem = items.find(i => i.id === conn.from);
              const toItem = items.find(i => i.id === conn.to);
              if (!fromItem || !toItem) return null;
              const x1 = fromItem.x + fromItem.width / 2;
              const y1 = fromItem.y + fromItem.height / 2;
              const x2 = toItem.x + toItem.width / 2;
              const y2 = toItem.y + toItem.height / 2;
              return (
                <line
                  key={conn.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={conn.color}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#4b5563" />
              </marker>
            </defs>
          </svg>
          {/* Items */}
          {items
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(item => (
            <div
              key={item.id}
              onMouseEnter={() => handleItemMouseEnter(item.id)}
              onMouseLeave={() => handleItemMouseLeave()}
              onMouseDown={(e) => handleItemMouseDown(e, item)}
              onDoubleClick={(e) => handleDoubleClick(item, e)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              className={`absolute ${item.color} group transition-shadow
                ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}
                ${item.locked ? 'opacity-75' : 'cursor-move'}
                ${item.type === 'note' ? 'border border-gray-300' : ''}
              `}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                transform: `rotate(${item.rotation}deg)`,
                borderRadius: item.type === 'circle' ? '50%' : '8px',
                minHeight: (item.type === 'note' || item.type === 'text') ? `${item.height}px` : undefined
              }}
            >
              {/* Resize Handle */}
              {selectedItems.includes(item.id) && !item.locked && (
                <div
                  onMouseDown={(e) => handleResizeStart(e, item)}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl cursor-nwse-resize z-10"
                />
              )}
              {/* Lock Indicator */}
              {item.locked && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  <Lock size={12} className="text-gray-600" />
                </div>
              )}
              {/* Content */}
              <div className="p-3 h-full overflow-auto relative">
                {editingItem === item.id ? (
                  <div className="space-y-2">
                    {editingContent.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex-1">
                          <input
                            ref={idx === currentLineIndex ? editorRef : null}
                            type="text"
                            value={line.text}
                            onChange={(e) => updateEditingContent(idx, { text: e.target.value })}
                            onFocus={() => setCurrentLineIndex(idx)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addNewLine(idx, line.type);
                              } else if (e.key === 'Backspace' && line.text === '') {
                                e.preventDefault();
                                deleteLine(idx);
                              }
                            }}
                            className="w-full bg-transparent border-none outline-none"
                            style={{
                              fontWeight: line.style.bold ? 'bold' : 'normal',
                              fontStyle: line.style.italic ? 'italic' : 'normal',
                              textDecoration: line.style.underline ? 'underline' : 'none',
                              fontSize: line.type === 'heading' ? `${item.fontSize + 4}px` : `${item.fontSize}px`
                            }}
                            placeholder={line.type === 'heading' ? 'Heading...' : 'Type here...'}
                            autoFocus={idx === currentLineIndex}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-2 bg-gray-50 rounded">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Story Points</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingStoryPoints}
                        onChange={(e) => setEditingStoryPoints(Number(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {item.content && renderContent(item.content, item.fontSize)}
                  </div>
                )}
              </div>
              {/* Story Points Badge */}
              {item.type === 'note' && item.storyPoints && !editingItem && (
                <div className="absolute bottom-2 right-2 bg-black/10 text-black text-xs font-bold px-1 py-0.5 rounded">
                  {item.storyPoints} SP
                </div>
              )}
              {/* Quick Actions */}
              {hoveredItemId === item.id && (
                <div 
                  className="absolute -top-10 right-0 flex gap-1 bg-white rounded shadow-lg p-1 z-20"
                  onMouseEnter={() => handleQuickActionsMouseEnter(item.id)}
                  onMouseLeave={handleQuickActionsMouseLeave}
                >
                  {item.content && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoubleClick(item, e);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(showColorPicker === item.id ? null : item.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Change Color"
                  >
                    <div className={`w-4 h-4 rounded ${item.color} border border-gray-400`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, locked: !i.locked } : i));
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title={item.locked ? "Unlock" : "Lock"}
                  >
                    {item.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItems([item.id]);
                      duplicateItems();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                      setConnections(prevConnections => prevConnections.filter(c => c.from !== item.id && c.to !== item.id));
                    }}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {/* Color Picker */}
              {showColorPicker === item.id && (
                <div 
                  className="absolute -top-24 right-0 bg-white rounded shadow-xl p-2 flex flex-wrap gap-1 z-30 max-w-[200px]"
                  onMouseEnter={() => handleColorPickerMouseEnter(item.id)}
                  onMouseLeave={handleColorPickerMouseLeave}
                >
                  {(item.type === 'note' || item.type === 'text' ? colors : shapeColors).map(c => (
                    <button
                      key={c.class}
                      onClick={(e) => {
                        e.stopPropagation();
                        setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, color: c.class } : i));
                        setShowColorPicker(null);
                      }}
                      className={`w-8 h-8 rounded ${c.class} border-2 border-gray-400 hover:scale-110 transition-transform`}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white rounded shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]"
          style={{
            left: `${showContextMenu.x}px`,
            top: `${showContextMenu.y}px`
          }}
          onClick={() => setShowContextMenu(null)}
        >
          <button
            onClick={() => {
              duplicateItems();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <Copy size={14} />
            Duplicate
          </button>
          <button
            onClick={() => {
              handleCopy();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <Copy size={14} />
            Copy
          </button>
          <button
            onClick={() => {
              handlePaste();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <Copy size={14} />
            Paste
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              bringToFront();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <ChevronUp size={14} />
            Bring to Front
          </button>
          <button
            onClick={() => {
              sendToBack();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <ChevronDown size={14} />
            Send to Back
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              toggleLock();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            {items.find(i => i.id === showContextMenu.itemId)?.locked ? <Unlock size={14} /> : <Lock size={14} />}
            {items.find(i => i.id === showContextMenu.itemId)?.locked ? 'Unlock' : 'Lock'}
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              handleDelete();
              setShowContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs text-xs space-y-1 border border-gray-200">
        <div className="font-bold text-sm mb-2">Quick Tips:</div>
        <div>• <strong>Double-click</strong> items to edit content & story points</div>
        <div>• <strong>Shift+Click</strong> to select multiple items</div>
        <div>• <strong>Right-click</strong> for context menu</div>
        <div>• <strong>Ctrl+C / Ctrl+V</strong> to copy/paste</div>
        <div>• <strong>Delete</strong> key to remove selected</div>
        <div>• <strong>Drag</strong> between columns to update status</div>
        <div>• Use <strong>Pan tool</strong> to move canvas</div>
        <div>• <strong>Connector tool</strong> to link items</div>
      </div>
    </div>
  );
};

export default AdvancedMiroBoard;
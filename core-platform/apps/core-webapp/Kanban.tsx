import React, { useState } from 'react';
import { GripVertical, Plus, MoreVertical, Clock, Tag, User, X, Edit2, Trash2 } from 'lucide-react';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'slate',
      cards: [
        { id: '1', title: 'Implement authentication', priority: 'high', assignee: 'JD', tags: ['Security', 'Backend'], time: '8h' },
        { id: '2', title: 'Design landing page', priority: 'medium', assignee: 'SM', tags: ['Design', 'Frontend'], time: '4h' },
        { id: '3', title: 'Database optimization', priority: 'low', assignee: 'RK', tags: ['Backend'], time: '6h' }
      ]
    },
    {
      id: 'todo',
      title: 'To Do',
      color: 'blue',
      cards: [
        { id: '4', title: 'API integration for payments', priority: 'high', assignee: 'JD', tags: ['Backend', 'API'], time: '12h' },
        { id: '5', title: 'Mobile responsive fixes', priority: 'medium', assignee: 'AL', tags: ['Frontend'], time: '3h' }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: 'amber',
      cards: [
        { id: '6', title: 'User dashboard analytics', priority: 'high', assignee: 'SM', tags: ['Frontend', 'Analytics'], time: '10h' },
        { id: '7', title: 'Email notification service', priority: 'medium', assignee: 'RK', tags: ['Backend'], time: '5h' }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'violet',
      cards: [
        { id: '8', title: 'Shopping cart functionality', priority: 'high', assignee: 'AL', tags: ['Frontend'], time: '8h' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'emerald',
      cards: [
        { id: '9', title: 'Project setup & configuration', priority: 'medium', assignee: 'JD', tags: ['DevOps'], time: '2h' },
        { id: '10', title: 'Logo design', priority: 'low', assignee: 'SM', tags: ['Design'], time: '4h' }
      ]
    }
  ]);

  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    assignee: '',
    tags: '',
    time: ''
  });

  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-blue-600 bg-blue-50'
  };

  const columnColors = {
    slate: 'bg-slate-100 border-slate-300',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    violet: 'bg-violet-50 border-violet-200',
    emerald: 'bg-emerald-50 border-emerald-200'
  };

  const handleDragStart = (e, card, columnId) => {
    setDraggedCard(card);
    setDraggedFrom(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedCard || draggedFrom === targetColumnId) {
      setDraggedCard(null);
      setDraggedFrom(null);
      return;
    }

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => {
        if (col.id === draggedFrom) {
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== draggedCard.id)
          };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            cards: [...col.cards, draggedCard]
          };
        }
        return col;
      });
      return newColumns;
    });

    setDraggedCard(null);
    setDraggedFrom(null);
  };

  const openModal = (columnId, card = null) => {
    setCurrentColumn(columnId);
    setEditingCard(card);
    if (card) {
      setFormData({
        title: card.title,
        priority: card.priority,
        assignee: card.assignee,
        tags: card.tags.join(', '),
        time: card.time
      });
    } else {
      setFormData({
        title: '',
        priority: 'medium',
        assignee: '',
        tags: '',
        time: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentColumn(null);
    setEditingCard(null);
    setFormData({
      title: '',
      priority: 'medium',
      assignee: '',
      tags: '',
      time: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const cardData = {
      id: editingCard ? editingCard.id : Date.now().toString(),
      title: formData.title,
      priority: formData.priority,
      assignee: formData.assignee,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      time: formData.time
    };

    setColumns(prevColumns => prevColumns.map(col => {
      if (col.id === currentColumn) {
        if (editingCard) {
          return {
            ...col,
            cards: col.cards.map(card => 
              card.id === editingCard.id ? cardData : card
            )
          };
        } else {
          return {
            ...col,
            cards: [...col.cards, cardData]
          };
        }
      }
      return col;
    }));

    closeModal();
  };

  const handleDelete = (columnId, cardId) => {
    setColumns(prevColumns => prevColumns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        };
      }
      return col;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3">
      <div className="mb-3">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Project Dashboard</h1>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 12 Completed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> 7 Active</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full"></span> 5 Pending</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {columns.map(column => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`rounded-lg border ${columnColors[column.color]} p-2.5 h-full`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-sm text-slate-700">{column.title}</h2>
                  <span className="text-xs font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded">
                    {column.cards.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <Plus size={14} onClick={() => openModal(column.id)} />
                </button>
              </div>

              <div className="space-y-2">
                {column.cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, column.id)}
                    className="bg-white rounded border border-slate-200 p-2.5 cursor-move hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-medium text-slate-800 leading-tight flex-1">
                        {card.title}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          onClick={() => openModal(column.id, card)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          className="text-slate-400 hover:text-red-600 p-0.5"
                          onClick={() => handleDelete(column.id, card.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5">
                          <GripVertical size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {card.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded flex items-center gap-0.5"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded font-medium ${priorityColors[card.priority]}`}>
                          {card.priority}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={11} />
                          {card.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        <User size={11} />
                        {card.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingCard ? 'Edit Card' : 'New Card'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Time Estimate
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4h"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Initials (e.g., JD)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Separate with commas"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingCard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

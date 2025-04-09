'use client';

import { useState } from 'react';

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface Card {
  id: string;
  title: string;
  description: string;
}

interface ColumnManagerProps {
  boardId: string;
  onClose: () => void;
}

export default function ColumnManager({ boardId, onClose }: ColumnManagerProps) {
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    
    if (boardIndex === -1) return;

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      cards: []
    };

    boards[boardIndex].columns.push(newColumn);
    sessionStorage.setItem('boards', JSON.stringify(boards));
    
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Manage Columns</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isAddingColumn ? (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            Add New Column
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Enter column title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddColumn}
                className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Add Column
              </button>
              <button
                onClick={() => {
                  setIsAddingColumn(false);
                  setNewColumnTitle('');
                }}
                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';

interface CreateBoardProps {
  onBoardCreated: () => void;
}

export default function CreateBoard({ onBoardCreated }: CreateBoardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [boardName, setBoardName] = useState('');

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      const boards = JSON.parse(sessionStorage.getItem('boards') || '[]');
      const newBoard = {
        id: `board-${Date.now()}`,
        title: boardName,
        columns: [
          { id: 'todo', title: 'To Do', cards: [] },
          { id: 'in-progress', title: 'In Progress', cards: [] },
          { id: 'done', title: 'Done', cards: [] },
        ],
      };
      boards.push(newBoard);
      sessionStorage.setItem('boards', JSON.stringify(boards));
      setBoardName('');
      setIsOpen(false);
      onBoardCreated();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="w-72 h-32 bg-white dark:bg-dark-800 rounded-lg shadow-card hover:shadow-card-hover p-4 transition-all duration-200 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-dark-600"
      >
        <span className="text-gray-600 dark:text-gray-400">+ Create new board</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Board</h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="w-full p-2 border dark:border-dark-600 rounded mb-4 bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateBoard();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="btn btn-primary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
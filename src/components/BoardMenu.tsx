'use client';

import { useState, useEffect } from 'react';

interface Board {
  id: string;
  title: string;
  columns: {
    id: string;
    title: string;
    cards: {
      id: string;
      title: string;
      description: string;
    }[];
  }[];
}

interface BoardMenuProps {
  onBoardSelect: (boardId: string) => void;
}

export default function BoardMenu({ onBoardSelect }: BoardMenuProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isAddingBoard, setIsAddingBoard] = useState(false);

  useEffect(() => {
    const savedBoards = sessionStorage.getItem('boards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  const handleAddBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title: newBoardTitle,
      columns: [
        {
          id: `column-0-${Date.now()}`,
          title: 'To Do',
          cards: []
        },
        {
          id: `column-1-${Date.now()}`,
          title: 'In Progress',
          cards: []
        },
        {
          id: `column-2-${Date.now()}`,
          title: 'Done',
          cards: []
        }
      ]
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    sessionStorage.setItem('boards', JSON.stringify(updatedBoards));
    setNewBoardTitle('');
    setIsAddingBoard(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddBoard();
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-dark-800 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-dark-700">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Boards</h2>

        {isAddingBoard ? (
          <div className="mb-4">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter board title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200 mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddBoard}
                className="flex-1 py-2 px-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 text-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsAddingBoard(false);
                  setNewBoardTitle('');
                }}
                className="flex-1 py-2 px-3 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingBoard(true)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200 text-sm flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Board
          </button>
        )}

        <div className="space-y-2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardSelect(board.id)}
              className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="truncate">{board.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
} 
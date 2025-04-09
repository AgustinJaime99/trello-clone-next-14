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
    color: string;
  }[];
}

interface BoardMenuProps {
  onBoardSelect: (boardId: string) => void;
}

export default function BoardMenu({ onBoardSelect }: BoardMenuProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    const savedBoards = sessionStorage.getItem('boards');
    if (savedBoards) {
      try {
        const parsedBoards = JSON.parse(savedBoards);
        setBoards(Array.isArray(parsedBoards) ? parsedBoards : []);
      } catch (error) {
        console.error('Error parsing boards:', error);
        setBoards([]);
      }
    }
  }, []);

  const handleAddBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title: newBoardTitle,
      columns: [
        {
          id: `column-${Date.now()}-1`,
          title: 'To Do',
          cards: [],
          color: '#ef4444' // Rojo
        },
        {
          id: `column-${Date.now()}-2`,
          title: 'In Progress',
          cards: [],
          color: '#f59e0b' // Amarillo
        },
        {
          id: `column-${Date.now()}-3`,
          title: 'Done',
          cards: [],
          color: '#10b981' // Verde
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

  const handleCreateBoard = () => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title: newBoardTitle,
      columns: [
        {
          id: `column-${Date.now()}-1`,
          title: 'To Do',
          cards: [],
          color: '#ef4444' // Rojo
        },
        {
          id: `column-${Date.now()}-2`,
          title: 'In Progress',
          cards: [],
          color: '#f59e0b' // Amarillo
        },
        {
          id: `column-${Date.now()}-3`,
          title: 'Done',
          cards: [],
          color: '#10b981' // Verde
        }
      ]
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    sessionStorage.setItem('boards', JSON.stringify(updatedBoards));
    setNewBoardTitle('');
  };

  const handleDeleteBoard = (boardId: string) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    setBoards(updatedBoards);
    sessionStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Boards</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {boards?.map((board) => (
              <button
                key={board.id}
                onClick={() => {
                  onBoardSelect(board.id);
                  setSelectedBoardId(board.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                  selectedBoardId === board.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {board.title}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          {isAddingBoard ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter board title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddBoard}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsAddingBoard(false);
                    setNewBoardTitle('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingBoard(true)}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Create Board
            </button>
          )}
        </div>
      </div>
    </aside>
  );
} 
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
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Boards</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {boards.map((board) => (
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
          <button
            onClick={() => setIsAddingBoard(true)}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            Create Board
          </button>
        </div>
      </div>
    </aside>
  );
} 
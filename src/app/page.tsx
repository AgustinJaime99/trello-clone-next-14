'use client';

import { useState, useEffect } from 'react';
import BoardMenu from '@/components/BoardMenu';
import Board from '@/components/Board';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export default function Home() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <BoardMenu onBoardSelect={handleBoardSelect} />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        {selectedBoardId ? (
          <Board boardId={selectedBoardId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a board or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
}

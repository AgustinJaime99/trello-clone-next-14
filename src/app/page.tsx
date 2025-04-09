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
    <div className="flex h-screen">
      <BoardMenu onBoardSelect={handleBoardSelect} />
      <main className="flex-1 ml-64 p-6">
        {selectedBoardId ? (
          <Board boardId={selectedBoardId} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Select a board or create a new one
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a board from the sidebar to get started
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

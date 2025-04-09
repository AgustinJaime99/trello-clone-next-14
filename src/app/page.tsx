'use client';

import { useState } from 'react';
import Board from '@/components/Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Board {
  id: string;
  title: string;
  cards: Card[];
}

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Task 1', description: 'Description for task 1' },
        { id: '2', title: 'Task 2', description: 'Description for task 2' },
      ],
    },
    {
      id: '2',
      title: 'In Progress',
      cards: [
        { id: '3', title: 'Task 3', description: 'Description for task 3' },
      ],
    },
    {
      id: '3',
      title: 'Done',
      cards: [
        { id: '4', title: 'Task 4', description: 'Description for task 4' },
      ],
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a new array to avoid mutating the state directly
    const newBoards = boards.map(board => ({
      ...board,
      cards: [...board.cards]
    }));

    // Find the source and destination boards
    const sourceBoard = newBoards.find(board => board.id === source.droppableId);
    const destBoard = newBoards.find(board => board.id === destination.droppableId);

    if (!sourceBoard || !destBoard) {
      return;
    }

    // Remove the card from the source board
    const [movedCard] = sourceBoard.cards.splice(source.index, 1);

    // Add the card to the destination board
    destBoard.cards.splice(destination.index, 0, movedCard);

    // Update the state
    setBoards(newBoards);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Trello Clone</h1>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {boards.map((board) => (
              <Board
                key={board.id}
                board={board}
                boards={boards}
                setBoards={setBoards}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Card from './Card';
import EditColumnModal from './EditColumnModal';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
  color: string;
}

interface Board {
  id: string;
  title: string;
  columns: Column[];
}

interface BoardProps {
  boardId: string;
}

export default function Board({ boardId }: BoardProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>({});
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string; color: string } | null>(null);

  useEffect(() => {
    const savedBoards = sessionStorage.getItem('boards');
    if (savedBoards) {
      try {
        const boards = JSON.parse(savedBoards);
        if (Array.isArray(boards)) {
          const currentBoard = boards.find((b: Board) => b.id === boardId);
          if (currentBoard) {
            setBoard(currentBoard);
          }
        }
      } catch (error) {
        console.error('Error parsing boards:', error);
      }
    }
  }, [boardId]);

  const handleDragEnd = (result: DropResult) => {
    if (!board) return;

    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'column') {
      const newColumns = Array.from(board.columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);

      const newBoard = {
        ...board,
        columns: newColumns
      };

      setBoard(newBoard);
      sessionStorage.setItem('boards', JSON.stringify([newBoard]));
    } else {
      const sourceColumn = board.columns.find(col => col.id === source.droppableId);
      const destColumn = board.columns.find(col => col.id === destination.droppableId);

      if (!sourceColumn || !destColumn) return;

      const sourceCards = Array.from(sourceColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceCards.splice(destination.index, 0, removed);
        const newBoard = {
          ...board,
          columns: board.columns.map(col =>
            col.id === source.droppableId ? { ...col, cards: sourceCards } : col
          )
        };
        setBoard(newBoard);
        sessionStorage.setItem('boards', JSON.stringify([newBoard]));
      } else {
        const destCards = Array.from(destColumn.cards);
        destCards.splice(destination.index, 0, removed);
        const newBoard = {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === source.droppableId) {
              return { ...col, cards: sourceCards };
            }
            if (col.id === destination.droppableId) {
              return { ...col, cards: destCards };
            }
            return col;
          })
        };
        setBoard(newBoard);
        sessionStorage.setItem('boards', JSON.stringify([newBoard]));
      }
    }
  };

  const handleAddColumn = () => {
    if (!board) return;

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: 'New Column',
      cards: [],
      color: '#94a3b8'
    };

    const newBoard = {
      ...board,
      columns: [...board.columns, newColumn]
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;

    const newBoard = {
      ...board,
      columns: board.columns.filter(column => column.id !== columnId)
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
  };

  const handleEditColumn = (columnId: string) => {
    if (!board) return;

    const column = board.columns.find(col => col.id === columnId);
    if (!column) return;

    setEditingColumn({
      id: columnId,
      title: column.title,
      color: column.color
    });
  };

  const handleSaveColumn = (title: string, color: string) => {
    if (!board || !editingColumn) return;

    const newBoard = {
      ...board,
      columns: board.columns.map(column =>
        column.id === editingColumn.id ? { ...column, title, color } : column
      )
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
    setEditingColumn(null);
  };

  const handleNewCardTitleChange = (columnId: string, value: string) => {
    setNewCardTitles(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  const handleAddCard = (columnId: string, title: string) => {
    if (!board || !title.trim()) return;

    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description: ''
    };

    const newBoard = {
      ...board,
      columns: board.columns.map(column =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    if (!board) return;

    const newBoard = {
      ...board,
      columns: board.columns.map(column =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter(card => card.id !== cardId) }
          : column
      )
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
  };

  const handleEditCard = (columnId: string, cardId: string, title: string, description: string) => {
    if (!board) return;

    const newBoard = {
      ...board,
      columns: board.columns.map(column =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map(card =>
                card.id === cardId ? { ...card, title, description } : card
              )
            }
          : column
      )
    };

    setBoard(newBoard);
    sessionStorage.setItem('boards', JSON.stringify([newBoard]));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{board?.title}</h1>
      </div>

      <div className="relative flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 w-full overflow-x-auto pb-4"
              >
                <div className="flex gap-4 min-w-max">
                  {board?.columns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`w-72 flex-shrink-0 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <div className="bg-gray-100 dark:bg-dark-700 rounded-lg h-full">
                            <div 
                              className="h-2 rounded-t-lg"
                              style={{ backgroundColor: column.color }}
                            />
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex-1 cursor-grab active:cursor-grabbing"
                                >
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {column.title}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditColumn(column.id)}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteColumn(column.id)}
                                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <Droppable droppableId={column.id} type="card">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-3 min-h-[50px]"
                                  >
                                    {column.cards.map((card, index) => (
                                      <Draggable key={card.id} draggableId={card.id} index={index}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <Card
                                              card={card}
                                              isDragging={snapshot.isDragging}
                                              onDelete={() => handleDeleteCard(column.id, card.id)}
                                              onEdit={(title: string, description: string) => handleEditCard(column.id, card.id, title, description)}
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              <div className="mt-3">
                                <input
                                  type="text"
                                  value={newCardTitles[column.id] || ''}
                                  onChange={(e) => handleNewCardTitleChange(column.id, e.target.value)}
                                  placeholder="Add a card..."
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-800 dark:text-gray-200"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddCard(column.id, newCardTitles[column.id] || '');
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="fixed right-4 top-20 z-10">
          <button
            onClick={handleAddColumn}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Column
          </button>
        </div>
      </div>

      <EditColumnModal
        isOpen={!!editingColumn}
        onClose={() => setEditingColumn(null)}
        onSave={handleSaveColumn}
        initialTitle={editingColumn?.title || ''}
        initialColor={editingColumn?.color || '#94a3b8'}
      />
    </div>
  );
} 
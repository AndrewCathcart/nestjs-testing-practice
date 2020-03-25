import { Injectable, BadRequestException } from '@nestjs/common';

import { Board } from './models/board';
import { BoardDTO } from './dto/board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [
    new Board(
      '1',
      'Work Projects',
      new Date(Date.now()),
      new Date(Date.now()),
      false,
    ),
    new Board(
      '2',
      'Personal Projects',
      new Date(Date.now()),
      new Date(Date.now()),
      false,
    ),
    new Board(
      '3',
      'TODO List',
      new Date(Date.now()),
      new Date(Date.now()),
      false,
    ),
  ];

  getAll(): Board[] {
    return this.boards;
  }

  getById(id: string): Board {
    const index = this.findBoardIndex(id);
    return this.boards[index];
  }

  addBoard(board: BoardDTO): Board {
    const newId = Number(this.boards[this.boards.length - 1].id) + 1;
    const newBoard = new Board(
      newId.toString(),
      board.name,
      new Date(Date.now()),
      new Date(Date.now()),
      false,
    );

    this.boards.push(newBoard);
    return newBoard;
  }

  deleteBoard(id: string): Board[] {
    const index = this.findBoardIndex(id);

    this.boards = this.boards.filter(
      (_board, boardIndex) => boardIndex !== index,
    );

    return this.boards;
  }

  updateBoard(id: string, boardDTO: BoardDTO): Board {
    const index = this.findBoardIndex(id);

    const originalBoard = this.boards[index];
    const updatedBoard = {
      name: boardDTO.name,
      id: originalBoard.id,
      dateCreated: originalBoard.dateCreated,
      dateUpdated: new Date(Date.now()),
      isStarred: originalBoard.isStarred,
    };

    this.boards[index] = updatedBoard;

    return updatedBoard;
  }

  private findBoardIndex(id: string): number {
    const index = this.boards.findIndex(board => board.id === id);

    if (index === -1) {
      throw new BadRequestException(`No board found with id ${id}.`);
    }

    return index;
  }
}

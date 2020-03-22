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
    const foundBoard = this.boards.find(board => board.id === id);
    if (!foundBoard) {
      throw new BadRequestException(`No board found with id ${id}.`);
    }
    return foundBoard;
  }

  addBoard(board: BoardDTO): Board {
    // TODO: hacky for now but we're going to move to a Database soon where id's will be generated for us
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

  deleteBoard(id: string): boolean {
    const index = this.boards.findIndex(board => board.id === id);

    if (index === -1) {
      return false;
    } else {
      this.boards = this.boards.filter(
        (board, boardIndex) => boardIndex !== index,
      );
      return true;
    }
  }
}

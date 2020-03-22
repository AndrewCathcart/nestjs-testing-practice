import { Test, TestingModule } from '@nestjs/testing';

import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './models/board';
import { BoardDTO } from './dto/board.dto';

const testBoard1 = new Board(
  '1',
  'Controller Test Board 1',
  new Date(1),
  new Date(1),
  false,
);
const testBoard2 = new Board(
  '2',
  'Controller Test Board 2',
  new Date(2),
  new Date(2),
  true,
);
const testBoard3 = new Board(
  '3',
  'Controller Test Board 3',
  new Date(3),
  new Date(3),
  true,
);
const testBoard4 = new Board(
  '4',
  'Controller Test Board 4',
  new Date(4),
  new Date(4),
  true,
);

describe('Boards Controller', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
          useValue: {
            getAll: jest.fn().mockReturnValue([testBoard1, testBoard2]),
            getById: jest.fn().mockReturnValue(testBoard3),
            addBoard: jest.fn().mockReturnValue(testBoard4),
            deleteBoard: jest.fn().mockReturnValue(true), // don't care about what it returns
            updateBoard: jest.fn().mockReturnValue(true), // don't care about what it returns
          },
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBoards', () => {
    it('should get the list of boards', () => {
      const returnedBoards = controller.getAllBoards();
      expect(typeof returnedBoards).toBe('object');
      expect(returnedBoards[0].id).toBe('1');
      expect(returnedBoards[1].name).toBe('Controller Test Board 2');
      expect(returnedBoards.length).toBe(2);
    });
  });

  describe('getBoardById', () => {
    it('should get the board matching the id', () => {
      const returnedBoard = controller.getBoardMatchingId('3');
      expect(typeof returnedBoard).toBe('object');
      expect(returnedBoard.id).toBe('3');
      expect(returnedBoard).toEqual(testBoard3);
    });
  });

  describe('createNewBoard', () => {
    it('should return a new board', () => {
      const newBoard = controller.createNewBoard({
        name: 'Controller Test Board 4',
      });
      expect(newBoard.id).toBe('4');
      expect(newBoard.name).toBe('Controller Test Board 4');
    });
  });

  describe('deleteBoard', () => {
    it('should return true that there was a deletion', () => {
      const delReturn = controller.deleteBoard('2');
      expect(typeof delReturn).toBe('boolean');
      expect(delReturn).toBeTruthy();
    });
  });

  describe('updateBoard', () => {
    it('should return true that there was an update', () => {
      const boardDTO = new BoardDTO('Updated Name');
      const updatedBoard = controller.updateBoard('2', boardDTO);

      expect(typeof updatedBoard).toBe('boolean');
      expect(updatedBoard).toBeTruthy();
    });
  });
});

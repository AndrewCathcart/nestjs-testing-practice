import { Test, TestingModule } from '@nestjs/testing';

import { BoardsService } from './boards.service';
import { BoardDTO } from './dto/board.dto';
import { Board } from './models/board';

describe('BoardsService', () => {
  let service: BoardsService;

  const realDateNow = Date.now.bind(global.Date);

  beforeAll(() => {
    // Return 1 millisecond (1970-01-01T00:00:00.001Z) when calling Date.now() in tests.
    const dateNowStub = jest.fn(() => 1);
    global.Date.now = dateNowStub;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsService],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return the array of boards', () => {
      const boards = service.getAll();

      expect(boards).toHaveLength(3);
      expect(boards[0]).toEqual({
        dateCreated: new Date(Date.now()),
        dateUpdated: new Date(Date.now()),
        id: '1',
        isStarred: false,
        name: 'Work Projects',
      });
      expect(boards[1].name).toBe('Personal Projects');
      expect(boards[2].name).toBe('TODO List');
    });
  });

  describe('getById', () => {
    it('should return a found board', () => {
      const board = service.getById('2');
      expect(board).toBeTruthy();
      expect(board.name).toBe('Personal Projects');
      expect(board.id).toBe('2');
    });

    it('should throw an error if no board with that id exists', () => {
      try {
        service.getById('12344321');
      } catch (err) {
        expect(err.response.message).toBe('No board found with id 12344321.');
        expect(err.response.error).toBe('Bad Request');
      }
    });
  });

  describe('addBoard', () => {
    it('should add the board', () => {
      const boardDTO: BoardDTO = {
        name: 'New Board Added',
      };

      service.addBoard(boardDTO);

      const boards = service.getAll();
      expect(boards).toHaveLength(4);
      expect(boards[3]).toEqual({
        ...boardDTO,
        dateCreated: new Date(1),
        dateUpdated: new Date(1),
        id: '4',
        isStarred: false,
      });
    });

    it('should add the correct id if we have no boards to start with', () => {
      // setup and check we have no existing boards
      service.deleteBoard('1');
      service.deleteBoard('2');
      service.deleteBoard('3');
      expect(service.getAll()).toHaveLength(0);

      // add a new board, so we now have one board
      const boardDTO: BoardDTO = {
        name: 'First Board',
      };
      service.addBoard(boardDTO);

      const boards = service.getAll();
      expect(boards).toHaveLength(1);
      expect(boards[0].id).toEqual('1');
    });
  });

  describe('deleteBoard', () => {
    it('repository should not contain the deleted id', () => {
      const result = service.deleteBoard('2');
      expect(result).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: '2' })]),
      );
    });

    it('should throw an error if no board with that id exists', () => {
      try {
        service.deleteBoard('9929292');
      } catch (err) {
        expect(err.response.message).toBe('No board found with id 9929292.');
        expect(err.response.error).toBe('Bad Request');
      }
    });
  });

  describe('updateBoard', () => {
    it('should correctly update the board', () => {
      const boardDTO: BoardDTO = {
        name: 'Edited the name',
      };

      const updatedBoard: Board = service.updateBoard('2', boardDTO);

      expect(updatedBoard).toBeTruthy();
      expect(updatedBoard.name).toEqual('Edited the name');
      expect(updatedBoard.id).toEqual('2');
    });
  });

  afterAll(() => {
    // Set back to the original Date object.
    global.Date.now = realDateNow;
  });
});

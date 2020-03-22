import { Test, TestingModule } from '@nestjs/testing';

import { BoardsService } from './boards.service';
import { BoardDTO } from './dto/board.dto';

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
      const newBoard = service.addBoard(boardDTO);
      expect(newBoard).toEqual({
        ...boardDTO,
        dateCreated: new Date(1),
        dateUpdated: new Date(1),
        id: '4',
        isStarred: false,
      });
    });
  });

  describe('deleteBoard', () => {
    it('should return true if an item with a matching id was deleted', () => {
      expect(service.deleteBoard('2'));
    });
    it('should return false if an item with a matching id does not exist', () => {
      expect(service.deleteBoard('1234534664578238123'));
    });
  });

  afterAll(() => {
    // Set back to the original Date object.
    global.Date.now = realDateNow;
  });
});

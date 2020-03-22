import { BoardDTO } from './board.dto';

describe('BoardDTO', () => {
  it('should create a BoardDTO object', () => {
    expect(new BoardDTO('Test Board 1')).toEqual(new BoardDTO('Test Board 1'));
    expect(new BoardDTO('Test Board 2')).not.toEqual(
      new BoardDTO('Test Board 3'),
    );
  });
});

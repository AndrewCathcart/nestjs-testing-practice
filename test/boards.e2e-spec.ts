import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';

import * as request from 'supertest';

import { Board } from '../src/boards/models/board';
import { BoardsModule } from '../src/boards/boards.module';
import { BoardsService } from '../src/boards/boards.service';

const testBoard1 = new Board(
  '1',
  'E2E Test Board 1',
  new Date(1),
  new Date(1),
  false,
);
const testBoard2 = new Board(
  '2',
  'E2E Test Board 2',
  new Date(2),
  new Date(2),
  true,
);
const testBoard3 = new Board(
  '3',
  'E2E Test Board 3',
  new Date(3),
  new Date(3),
  true,
);
const testBoard4 = new Board(
  '4',
  'E2E Test Board 4',
  new Date(3),
  new Date(3),
  true,
);

describe('Boards (e2e)', () => {
  let app: INestApplication;

  describe('with mocking', () => {
    let service: BoardsService;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [BoardsModule],
      })
        .overrideProvider(BoardsService)
        .useValue({
          getAll: jest.fn().mockReturnValue([testBoard1, testBoard2]),
          getById: jest.fn().mockReturnValue(testBoard3),
          addBoard: jest.fn().mockReturnValue(testBoard4),
          deleteBoard: jest.fn().mockReturnValue({ deleted: true }),
        })
        .compile();

      app = moduleFixture.createNestApplication();
      service = moduleFixture.get<BoardsService>(BoardsService);

      await app.init();
    });

    describe('/boards (GET)', () => {
      it('should return an array of boards', () => {
        return request(app.getHttpServer())
          .get('/boards')
          .expect(200)
          .expect([
            {
              id: '1',
              name: 'E2E Test Board 1',
              dateCreated: '1970-01-01T00:00:00.001Z',
              dateUpdated: '1970-01-01T00:00:00.001Z',
              isStarred: false,
            },
            {
              id: '2',
              name: 'E2E Test Board 2',
              dateCreated: '1970-01-01T00:00:00.002Z',
              dateUpdated: '1970-01-01T00:00:00.002Z',
              isStarred: true,
            },
          ]);
      });
    });

    describe('/boards/:id (GET)', () => {
      it('should return the single board', () => {
        return request(app.getHttpServer())
          .get('/boards/1/')
          .expect(200)
          .expect({
            id: '3',
            name: 'E2E Test Board 3',
            dateCreated: '1970-01-01T00:00:00.003Z',
            dateUpdated: '1970-01-01T00:00:00.003Z',
            isStarred: true,
          });
      });

      it('should return a 400 if id does not exist', () => {
        service.getById = jest.fn().mockImplementationOnce(() => {
          throw new BadRequestException(
            'Board with id 12344321 does not exist.',
          );
        });

        return request(app.getHttpServer())
          .get('/boards/12344321')
          .expect(400)
          .expect({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Board with id 12344321 does not exist.',
          });
      });
    });

    describe('/boards/new (POST)', () => {
      it('should return the new board', () => {
        return request(app.getHttpServer())
          .post('/boards/new')
          .send({ name: 'E2E Test Board 4' })
          .expect(201)
          .expect({
            id: '4',
            name: 'E2E Test Board 4',
            dateCreated: '1970-01-01T00:00:00.003Z',
            dateUpdated: '1970-01-01T00:00:00.003Z',
            isStarred: true,
          });
      });
      // TODO: Validate no name
    });

    describe('/boards/:id (DELETE)', () => {
      it('should return true for a found id', () => {
        return request(app.getHttpServer())
          .delete('/boards/2')
          .expect(200)
          .expect({ deleted: true });
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });
});

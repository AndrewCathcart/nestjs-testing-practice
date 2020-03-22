import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';

import { BoardsService } from './boards.service';
import { Board } from './models/board';
import { BoardDTO } from './dto/board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('')
  getAllBoards(): Board[] {
    return this.boardsService.getAll();
  }

  @Get('/:id')
  getBoardMatchingId(@Param('id') id: string): Board {
    return this.boardsService.getById(id);
  }

  @Post('/new')
  createNewBoard(@Body() newBoard: BoardDTO): Board {
    return this.boardsService.addBoard(newBoard);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: string): Board[] {
    return this.boardsService.deleteBoard(id);
  }

  @Patch(':id')
  updateBoard(@Param('id') id: string, @Body() updatedBoard: BoardDTO) {
    return this.boardsService.updateBoard(id, updatedBoard);
  }
}

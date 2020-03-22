export class Board {
  constructor(
    public id: string,
    public name: string,
    public dateCreated: Date,
    public dateUpdated: Date,
    public isStarred: boolean,
  ) {}
}

import { DataNotFoundStr } from "@share/data";
import { Entity, IQueryHandler, IQueryRepository } from "@share/interface";

export class BaseGetByIdQuery {
  constructor(
    readonly id: string
  ) { }
}

export class BaseGetByIdQueryHandler<E extends Entity> implements IQueryHandler<BaseGetByIdQuery, E> {
  constructor(readonly repo: IQueryRepository<E>) { }

  async execute(query: BaseGetByIdQuery): Promise<E> {
    const data = await this.repo.findById(query.id);

    if (data.isNone()) {
      throw new Error(DataNotFoundStr);
    }

    return data.unwrap() as E;
  }
}
import { Paginated, Paging } from "@share/data";
import { Entity, IQueryHandler, IQueryRepository } from "@share/interface";

export class ListingPagingQuery<C> {
  constructor(
    readonly paging: Paging,
    readonly cond: C,
  ) { }
}

export class BaseListingQueryHandler<E extends Entity, C> implements
  IQueryHandler<ListingPagingQuery<C>, Paginated<E>> {
  constructor(readonly repo: IQueryRepository<E>) { }

  async execute(query: ListingPagingQuery<C>): Promise<Paginated<E>> {
    const data = await this.repo.list(query.cond, query.paging);
    return data;
  }
}
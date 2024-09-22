import { Option } from 'oxide.ts'
import { Paginated, Paging, UserRole } from './data'

export interface Entity {
  readonly id: string
}

export interface IUsecase<E extends Entity> {
  getDetailById(id: string): Promise<Option<E>>
}

export interface IRepository<E extends Entity> extends ICommandRepository<E>, IQueryRepository<E> {}

export interface ICommandRepository<E extends Entity> {
  insert(data: E): Promise<boolean>
  update(id: string, data: any): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface IQueryRepository<E extends Entity> {
  findById(id: string): Promise<Option<E>>
  findByIds(ids: Array<string>): Promise<Array<E>>
  findByCond(cond: any): Promise<Option<E>>
  list(cond: any, paging: Paging): Promise<Paginated<E>>
  listAll(cond: any): Promise<Array<E>>
}

export interface ICommandHandler<C, R extends string | boolean | {}> {
  execute(cmd: C): Promise<R>
}

export interface IQueryHandler<Q, E extends Entity | Array<Entity> | Paginated<Entity>> {
  execute(query: Q): Promise<E>
}

export interface IHasId {
  id: string
}

export interface IImageUploader {
  uploadImage(objName: string, filename: string, filesize: number, contentType: string): Promise<boolean>
  getFullURL(objectName: string): string
  cloudName(): string
}

export interface TokenPayload {
  userId: string
  role: UserRole
}

export interface Requester extends TokenPayload {}

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>
  verifyToken(token: string): Promise<TokenPayload | null>
}

export interface IAuthService {
  introspectToken(token: string): Promise<any>
}

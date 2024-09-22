import { DataNotFoundStr } from "@share/data";
import { Entity, ICommandHandler, IRepository } from "@share/interface";

export class UpdateCommand<DTO> {
  constructor(readonly id: string, readonly dto: DTO) { };
}

export class BaseUpdateCommandHandler<E extends Entity, DTO> implements ICommandHandler<UpdateCommand<DTO>, boolean> {
  constructor(readonly repo: IRepository<E>) { }

  async execute(cmd: UpdateCommand<DTO>): Promise<boolean> {
    const data = await this.repo.findById(cmd.id);

    if (data.isNone()) {
      throw new Error(DataNotFoundStr);
    }

    return await this.repo.update(cmd.id, cmd.dto);
  }
}
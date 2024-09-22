import { DataNotFoundStr } from "@share/data";
import { Entity, ICommandHandler, IRepository } from "@share/interface";

export class DeleteCommand {
  constructor(readonly id: string) { };
}

export class BaseDeleteCommandHandler<E extends Entity> implements ICommandHandler<DeleteCommand, boolean> {
  constructor(readonly repo: IRepository<E>) { }

  async execute(cmd: DeleteCommand): Promise<boolean> {
    const data = await this.repo.findById(cmd.id);

    if (data.isNone()) {
      throw new Error(DataNotFoundStr);
    }

    return await this.repo.delete(cmd.id, false);
  }
}
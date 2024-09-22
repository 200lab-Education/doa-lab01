import { ICommandHandler, ICommandRepository, IHasId } from "@share/interface";
import { v7 } from "uuid";

export class CreateCommand<DTO extends IHasId> {
  constructor(
    readonly dto: DTO
  ) { }
}

export class BaseCreateCommandHandler<DTO extends IHasId> implements ICommandHandler<CreateCommand<DTO>, string> {
  constructor(readonly cmdRepo: ICommandRepository<DTO>) { }

  async execute(cmd: CreateCommand<DTO>): Promise<string> {
    const newUUID = v7();

    cmd.dto.id = newUUID;

    await this.cmdRepo.insert(cmd.dto);

    return newUUID;
  }
}
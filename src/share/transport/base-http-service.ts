import { Paginated, Paging } from "@share/data";
import { Entity, ICommandHandler, IHasId, IQueryHandler } from "@share/interface";
import { CreateCommand } from "@share/usecase/base-create.cmd";
import { DeleteCommand } from "@share/usecase/base-delete.cmd";
import { BaseGetByIdQuery } from "@share/usecase/base-get-by-id.query";
import { ListingPagingQuery } from "@share/usecase/base-list-paging.query";
import { UpdateCommand } from "@share/usecase/base-update.cmd";
import { Request, Response } from "express";

export class BaseHTTPService<E extends Entity, CreateDTO extends IHasId, UpdateDTO> {
  constructor(
    readonly createCmdHdl: ICommandHandler<CreateCommand<CreateDTO>, string>,
    readonly getByIdQueryHdl: IQueryHandler<BaseGetByIdQuery, E>,
    readonly listPagingQueryHdl: IQueryHandler<ListingPagingQuery<{}>, Paginated<E>>,
    readonly updateCmdHdl: ICommandHandler<UpdateCommand<UpdateDTO>, boolean>,
    readonly deleteCmdHdl: ICommandHandler<DeleteCommand, boolean>,
  ) { }

  async create(req: Request, res: Response) {
    try {
      // const { name, image, tagLine, description } = req.body;
      // const dto = req.body as BrandCreateDTO;
      const cmd = new CreateCommand<CreateDTO>(req.body as CreateDTO);

      const newId = await this.createCmdHdl.execute(cmd);

      res.status(201).json({ data: newId });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = new BaseGetByIdQuery(id);

      const data = await this.getByIdQueryHdl.execute(query);

      res.status(200).json({ data: data });

    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page = "1", limit = "10" } = req.query;

      const paging = new Paging(parseInt(page as string), parseInt(limit as string));
      paging.process();

      const query = new ListingPagingQuery<{}>(paging, {});

      const data = await this.listPagingQueryHdl.execute(query);

      res.status(200).json({ data: data });

    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const dto = req.body as UpdateDTO;

      const updateCmd = new UpdateCommand(id, dto);

      const data = await this.updateCmdHdl.execute(updateCmd);

      res.status(200).json({ data: true });

    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleteCmd = new DeleteCommand(id);

      const data = await this.deleteCmdHdl.execute(deleteCmd);

      res.status(200).json({ data: true });

    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }
}
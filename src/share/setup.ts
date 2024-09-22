import { Router } from "express";
import { Entity, IHasId } from "./interface";
import { BaseRepository } from "./repository/base-sequelize";
import { BaseHTTPService } from "./transport/base-http-service";
import { BaseCreateCommandHandler } from "./usecase/base-create.cmd";
import { BaseDeleteCommandHandler } from "./usecase/base-delete.cmd";
import { BaseGetByIdQueryHandler } from "./usecase/base-get-by-id.query";
import { BaseListingQueryHandler } from "./usecase/base-list-paging.query";
import { BaseUpdateCommandHandler } from "./usecase/base-update.cmd";

export function crudModule<E extends Entity, CreateDTO extends IHasId, UpdateDTO>(repo: BaseRepository<E>): Router {

  const createCmdHdl = new BaseCreateCommandHandler<CreateDTO>(repo);
  const queryGetByIdHdl = new BaseGetByIdQueryHandler<E>(repo);
  const listQueryHdl = new BaseListingQueryHandler<E, {}>(repo);
  const updateCmdHdl = new BaseUpdateCommandHandler<E, UpdateDTO>(repo);
  const deleteCmdHdl = new BaseDeleteCommandHandler<E>(repo);

  const router = Router();

  const service = new BaseHTTPService(createCmdHdl, queryGetByIdHdl, listQueryHdl, updateCmdHdl, deleteCmdHdl);

  router.post("", service.create.bind(service));
  router.get("", service.list.bind(service));
  router.get("/:id", service.getById.bind(service));
  router.patch("/:id", service.update.bind(service));
  router.delete("/:id", service.delete.bind(service));

  return router;
}

export function baseUsecases<E extends Entity, CreateDTO extends IHasId, UpdateDTO>(repo: BaseRepository<E>): {
  createCmdHdl: BaseCreateCommandHandler<CreateDTO>;
  queryGetByIdHdl: BaseGetByIdQueryHandler<E>;
  listQueryHdl: BaseListingQueryHandler<E, {}>;
  updateCmdHdl: BaseUpdateCommandHandler<E, UpdateDTO>;
  deleteCmdHdl: BaseDeleteCommandHandler<E>;
} {
  const createCmdHdl = new BaseCreateCommandHandler<CreateDTO>(repo);
  const queryGetByIdHdl = new BaseGetByIdQueryHandler<E>(repo);
  const listQueryHdl = new BaseListingQueryHandler<E, {}>(repo);
  const updateCmdHdl = new BaseUpdateCommandHandler<E, UpdateDTO>(repo);
  const deleteCmdHdl = new BaseDeleteCommandHandler<E>(repo);

  return { createCmdHdl, queryGetByIdHdl, listQueryHdl, updateCmdHdl, deleteCmdHdl };
}
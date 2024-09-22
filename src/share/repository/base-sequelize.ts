import { None, Option, Some } from "oxide.ts";
import { literal, Op, Sequelize } from "sequelize";
import { BaseStatus, Paginated, Paging } from "../data";
import { Entity, IRepository } from "../interface";



export abstract class BaseRepository<E extends Entity> implements IRepository<E> {
  readonly deleteStatus = BaseStatus.DELETED;

  constructor(readonly seq: Sequelize, readonly modelName: string) { }

  async insert(data: any): Promise<boolean> {
    await this.seq.models[this.modelName].create(data);
    return true;
  }

  async findById(id: string): Promise<Option<E>> {
    const data = await this.seq.models[this.modelName].findOne({ where: { id, status: { [Op.not]: this.deleteStatus } } });
    return data ? Some(data.get({ plain: true })) : None;
  }

  async findByIds(ids: Array<string>): Promise<Array<E>> {
    const rows = await this.seq.models[this.modelName].findAll({ where: { id: { [Op.in]: ids }, status: { [Op.not]: this.deleteStatus } } });
    return rows.map(item => item.get({ plain: true }));
  }

  async findByCond(cond: any): Promise<Option<E>> {
    const data = await this.seq.models[this.modelName].findOne({ where: { ...cond, status: { [Op.not]: this.deleteStatus } } });
    return data ? Some(data.get({ plain: true })) : None;
  }

  async list(cond: any, paging: Paging): Promise<Paginated<E>> {
    const { rows, count } = await this.seq.models[this.modelName].findAndCountAll({
      where: { ...cond, status: { [Op.not]: this.deleteStatus } },
      order: literal('created_at DESC'),
      limit: paging.limit,
      offset: (paging.page - 1) * paging.limit
    });

    return new Paginated(paging.page, count, paging.limit, rows.map(item => item.get({ plain: true })));
  }

  async listAll(cond: any): Promise<Array<E>> {
    const data = await this.seq.models[this.modelName].findAll({ where: { ...cond, status: { [Op.not]: this.deleteStatus } } });

    const { rows, count } = await this.seq.models[this.modelName].findAndCountAll({
      where: { ...cond, status: { [Op.not]: this.deleteStatus } },
      order: literal('id DESC'),
    });

    return rows.map(item => item.get({ plain: true }));
  }

  async update(id: string, data: any): Promise<boolean> {
    await this.seq.models[this.modelName].update(data, { where: { id } });
    return true;
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    if (!isHard) {
      await this.seq.models[this.modelName].update(
        { status: BaseStatus.DELETED },
        { where: { id } }
      );

      return true;
    }

    await this.seq.models[this.modelName].destroy({ where: { id } });

    return true;
  }
}

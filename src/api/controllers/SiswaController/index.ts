import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';

import Controller from '@controllers/Controller';
import autobind from '@utils/autobind';
import SiswaService from '@services/siswaServices';
import { ISiswaBody } from '@interfaces';
import { BadRequest } from '@utils/AppError';

@Service()
export default class SiswaController extends Controller {
  constructor(@Inject() private siswaService: SiswaService) {
    super();
  }

  @autobind
  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.siswaService.insertOne(req.body as ISiswaBody);

    this.response(res, 200, result);
  }

  @autobind
  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    const result = await this.siswaService.updateOne(
      req.body as ISiswaBody,
      parseInt(id),
    );

    this.response(res, 200, result);
  }

  @autobind
  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;

    const result = await this.siswaService.deleteOne(parseInt(id));

    this.response(res, 200, result);
  }

  @autobind
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.siswaService.findAll();
    this.response(res, 200, result);
  }

  @autobind
  public async getByNameOrId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { name, id } = req.query;

    if (name && id) throw new BadRequest('Pilih salah satu name atau id');

    let result: any;

    if (name) {
      result = await this.siswaService.findByName(name as string);
    } else if (id) {
      result = await this.siswaService.findById(parseInt(id as string));
    }
    this.response(res, 200, result);
  }
}

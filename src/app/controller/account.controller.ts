import { Context } from 'koa';
import { Post, Controller, Get, Delete } from 'koa-route-decors';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
import { AccountService } from '../service/account.service';
import * as Joi from 'joi'
import { User } from '../entities/user.entity';
import { CustomError } from '../core/error';

const schema = Joi.object<any, User>({
  username: Joi.string()
    .min(3)
    .max(30)
    .allow('', null),
  nickname: Joi.string()
    .min(3)
    .max(30)
    .allow('', null),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  gender: Joi.string(),
  id: Joi.string()
})

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) { }
  @Post()
  async register(ctx: Context, next: () => Promise<any>) {
    const userSchema = schema.fork(['username'], field => field.required())
    const { error } = userSchema.validate(ctx.request.body)
    if (error) {
      throw new CustomError(-1, error.message)
    }
    const { username, password, nickname } = ctx.request.body;
    const result = await this.accountService.insert(
      username,
      password,
      nickname
    );
    ctx.result = {
      id: result.id,
      username: result.username,
      nickname: result.nickname
    };
    await next();
  }

  @Post()
  async login(ctx: Context, next: () => Promise<any>) {
    const userSchema = schema.fork(['username'], field => field.required())
    const { error } = userSchema.validate(ctx.request.body)
    if (error) {
      throw new CustomError(-1, error.message)
    }
    const { username, password } = ctx.request.body;
    // 验证密码并生成token
    const user = await this.accountService.verifyPassword(username, password);
    const token = jwt.sign(
      { username: user.username, id: user.id },
      JWT_SECRET,
      { expiresIn: '3d' }
    );
    ctx.result = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      token
    };
    await next();
  }

  @Get()
  async getListBypage(ctx: Context, next: () => Promise<any>) {
    const { username, pageSize, pageIndex } = ctx.request.query;
    const data = await this.accountService.getListBypage(
      username,
      pageIndex,
      pageSize
    );
    ctx.result = data;
    await next();
  }

  @Delete()
  async deleteUser(ctx: Context, next: () => Promise<any>) {
    const { id } = ctx.request.query;
    await this.accountService.deleteUser(id)
    ctx.result = '删除成功'
    await next();
  }

  @Post()
  async updateUser(ctx: Context, next: () => Promise<any>) {
    const userSchema = schema.fork(['username'], field => field.required())
    const { error, value } = userSchema.validate(ctx.request.body)
    if (error) {
      throw new CustomError(-1, error.message)
    }
    await this.accountService.updateUser(value)
    ctx.result = '修改成功'
    await next()
  }
}

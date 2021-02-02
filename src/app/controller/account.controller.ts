import { Context } from 'koa';
import { Post, Controller, Get, Delete } from 'koa-route-decors';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
import { AccountService } from '../service/account.service';
import * as Joi from 'joi'

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) { }
  @Post()
  async register(ctx: Context, next: () => Promise<any>) {
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
    Joi.assert(username, Joi.number().error(new Error('查询条件不符合')))
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
    ctx.result='删除成功'
    await next();
  }

  @Post()
  async updateUser(ctx:Context,next:()=>Promise<any>){
    await this.accountService.updateUser(ctx.request.body)
    ctx.result='修改成功'
    await next()
  }
}

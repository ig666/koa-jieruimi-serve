// user/user.model.ts 创建实体模型
import { User } from '../entities/user.entity';
import { getRepository, Like, Repository } from 'typeorm';
import { cryptoPassword } from '../utils/crypot';
import { CustomError } from '../core/error';
import { Injectable } from 'koa-route-decors'; // 导入Injectable装饰器，申明该类可被注入

@Injectable()
export class UserModel {
  private repository: Repository<User>;
  private select: (keyof User)[] = ['id', 'username', 'nickname', 'gender']; // 遍历User拿到实体键名

  constructor() {
    this.repository = getRepository(User);
  }

  async create(user: User) {
    const result = await this.repository.save(user);
    return result;
  }

  async findById(id: string) {
    const user = await this.repository.findOne(id, { select: this.select });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.repository.findOne(
      { username },
      { select: this.select }
    );
    return user;
  }

  async findAndCheckPassword(username: string, password: string) {
    const user = await this.repository.findOne(
      { username, password: cryptoPassword(password, username) },
      { select: this.select }
    );
    return user;
  }

  async findAll() {
    const users = await this.repository.find({
      select: this.select
    });
    return users;
  }

  async getListBypage(username: string, pageIndex: number, pageSize: number) {
    let searchData: any;
    if (username) {
      searchData = {
        username: Like(`%${username}%`)
      }
    }
    const total = await this.repository.count(searchData);
    const list = await this.repository.find({
      where: searchData,
      skip: pageSize * (pageIndex - 1),
      take: pageSize,
      select: ['id', 'username', 'nickname', 'gender', 'createTime', 'updateTime']
    });
    const data = {
      list,
      total
    };
    return data;
  }

  async deleteUser(ids: string | string[]) {
    await this.repository.delete(ids)
  }

  async updateUser(user: User) {
    let userParams = JSON.parse(JSON.stringify(user, (key, val) => {
      if (!val) return undefined
      return val
    }))
    const id = userParams.id
    delete userParams.id
    await this.repository.update(id, userParams)
  }
}

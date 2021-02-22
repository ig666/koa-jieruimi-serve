// /pdf.dao.ts 创建实体模型
import { Between, getRepository, Like, Repository } from 'typeorm';
import { Injectable } from 'koa-route-decors'; // 导入Injectable装饰器，申明该类可被注入
import { Pdf } from '../entities/pdf.entity';

@Injectable()
export class PdfModel {
  private repository: Repository<Pdf>;

  constructor() {
    this.repository = getRepository(Pdf);
  }

  async create(Pdf: Pdf) {
    await this.repository.save(Pdf);
  }

  //   async findById(id: string) {
  //     const user = await this.repository.findOne(id, { select: this.select });
  //     return user;
  //   }

  async getPdfList(searchData: any, pageIndex: number, pageSize: number) {
    if (searchData.serviceName) {
      searchData.serviceName = Like(`%${searchData.serviceName}%`)
    }
    if (searchData.servicePerson) {
      searchData.servicePerson = Like(`%${searchData.servicePerson}%`)
    }
    if (searchData.serviceStartTime && searchData.serviceEndTime) {
      searchData.serviceTime = Between(searchData.serviceStartTime, searchData.serviceEndTime)
      delete searchData.serviceStartTime
      delete searchData.serviceEndTime
    }
    const total = await this.repository.count(searchData);
    const list = await this.repository.find({
      where: searchData,
      skip: pageSize * (pageIndex - 1),
      take: pageSize
    });
    const data = {
      list,
      total
    };
    return data;
  }

  //   async deleteUser(ids: string | string[]) {
  //     await this.repository.delete(ids)
  //   }

  //   async updateUser(user: User) {
  //     let userParams = JSON.parse(JSON.stringify(user, (key, val) => {
  //       if (!val) return undefined
  //       return val
  //     }))
  //     const id = userParams.id
  //     delete userParams.id
  //     await this.repository.update(id, userParams)
  //   }
}

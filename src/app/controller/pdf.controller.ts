import { Context } from 'koa';
import { Post, Controller, Get, Delete } from 'koa-route-decors';
import * as Joi from 'joi';
import { CustomError } from '../core/error';
import { PdfService } from '../service/pdf.service';
import { Pdf } from '../entities/pdf.entity';
import * as fs from 'fs';
const schema = Joi.object<any, Pdf>({
  serviceName: Joi.string().min(3).max(30),
  restaurant: Joi.string().max(3).max(30),
  servicePerson: Joi.string().max(30),
  serviceStartTime: Joi.date(),
  serviceEndTime: Joi.date(),
  id: Joi.string()
}).options({ allowUnknown: true });

@Controller()
export class PdfController {
  constructor(private pdfService: PdfService) {}
  @Post()
  async savePdf(ctx: Context, next: () => Promise<any>) {
    const pdfSchema = schema.fork(
      ['serviceName', 'restaurant', 'servicePerson'],
      (field) => field.required()
    );
    const { error } = pdfSchema.validate(ctx.request.body);
    if (error) {
      throw new CustomError(-1, error.message);
    }
    await this.pdfService.insert(ctx.request.body);
    ctx.result = '新增成功';
    await next();
  }
  @Get()
  async getPdfList(ctx: Context, next: () => Promise<any>) {
    const searchData = JSON.parse(
      JSON.stringify(ctx.request.query, (key, value) => {
        if (!value) return undefined;
        if (key === 'pageIndex' || key === 'pageSize') return undefined;
        return value;
      })
    );
    const { pageIndex, pageSize } = ctx.request.query;
    const data = await this.pdfService.getPdfList(
      searchData,
      pageIndex,
      pageSize
    );
    ctx.result = data;
    await next();
  }

  /**
   * 文件流写入
   */
  // @Post()
  // async saveExcel(ctx: Context, next: () => Promise<any>) {
  //   if (ctx.request.files) {
  //     let val = ctx.request.files.file as any;
  //     // 接收读出流
  //     const reader = fs.createReadStream(val.path);
  //     // 创建写入流
  //     // 3. 指定图片路径文件名（即上传图片存储目录）
  //     const stream = fs.createWriteStream(val.name);
  //     // 用管道将读出流 "倒给" 输入流
  //     reader.pipe(stream);
  //     // 4.打印上传文件在服器上存储的相对路径
  //     console.log('uploading %s -> %s', val.name, stream.path);
  //     // 5.重定向到基于根目录下的静态资源web访问路径，展示图片
  //     // ctx.redirect(stream.path.substr(6).replace(/\\/g, '/'));
  //   }
  //   await next();
  // }
}

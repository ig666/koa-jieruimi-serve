import { Context } from 'koa';
import { Post, Controller, Get, Delete } from 'koa-route-decors';
import * as Joi from 'joi'
import { CustomError } from '../core/error';
import { PdfService } from '../service/pdf.service';
import { Pdf } from '../entities/pdf.entity';

const schema = Joi.object<any, Pdf>({
  serviceName: Joi.string()
    .min(3)
    .max(30),
  restaurant: Joi.string()
    .max(3)
    .max(30),
  servicePerson: Joi.string()
    .max(30),
  serviceStartTime: Joi.date(),
  serviceEndTime: Joi.date(),
  id: Joi.string()
}).options({ allowUnknown: true })

@Controller()
export class PdfController {
  constructor(private pdfService: PdfService) { }
  @Post()
  async savePdf(ctx: Context, next: () => Promise<any>) {
    const pdfSchema = schema.fork(['serviceName', 'restaurant', 'servicePerson'], field => field.required())
    const { error } = pdfSchema.validate(ctx.request.body)
    if (error) {
      throw new CustomError(-1, error.message)
    }
    await this.pdfService.insert(ctx.request.body)
    ctx.result = '新增成功'
    await next()
  }
  @Get()
  async getPdfList(ctx: Context, next: () => Promise<any>) {
    const searchData = JSON.parse(JSON.stringify(ctx.request.query, (key, value) => {
      if (!value) return undefined
      if (key === 'pageIndex' || key === 'pageSize') return undefined
      return value
    }))
    const { pageIndex, pageSize } = ctx.request.query
    const data =await this.pdfService.getPdfList(searchData, pageIndex, pageSize)
    ctx.result=data
    await next()
  }
}

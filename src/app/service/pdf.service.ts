import { CustomError } from '../core/error';
import { Injectable } from 'koa-route-decors';
import { PdfModel } from '../dao/pdf.dao'
import { Pdf } from '../entities/pdf.entity';
import dayjs = require('dayjs');


@Injectable()
export class PdfService {
    constructor(private pdfModel: PdfModel) { }
    async insert(pdf: Pdf) {
        this.pdfModel.create(pdf)
    }
    async getPdfList(searchData: any, pageIndex: number=1, pageSize: number=10) {
        const data = await this.pdfModel.getPdfList(searchData, pageIndex, pageSize)
        data.list=data.list.map(item=>{
            if(item.createTime){
                item.createTime=dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if(item.updateTime){
                item.updateTime=dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if(item.serviceTime){
                item.serviceTime=dayjs(item.serviceTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if(item.serviceStartTime){
                item.serviceStartTime=dayjs(item.serviceStartTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if(item.serviceEndTime){
                item.serviceEndTime=dayjs(item.serviceEndTime).format('YYYY-MM-DD HH:mm:ss')
            }
            return item
        })
        return data
    }
}

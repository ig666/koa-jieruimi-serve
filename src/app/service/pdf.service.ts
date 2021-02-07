import { CustomError } from '../core/error';
import { Injectable } from 'koa-route-decors';
import { PdfModel } from '../dao/pdf.dao'
import { Pdf } from '../entities/pdf.entity';


@Injectable()
export class PdfService {
    constructor(private pdfModel: PdfModel) { }
    async insert(pdf: Pdf) {
        this.pdfModel.create(pdf)
    }
    async getPdfList(searchData: any, pageIndex: number=1, pageSize: number=10) {
        const data = await this.pdfModel.getPdfList(searchData, pageIndex, pageSize)
        return data
    }
}

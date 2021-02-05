import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Pdf } from './pdf.entity'


@Entity()
export class ServicePestisList {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    //区域
    @Column({ default: null })
    area!: string

    //问题分类
    @Column({ default: null })
    questionClassify!: string

    //具体位置
    @Column({ default: null })
    position!: string

    //现场处理方式
    @Column({ default: null })
    handling!: string

    //建议
    @Column({ default: null })
    advice!: string

    //图片地址
    @Column({ default: null })
    imgSrc!: string

    @ManyToOne(() => Pdf, pdf => pdf.servicePestisLists)
    pdf!: Pdf

    @CreateDateColumn()
    createTime!: Date;

    @UpdateDateColumn()
    updateTime!: Date;
}
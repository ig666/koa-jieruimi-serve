import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ServicePestisList } from './servicePestisList.entity'


@Entity()
export class Pdf {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    //服务商名称
    @Column({ default: null })
    serviceName!: string;

    //餐厅名称/国际编码
    @Column({ default: null })
    restaurant!: string;

    //服务日期
    @Column({default:null})
    serviceTime!: Date;

    //餐厅内部压力
    @Column({ default: null })
    restaurantStress!: string;

    //服务人员
    @Column({ default: null })
    servicePerson!: string;

    //服务形式
    @Column({ default: null })
    serviceMethod!: string;

    //服务开始时间
    @Column({ default: null })
    serviceStartTime!: Date;

    //服务结束时间
    @Column({ default: null })
    serviceEndTime!: Date;

    //餐厅虫害风险结构list
    @OneToMany(() => ServicePestisList, servicePestisList => servicePestisList.pdf,{cascade:true})
    servicePestisLists!: ServicePestisList[];

    @CreateDateColumn()
    createTime!: Date;

    @UpdateDateColumn()
    updateTime!: Date;
}
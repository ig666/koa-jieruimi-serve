import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

interface servicePestis {
    area: string,
    questionClassify: string,
    position?: string,
    handling?: string,
    advice?: string,
    imgSrc?: string
}

@Entity()
export class Pdf {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    serviceName!: string;

    @Column()
    restaurant!: string;

    @Column()
    serviceDate!: string;

    @Column()
    restaurantStress!: string;

    @Column()
    servicePerson!: string;

    @Column()
    serviceMethod!: string;

    @Column()
    serviceStartTime!: string;

    @Column()
    serviceEndTime!: string;

    @Column({type:'simple-array'})
    servicePestisList!: servicePestis[];

    @CreateDateColumn()
    createTime!: Date;
  
    @UpdateDateColumn()
    updateTime!: Date;
}
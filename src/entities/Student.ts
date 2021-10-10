import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  enrollmentId: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  firstNames: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  lastNames: string;

  @Column()
  @IsNotEmpty()
  birthDate: Date;

  @Column()
  @IsNotEmpty()
  @IsIn(["M", "F"])
  sex: "M" | "F";

  @Column()
  @IsNotEmpty()
  enrollmentDate: Date;
}

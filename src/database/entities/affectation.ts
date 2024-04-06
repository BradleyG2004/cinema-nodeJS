import {CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job";
import { Employee } from "./employee";
import { Coordinator } from "./coordinator";
import "reflect-metadata"


@Entity({ name: "affectation" })
export class Affectation {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @ManyToOne(() => Job, (job) => job.affectations)
    job: Job;

    @ManyToOne(() => Employee, (employee) => employee.affectations)
    employee: Employee;

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.affectation)
    coordinator: Coordinator;

    constructor(id: number, createdAt: Date,  job: Job, employee:Employee, coordinator: Coordinator) {
        this.id = id;
        this.createdAt = createdAt;
        this.job = job;
        this.coordinator = coordinator;
        this.employee=employee
    }
}
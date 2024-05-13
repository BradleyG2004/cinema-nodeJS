"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Affectation = void 0;
const typeorm_1 = require("typeorm");
const job_1 = require("./job");
const employee_1 = require("./employee");
const coordinator_1 = require("./coordinator");
require("reflect-metadata");
let Affectation = class Affectation {
    constructor(id, createdAt, job, employee, coordinator) {
        this.id = id;
        this.createdAt = createdAt;
        this.job = job;
        this.coordinator = coordinator;
        this.employee = employee;
    }
};
exports.Affectation = Affectation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Affectation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Affectation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_1.Job, (job) => job.affectations),
    __metadata("design:type", job_1.Job)
], Affectation.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_1.Employee, (employee) => employee.affectations),
    __metadata("design:type", employee_1.Employee)
], Affectation.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coordinator_1.Coordinator, (coordinator) => coordinator.affectation),
    __metadata("design:type", coordinator_1.Coordinator)
], Affectation.prototype, "coordinator", void 0);
exports.Affectation = Affectation = __decorate([
    (0, typeorm_1.Entity)({ name: "affectation" }),
    __metadata("design:paramtypes", [Number, Date, job_1.Job, employee_1.Employee, coordinator_1.Coordinator])
], Affectation);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeanceUsecase = void 0;
const movie_1 = require("../database/entities/movie");
const room_1 = require("../database/entities/room");
const token_1 = require("../database/entities/token");
const seance_1 = require("../database/entities/seance");
class SeanceUsecase {
    constructor(db) {
        this.db = db;
    }
    listseance(criterias) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomRepo = this.db.getRepository(room_1.Room);
            const room = yield roomRepo.findOne({ where: { id: criterias.roomid }, relations: ['seance'] });
            if (!room || room.state == false) {
                const dateDebut = criterias.from;
                const dateFin = criterias.to;
                const query = this.db.createQueryBuilder(seance_1.Seance, 'seance')
                    .where("seance.starting BETWEEN :dateDebut AND :dateFin", { dateDebut, dateFin });
                criterias.limit = 10;
                query.skip((criterias.page - 1) * criterias.limit);
                query.take(criterias.limit);
                const [seances, totalCount] = yield query.getManyAndCount();
                return {
                    seances,
                    totalCount
                };
            }
            else {
                const dateDebut = criterias.from;
                const dateFin = criterias.to;
                const query = this.db.createQueryBuilder(seance_1.Seance, 'seance')
                    .where("seance.starting BETWEEN :dateDebut AND :dateFin", { dateDebut, dateFin })
                    .andWhere("seance.roomId = :roomId", { roomId: room.id });
                criterias.limit = 10;
                query.skip((criterias.page - 1) * criterias.limit);
                query.take(criterias.limit);
                const [seances, totalCount] = yield query.getManyAndCount();
                return {
                    seances,
                    totalCount
                };
            }
        });
    }
    createSeance(start, roomId, movieId, authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            // Récupération du token et de l'utilisateur associé
            const tokenRepo = this.db.getRepository(token_1.Token);
            const token = yield tokenRepo.findOne({
                where: { token: authorization },
                relations: ['coordinator']
            });
            if (!token)
                return null;
            const user = token.coordinator;
            // Récupération de la salle
            const roomRepo = this.db.getRepository(room_1.Room);
            const room = yield roomRepo.findOne({ where: { id: roomId }, relations: ['seance'] });
            if (!room)
                return null;
            // Récupération du film
            const movieRepo = this.db.getRepository(movie_1.Movie);
            const movie = yield movieRepo.findOne({ where: { id: movieId }, relations: ['seance'] });
            if (!movie)
                return null;
            // Création de la séance
            //on verif si il y en a deja d'autres en BD
            const count = yield this.db.getRepository(seance_1.Seance)
                .createQueryBuilder("seance")
                .getCount();
            if (count < 1) {
                const seance = new seance_1.Seance();
                seance.starting = start;
                seance.ending = new Date(start.getTime() + (movie.duration + 30) * (60000));
                seance.room = room;
                seance.movie = movie;
                seance.coordinator = user;
                // Sauvegarde de la séance
                const seanceRepo = this.db.getRepository(seance_1.Seance);
                yield seanceRepo.save(seance);
                return seance;
            }
            else {
                //on cherche celles du meme film
                const rows = yield this.db.getRepository(seance_1.Seance)
                    .createQueryBuilder("seance")
                    .where("seance.movieId = :value", { value: movieId })
                    .getMany();
                let i = 0;
                while (i < rows.length) {
                    if (((start.getTime() >= rows[i].starting.getTime()) && (start.getTime() <= rows[i].ending.getTime())) || ((start.getTime() + (movie.duration + 30) * (60000) >= rows[i].starting.getTime()) && (start.getTime() + (movie.duration + 30) * (60000) <= rows[i].ending.getTime()))) {
                        return "Configurer une autre seance";
                    }
                    i++;
                }
                const seance = new seance_1.Seance();
                seance.starting = start;
                seance.ending = new Date(start.getTime() + (movie.duration + 30) * (60000));
                seance.room = room;
                seance.movie = movie;
                seance.coordinator = user;
                // Sauvegarde de la séance
                const seanceRepo = this.db.getRepository(seance_1.Seance);
                yield seanceRepo.save(seance);
                return seance;
            }
        });
    }
    listSeance(listSeanceFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(listSeanceFilter);
            const query = this.db.createQueryBuilder(seance_1.Seance, 'seance');
            query.skip((listSeanceFilter.page - 1) * listSeanceFilter.limit);
            query.take(listSeanceFilter.limit);
            const [seances, totalCount] = yield query.getManyAndCount();
            return {
                seances,
                totalCount
            };
        });
    }
    updateSeance(id, authorization, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(seance_1.Seance);
            const seancefound = yield repo.findOneBy({ id });
            if (seancefound === null)
                return null;
            if (params.starting) {
                const movieRepo = this.db.getRepository(movie_1.Movie);
                const movie = yield movieRepo.findOne({ where: { id: seancefound.movie.id }, relations: ['seance'] });
                if (!movie)
                    return null;
                const rows = yield this.db.getRepository(seance_1.Seance)
                    .createQueryBuilder("seance")
                    .where("seance.id != :Id", { Id: seancefound.id })
                    .andWhere("seance.movie != :movie", { movie: seancefound.movie })
                    .getMany();
                let i = 0;
                while (i < rows.length) {
                    if (((params.starting.getTime() >= rows[i].starting.getTime()) && (params.starting.getTime() <= rows[i].ending.getTime())) || ((params.starting.getTime() + (movie.duration + 30) * (60000) >= rows[i].starting.getTime()) && (params.starting.getTime() + (movie.duration + 30) * (60000) <= rows[i].ending.getTime()))) {
                        return "Configurer une autre seance";
                    }
                    i++;
                }
                seancefound.starting = params.starting;
                seancefound.ending = new Date(seancefound.starting.getTime() + (movie.duration + 30) * (60000));
                yield repo.save(seancefound);
            }
            if (params.movie) {
                const movieRepo = this.db.getRepository(movie_1.Movie);
                const movie = yield movieRepo.findOne({ where: { id: params.movie }, relations: ['seance'] });
                if (!movie)
                    return null;
                const rows = yield this.db.getRepository(seance_1.Seance)
                    .createQueryBuilder("seance")
                    .where("seance.movie != :movie", { movie: params.movie })
                    .getMany();
                let i = 0;
                while (i < rows.length) {
                    if (((seancefound.starting.getTime() >= rows[i].starting.getTime()) && (seancefound.starting.getTime() <= rows[i].ending.getTime())) || ((seancefound.starting.getTime() + (movie.duration + 30) * (60000) >= rows[i].starting.getTime()) && (seancefound.starting.getTime() + (movie.duration + 30) * (60000) <= rows[i].ending.getTime()))) {
                        return "Configurer une autre seance";
                    }
                    i++;
                }
                seancefound.movie = movie;
                seancefound.ending = new Date(seancefound.starting.getTime() + (movie.duration + 30) * (60000));
                yield repo.save(seancefound);
            }
            if (params.room) {
                const roomRepo = this.db.getRepository(room_1.Room);
                const room = yield roomRepo.findOne({ where: { id: params.room }, relations: ['seance'] });
                if (!room)
                    return null;
                seancefound.room = room;
                yield repo.save(seancefound);
            }
            return seancefound;
        });
    }
    getFrequentationStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seanceRepo = this.db.getRepository(seance_1.Seance);
                const totalSeances = yield seanceRepo.count();
                const seancesWithAttendees = yield seanceRepo
                    .createQueryBuilder("seance")
                    .leftJoinAndSelect("seance.attendees", "attendee")
                    .where("attendee.id IS NOT NULL")
                    .getMany();
                const totalAttendees = seancesWithAttendees.reduce((total, seance) => total + seance.attendees.length, 0);
                const averageAttendancePerSeance = totalAttendees / totalSeances;
                return {
                    totalSeances,
                    totalAttendees,
                    averageAttendancePerSeance
                };
            }
            catch (error) {
                console.error("Error calculating attendance statistics:", error);
                throw error;
            }
        });
    }
}
exports.SeanceUsecase = SeanceUsecase;

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
exports.MovieUsecase = void 0;
const movie_1 = require("../database/entities/movie");
const seance_1 = require("../database/entities/seance");
class MovieUsecase {
    constructor(db) {
        this.db = db;
    }
    listMovie(listMovieFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(listMovieFilter);
            const query = this.db.createQueryBuilder(movie_1.Movie, 'movie');
            query.skip((listMovieFilter.page - 1) * listMovieFilter.limit);
            query.take(listMovieFilter.limit);
            const [movies, totalCount] = yield query.getManyAndCount();
            return {
                movies,
                totalCount
            };
        });
    }
    updateMovie(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { name, duration }) {
            const repo = this.db.getRepository(movie_1.Movie);
            const repoS = this.db.getRepository(seance_1.Seance);
            const movieFound = yield repo.findOne({
                where: { id },
                relations: ['seance']
            });
            if (!movieFound)
                return null;
            if (duration) {
                const seances = movieFound.seance;
                const conflictingSeance = this.findConflictingSeance(seances, duration);
                if (conflictingSeance) {
                    return `Cette opération sur la seance ${conflictingSeance[0]} affecte le debut de la séance de ${conflictingSeance[1]} et donc celles d'après`;
                }
                seances.forEach(seance => {
                    seance.ending = new Date(seance.starting.getTime() + duration * 60000);
                });
                const updatedSeances = yield repoS.save(seances);
                movieFound.duration = duration;
            }
            if (name) {
                movieFound.name = name;
            }
            const updatedMovie = yield repo.save(movieFound);
            return updatedMovie;
        });
    }
    findConflictingSeance(seances, duration) {
        for (let i = 0; i < seances.length - 1; i++) {
            for (let j = i + 1; j < seances.length; j++) {
                if (seances[i].starting.getTime() + duration * 60000 >= seances[j].starting.getTime()) {
                    return [seances[i], seances[j]];
                }
            }
        }
        return undefined;
    }
}
exports.MovieUsecase = MovieUsecase;

import { DataSource } from "typeorm";
import { Movie } from "../database/entities/movie";
import { Seance } from "../database/entities/seance";

export interface ListMovieFilter {
    limit: number
    page: number
}

export interface UpdateMovieParams {
    name?: string
    duration?: number
}

export class MovieUsecase {
    constructor(private readonly db: DataSource) { }

    async listMovie(listMovieFilter: ListMovieFilter): Promise<{ movies: Movie[]; totalCount: number; }> {
        console.log(listMovieFilter)
        const query = this.db.createQueryBuilder(Movie, 'movie')
        query.skip((listMovieFilter.page - 1) * listMovieFilter.limit)
        query.take(listMovieFilter.limit)

        const [movies, totalCount] = await query.getManyAndCount()
        return {
            movies,
            totalCount
        }
    }

    async updateMovie(id: number, { name, duration }: UpdateMovieParams): Promise<Movie | null> {
        const repo = this.db.getRepository(Movie);
        const seanceRepo = this.db.getRepository(Seance);

        const movieFound = await repo.findOneBy({ id });
        if (!movieFound) return null;

        // Vérifier les séances associées
        if (duration !== undefined) {
            const associatedSeances = await seanceRepo.find({ where: { movie: movieFound } });
            const incompatibleSeances = associatedSeances.filter(seance => seance.getDuration() < duration + 15); // Inclure 15 minutes de publicité

            if (incompatibleSeances.length > 0) {
                throw new Error(
                    `Les séances suivantes ne respectent pas la nouvelle durée du film :
                    ${incompatibleSeances.map(s => `Seance ID: ${s.id}, Start: ${s.starting}, End: ${s.ending}`).join(", ")}.`
                );
            }

            movieFound.duration = duration;
        }

        if (name) {
            movieFound.name = name;
        }

        const movieUpdated = await repo.save(movieFound);
        return movieUpdated;
    }
}
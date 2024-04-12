import { DataSource } from "typeorm";
import { Movie } from "../database/entities/movie";

export interface ListMovieFilter {
    limit: number
    page: number
}

export interface UpdateMovieParams {
    name?: string
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

    async updateMovie(id: number, { name }: UpdateMovieParams): Promise<Movie | null> {
        const repo = this.db.getRepository(Movie)
        const moviefound = await repo.findOneBy({ id })
        if (moviefound === null) return null

        if (name) {
            moviefound.name = name
        }

        const movieUpdate = await repo.save(moviefound)
        return movieUpdate
    }
}
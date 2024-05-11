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

    async updateMovie(id: number, { name, duration }: UpdateMovieParams): Promise<Movie | null | string> {
        const repo = this.db.getRepository(Movie);
        const repoS = this.db.getRepository(Seance);
        const movieFound = await repo.findOne({ 
            where: { id },
            relations: ['seance']
        });
        
        if (!movieFound) return null;
    
        if (duration) {
            const seances = movieFound.seance;
            const conflictingSeance = this.findConflictingSeance(seances, duration);
    
            if (conflictingSeance) {
                return `Cette opération sur la seance ${conflictingSeance[0]} affecte le debut de la séance de ${conflictingSeance[1]} et donc celles d'après`;
            }
    
            seances.forEach(seance => {
                seance.ending = new Date(seance.starting.getTime() + duration * 60000);
            });
            const updatedSeances = await repoS.save(seances);
            movieFound.duration = duration;
        }
    
        if (name) {
            movieFound.name = name;
        } 
    
        const updatedMovie = await repo.save(movieFound);
        return updatedMovie;
    }
    
    private findConflictingSeance(seances: Seance[], duration: number): Seance[] | undefined {
        for(let i=0;i<seances.length-1;i++){
            for(let j=i+1;j<seances.length;j++){
                if(seances[i].starting.getTime()+duration*60000>=seances[j].starting.getTime()){
                    return [seances[i],seances[j]]
                }
            }
        }
        return undefined;
    }
    
}
import { DataSource } from "typeorm"
import { Coordinator } from "../database/entities/coordinator"
import { Movie } from "../database/entities/movie"
import { Room } from "../database/entities/room"
import { Token } from "../database/entities/token"
import { Seance } from "../database/entities/seance"

export interface ListseanceFilter {
    limit: number
    page: number
    from:Date
    to:Date
    roomid:number
}


export interface ListSeanceFilter {
    limit: number
    page: number
}

export class SeanceUsecase {
    constructor(private readonly db: DataSource) { }

    async listseance(criterias: ListseanceFilter): Promise<{ seances: Seance[]; totalCount: number; } | string> {
        const roomRepo = this.db.getRepository(Room);
        const room = await roomRepo.findOne({where:{id:criterias.roomid},relations: ['seance'] });
        if (!room || room.state==false){
            const dateDebut = criterias.from;
            const dateFin = criterias.to
            const query = this.db.createQueryBuilder(Seance, 'seance')
            .where("seance.starting BETWEEN :dateDebut AND :dateFin", { dateDebut, dateFin })

            criterias.limit=10
                query.skip((criterias.page - 1) * criterias.limit);
                query.take(criterias.limit);            
            
            const [seances, totalCount] = await query.getManyAndCount();
        
            return {
                seances,
                totalCount
            };
        }else{
            const dateDebut = criterias.from;
            const dateFin = criterias.to
            const query = this.db.createQueryBuilder(Seance, 'seance')
            .where("seance.starting BETWEEN :dateDebut AND :dateFin", { dateDebut, dateFin })
            .andWhere("seance.roomId = :roomId", { roomId: room.id });    
                criterias.limit=10
                query.skip((criterias.page - 1) * criterias.limit);
                query.take(criterias.limit);            
            
            const [seances, totalCount] = await query.getManyAndCount();
        
            return {
                seances,
                totalCount
            };
        }
    }
    

    async createSeance(start: Date, roomId: number, movieId: number, authorization: string): Promise<Seance | string | null> {
        // Récupération du token et de l'utilisateur associé
        const tokenRepo = this.db.getRepository(Token);
        const token = await tokenRepo.findOne({
            where: { token: authorization },
            relations: ['coordinator']
        });
        if (!token) return null;
        const user = token.coordinator;
    
        // Récupération de la salle
        const roomRepo = this.db.getRepository(Room);
        const room = await roomRepo.findOne({where:{id:roomId},relations: ['seance'] });
        if (!room) return null;
    
        // Récupération du film
        const movieRepo = this.db.getRepository(Movie);
        const movie = await movieRepo.findOne({where:{id:movieId}, relations: ['seance'] });
        if (!movie) return null;
    
        // Création de la séance
        //on verif si il y en a deja d'autres en BD
        const count = await this.db.getRepository(Seance)
        .createQueryBuilder("seance")
        .getCount()

        if (count < 1) {
            const seance = new Seance();
            seance.starting = start;
            seance.ending=new Date(start.getTime()+(movie.duration+30)*(60000));
            seance.room = room;
            seance.movie = movie;
            seance.coordinator = user;
        
            // Sauvegarde de la séance
            const seanceRepo = this.db.getRepository(Seance);
            await seanceRepo.save(seance);
            return seance;
        } else {
            //on cherche celles du meme film
            const rows = await this.db.getRepository(Seance)
            .createQueryBuilder("seance")
            .where("seance.movieId = :value", { value: movieId })
            .getMany();
            let i=0;
            while(i<rows.length){
                if(((start.getTime()*(60000)>=rows[i].starting.getTime())&&(start.getTime()+(60000)<=rows[i].ending.getTime()) || (start.getTime()+(movie.duration+30)*(60000)>rows[i].starting.getTime())&&(start.getTime()+(movie.duration+30)*(60000)<rows[i].ending.getTime()))){
                    return "Configurer une autre seance"
                }
                i++;
            } 

            const seance = new Seance();
            seance.starting = start;
            seance.ending=new Date(start.getTime()+(movie.duration+30)*(60000));
            seance.room = room;
            seance.movie = movie;
            seance.coordinator = user;
        
            // Sauvegarde de la séance
            const seanceRepo = this.db.getRepository(Seance);
            await seanceRepo.save(seance);
            return seance;

        }
        
    }

    async listSeance(listSeanceFilter: ListSeanceFilter): Promise<{ seances: Seance[]; totalCount: number; }> {
        console.log(listSeanceFilter)
        const query = this.db.createQueryBuilder(Seance, 'seance')
        query.skip((listSeanceFilter.page - 1) * listSeanceFilter.limit)
        query.take(listSeanceFilter.limit)

        const [seances, totalCount] = await query.getManyAndCount()
        return {
            seances,
            totalCount
        }
    }
}
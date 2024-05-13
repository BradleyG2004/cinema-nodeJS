 import { DataSource } from "typeorm";
import { Seance } from "../database/entities/seance";

export interface AttendanceStats {
  totalAttendees: number;
  totalSeances: number;
  averageAttendancePerSeance: number;
}

export class AttendanceUseCase {
  constructor(private readonly db: DataSource) {}

  async getAttendanceStats(): Promise<AttendanceStats> {
    try {
      const seanceRepo = this.db.getRepository(Seance);
      const totalSeances = await seanceRepo.count();

      const seancesWithAttendees = await seanceRepo
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
    } catch (error) {
      console.error("Error calculating attendance statistics:", error);
      throw error;
    }
  }
 
}

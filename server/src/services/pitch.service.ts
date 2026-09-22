import { pitchRepository } from '../repositories/pitch.repository.js';
import { Pitch, TimeSlot, AddonService, NotFoundError } from '../types/index.js';

export class PitchService {
  async getPitches(): Promise<Pitch[]> {
    return pitchRepository.getAllPitches();
  }

  async getPitchById(id: string): Promise<Pitch> {
    const pitch = await pitchRepository.getPitchById(id);
    if (!pitch) {
      throw new NotFoundError(`Không tìm thấy sân bóng với mã: ${id}`);
    }
    return pitch;
  }

  async getTimeSlots(): Promise<TimeSlot[]> {
    return pitchRepository.getAllTimeSlots();
  }

  async getAddons(): Promise<AddonService[]> {
    return pitchRepository.getAllAddons();
  }
}

export const pitchService = new PitchService();


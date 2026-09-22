import fs from 'fs/promises';
import path from 'path';
import { Pitch, TimeSlot, AddonService } from '../types/index.js';
import { config } from '../config/env.js';

interface PitchDataFile {
  pitches: Pitch[];
  timeSlots: TimeSlot[];
  addons: AddonService[];
}

export class PitchRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(config.dataDir, 'pitches.json');
  }

  private async loadData(): Promise<PitchDataFile> {
    const raw = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(raw) as PitchDataFile;
  }

  async getAllPitches(): Promise<Pitch[]> {
    const data = await this.loadData();
    return data.pitches;
  }

  async getPitchById(id: string): Promise<Pitch | null> {
    const pitches = await this.getAllPitches();
    return pitches.find(p => p.id === id) || null;
  }

  async getAllTimeSlots(): Promise<TimeSlot[]> {
    const data = await this.loadData();
    return data.timeSlots;
  }

  async getTimeSlotById(id: string): Promise<TimeSlot | null> {
    const slots = await this.getAllTimeSlots();
    return slots.find(s => s.id === id) || null;
  }

  async getAllAddons(): Promise<AddonService[]> {
    const data = await this.loadData();
    return data.addons;
  }
}

export const pitchRepository = new PitchRepository();


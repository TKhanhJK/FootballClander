import fs from 'fs/promises';
import path from 'path';
import { Booking } from '../types/index.js';
import { config } from '../config/env.js';

export class BookingRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(config.dataDir, 'bookings.json');
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  private async readAll(): Promise<Booking[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf-8');
    try {
      return JSON.parse(raw) as Booking[];
    } catch {
      return [];
    }
  }

  private async writeAll(bookings: Booking[]): Promise<void> {
    await this.ensureFile();
    // Atomic write via temporary file
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    await fs.writeFile(tempPath, JSON.stringify(bookings, null, 2), 'utf-8');
    await fs.rename(tempPath, this.filePath);
  }

  async findAll(filter?: { status?: string; pitchId?: string; date?: string }): Promise<Booking[]> {
    let list = await this.readAll();
    if (filter?.status) {
      list = list.filter(b => b.status === filter.status);
    }
    if (filter?.pitchId) {
      list = list.filter(b => b.pitchId === filter.pitchId);
    }
    if (filter?.date) {
      list = list.filter(b => b.date === filter.date);
    }
    // Return latest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: string): Promise<Booking | null> {
    const list = await this.readAll();
    return list.find(b => b.id.toLowerCase() === id.toLowerCase()) || null;
  }

  // Find active booking for the exact pitch, date and timeSlot (to detect conflicts)
  async findActiveSlotBooking(pitchId: string, date: string, timeSlotId: string): Promise<Booking | null> {
    const list = await this.readAll();
    return list.find(b => 
      b.pitchId === pitchId &&
      b.date === date &&
      b.timeSlotId === timeSlotId &&
      b.status !== 'cancelled'
    ) || null;
  }

  async create(booking: Booking): Promise<Booking> {
    const list = await this.readAll();
    list.unshift(booking);
    await this.writeAll(list);
    return booking;
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const list = await this.readAll();
    const index = list.findIndex(b => b.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const updated: Booking = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    list[index] = updated;
    await this.writeAll(list);
    return updated;
  }

  async count(): Promise<number> {
    const list = await this.readAll();
    return list.length;
  }
}

export const bookingRepository = new BookingRepository();


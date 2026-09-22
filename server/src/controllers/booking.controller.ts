import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service.js';

export class BookingController {
  // POST /api/bookings -> 201 Created (hoặc 400 Bad Request / 409 Conflict)
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newBooking = await bookingService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: 'Đăng ký thuê sân bóng đá 11 người thành công!',
        data: newBooking
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/bookings -> 200 OK
  async getBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, pitchId, date } = req.query;
      const bookings = await bookingService.getBookings({
        status: typeof status === 'string' ? status : undefined,
        pitchId: typeof pitchId === 'string' ? pitchId : undefined,
        date: typeof date === 'string' ? date : undefined
      });

      res.status(200).json({
        success: true,
        total: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/bookings/:id -> 200 OK (hoặc 404 Not Found)
  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/bookings/:id/status -> 200 OK (hoặc 400, 404)
  async updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await bookingService.updateBookingStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: `Đã cập nhật trạng thái đơn ${req.params.id} thành '${status}'.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}

export const bookingController = new BookingController();


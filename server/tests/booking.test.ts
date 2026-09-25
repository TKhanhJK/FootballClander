import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Pitch Booking API Vertical Slice', () => {
  // Test Ngày tương lai hợp lệ (tạo ngẫu nhiên để tránh conflict giữa các lần test)
  const testDate = `2026-12-${String(Math.floor(Math.random() * 20) + 10)}`;
  const testPitchId = 'pitch-01';
  const testSlotId = 'slot-3'; // Ca Tối Vàng (18:00 - 20:00)

  // 1. Test Valid Request (201 Created)
  it('POST /api/bookings - [VALID REQUEST] should create a booking with 201 Created and calculate 30% deposit', async () => {
    const validPayload = {
      customerName: 'Lê Minh Quân',
      teamName: 'FC Chiến Binh Cầu Giấy',
      phone: '0988654321',
      pitchId: testPitchId,
      date: testDate,
      timeSlotId: testSlotId,
      addons: ['referee', 'water'],
      notes: 'Trận bóng giao hữu công ty cuối tuần',
      agreeTerms: true
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');

    const booking = response.body.data;
    expect(booking).toHaveProperty('id');
    expect(booking.customerName).toBe('Lê Minh Quân');
    expect(booking.teamName).toBe('FC Chiến Binh Cầu Giấy');
    expect(booking.phone).toBe('0988654321');
    expect(booking.status).toBe('pending');

    // Kiểm tra tính toán chi phí (Sân A1 2.500.000 + Đèn LED 200.000 + Trọng tài 600.000 + Nước 200.000 = 3.500.000)
    expect(booking.totalAmount).toBe(3500000);
    // Cọc 30% = 1.050.000
    expect(booking.depositAmount).toBe(1050000);
  });

  // 2. Test Invalid Request: Thiếu thông tin bắt buộc (400 Bad Request)
  it('POST /api/bookings - [INVALID REQUEST: Missing Fields] should return 400 Bad Request', async () => {
    const invalidPayload = {
      customerName: '', // Rỗng
      teamName: '',
      phone: '',
      agreeTerms: false
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  // 3. Test Invalid Request: Số điện thoại sai định dạng VN (400 Bad Request)
  it('POST /api/bookings - [INVALID REQUEST: Invalid Phone] should reject bad phone format with 400', async () => {
    const invalidPhonePayload = {
      customerName: 'Trần Văn Nam',
      teamName: 'FC Thể Thao Trẻ',
      phone: '0123456789', // Đầu số 01 không còn hợp lệ ở VN
      pitchId: 'pitch-02',
      date: '2026-10-20',
      timeSlotId: 'slot-1',
      agreeTerms: true
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(invalidPhonePayload);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      'Số điện thoại không hợp lệ (Phải là 10 chữ số chuẩn đầu số VN 03, 05, 07, 08, 09).'
    );
  });

  // 4. Test Invalid Request: Ngày trong quá khứ (400 Bad Request)
  it('POST /api/bookings - [INVALID REQUEST: Past Date] should reject past dates with 400', async () => {
    const pastDatePayload = {
      customerName: 'Trần Văn Nam',
      teamName: 'FC Thể Thao Trẻ',
      phone: '0977112233',
      pitchId: 'pitch-02',
      date: '2020-01-01', // Quá khứ
      timeSlotId: 'slot-1',
      agreeTerms: true
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(pastDatePayload);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Không thể đặt sân cho ngày trong quá khứ.');
  });

  // 5. Test Business Rule: Chống trùng lịch / Double-booking (409 Conflict)
  it('POST /api/bookings - [BUSINESS RULE: 409 Conflict] should reject duplicate booking on same pitch, date, and slot', async () => {
    // Đội khác cố tình đặt cùng sân, cùng ngày testDate và cùng slot testSlotId
    const duplicatePayload = {
      customerName: 'Phạm Minh Tuấn',
      teamName: 'FC Đối Thủ Tranh Sân',
      phone: '0912999888',
      pitchId: testPitchId,
      date: testDate,
      timeSlotId: testSlotId,
      agreeTerms: true
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(duplicatePayload);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toContain('Xung đột lịch đặt (409 Conflict)');
  });

  // 6. Test GET /api/bookings - Retrieve persistent bookings
  it('GET /api/bookings - should return list of persistent bookings with 200 OK', async () => {
    const response = await request(app).get('/api/bookings');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // 7. Test PATCH /api/bookings/:id/status - Update status to confirmed
  it('PATCH /api/bookings/:id/status - should update status with 200 OK', async () => {
    // Lấy 1 booking đang có
    const listRes = await request(app).get('/api/bookings');
    const firstBooking = listRes.body.data[0];

    const patchRes = await request(app)
      .patch(`/api/bookings/${firstBooking.id}/status`)
      .send({ status: 'confirmed' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('confirmed');
  });
});


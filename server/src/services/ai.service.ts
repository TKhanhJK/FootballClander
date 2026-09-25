import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { pitchRepository } from '../repositories/pitch.repository.js';
import { bookingRepository } from '../repositories/booking.repository.js';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class AIService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (err) {
        console.warn('[AIService] Failed to initialize GoogleGenAI client:', err);
      }
    }
  }

  private getClient(): GoogleGenAI | null {
    if (!this.ai && config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (err) {
        console.warn('[AIService] Failed to create GoogleGenAI client:', err);
      }
    }
    return this.ai;
  }

  async chat(message: string, history: ChatMessage[] = []): Promise<{ reply: string; isAiPowered: boolean }> {
    const [pitches, timeSlots, addons, bookings] = await Promise.all([
      pitchRepository.getAllPitches(),
      pitchRepository.getAllTimeSlots(),
      pitchRepository.getAllAddons(),
      bookingRepository.findAll()
    ]);

    const activeBookings = bookings.filter(b => b.status !== 'cancelled');
    const client = this.getClient();

    // If Gemini API is configured, use Gemini
    if (client) {
      try {
        const systemInstruction = `Bạn là Trợ lý AI chuyên nghiệp và nhiệt tình của tổ hợp thể thao "Pitch Master 11" - Hệ thống quản lý và đặt sân bóng đá 11 người chuẩn FIFA.
Thời gian thực tế hôm nay: ${new Date().toISOString().split('T')[0]}.

NHIỆM VỤ CỦA BẠN:
1. Tư vấn loại sân phù hợp cho khách hàng (cỏ tự nhiên, nhân tạo, hybrid, dàn đèn chiếu sáng, sức chứa khán đài).
2. Tra cứu lịch trống chính xác dựa vào danh sách các đơn đã đặt (activeBookings) dưới đây. Nếu một sân đã có đơn đặt ở một ngày và ca cụ thể, hãy báo ca đó đã kín và gợi ý ca khác hoặc sân khác còn trống.
3. Báo giá minh bạch (bao gồm phụ phí chiếu sáng ca tối nếu có) và giới thiệu các dịch vụ gia tăng (áo tập bib, bóng thi đấu FIFA, trọng tài quốc gia, nước khoáng y tế).
4. Hướng dẫn quy trình đặt sân: Đặt cọc 30% để giữ sân, hủy trước 24h hoàn cọc 100%, hủy sau 24h mất cọc.
5. Giọng điệu hào hứng, văn minh, thể thao, dùng tiếng Việt tự nhiên và định dạng Markdown dễ đọc (bullet points, in đậm).

DỮ LIỆU SÂN HIỆN CÓ:
${JSON.stringify(pitches, null, 2)}

DỮ LIỆU CÁC CA ĐÁ (TIME SLOTS):
${JSON.stringify(timeSlots, null, 2)}

DỮ LIỆU DỊCH VỤ GIA TĂNG (ADDONS):
${JSON.stringify(addons, null, 2)}

DỮ LIỆU CÁC LỊCH ĐÃ ĐƯỢC ĐẶT (ĐÃ KÍN CHỖ):
${JSON.stringify(
  activeBookings.map(b => ({
    pitchId: b.pitchId,
    pitchName: b.pitchName,
    date: b.date,
    timeSlotId: b.timeSlotId,
    timeSlotLabel: b.timeSlotLabel,
    teamName: b.teamName
  })),
  null,
  2
)}
`;

        const contents = [
          ...history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ];

        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents as any,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const reply = response.text || 'Xin lỗi, tôi chưa thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.';
        return { reply, isAiPowered: true };
      } catch (error: any) {
        console.error('[AIService] Gemini API error, falling back to rule-based engine:', error.message || error);
        return {
          reply: this.generateRuleBasedReply(message, pitches, timeSlots, activeBookings) + 
            '\n\n*(Lưu ý: Đang hiển thị kết quả từ hệ thống nội bộ do kết nối Gemini gặp sự cố hoặc key chưa kích hoạt)*',
          isAiPowered: false
        };
      }
    }

    // Fallback mode when no API Key is set
    return {
      reply: this.generateRuleBasedReply(message, pitches, timeSlots, activeBookings),
      isAiPowered: false
    };
  }

  private generateRuleBasedReply(
    message: string,
    pitches: any[],
    timeSlots: any[],
    activeBookings: any[]
  ): string {
    const q = message.toLowerCase();

    // Check availability inquiry
    if (q.includes('trống') || q.includes('lịch') || q.includes('ca nào') || q.includes('còn sân')) {
      const availablePitchNames = pitches.map(p => `• **${p.name}** (${p.type === 'natural_grass' ? 'Cỏ tự nhiên' : 'Cỏ nhân tạo'}, ${p.hourlyRate.toLocaleString('vi-VN')} đ/ca)`).join('\n');
      return `Hiện tại tổ hợp **Pitch Master 11** có ${pitches.length} sân 11 người tiêu chuẩn:\n\n${availablePitchNames}\n\n📅 **Khung giờ thi đấu trong ngày:**\n${timeSlots.map(s => `• ${s.label}: ${s.startTime} - ${s.endTime} ${s.isPeakHour ? '(Giờ vàng + phụ thu đèn)' : ''}`).join('\n')}\n\n💡 Bạn có thể chọn sân và ngày thi đấu cụ thể trên tab **"Đặt Sân"** để hệ thống tự động kiểm tra tình trạng trống theo thời gian thực!\n\n*(💡 Bạn có thể thêm \`GEMINI_API_KEY\` vào file \`server/.env\` để kích hoạt AI Gemini phân tích chi tiết hơn)*`;
    }

    // Check pricing inquiry
    if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('chi phí') || q.includes('tiền')) {
      const priceList = pitches.map(p => `• **${p.name}**: ${p.hourlyRate.toLocaleString('vi-VN')} đ/ca (${p.dimensions})`).join('\n');
      return `💰 **BẢNG GIÁ THUÊ SÂN 11 NGƯỜI (CHUẨN FIFA):**\n\n${priceList}\n\n⚡ **Phụ phí đèn chiếu sáng:** Các ca tối (sau 17h30) có phụ thu tiền điện dàn đèn 1000 Lux từ 250.000đ - 300.000đ/ca.\n🛡️ **Chính sách đặt cọc:** Quý khách vui lòng đặt cọc 30% giá trị để hoàn tất xác nhận lịch giữ sân.`;
    }

    // Check rules / cancellation inquiry
    if (q.includes('cọc') || q.includes('hủy') || q.includes('chính sách') || q.includes('mưa')) {
      return `📋 **CHÍNH SÁCH ĐẶT & HỦY SÂN TẠI PITCH MASTER 11:**\n\n1. **Đặt cọc:** Đặt cọc 30% ngay sau khi tạo đơn để giữ sân thành công.\n2. **Hủy/Đổi lịch:**\n   - Hủy trước **24 giờ**: Hoàn cọc 100% hoặc hỗ trợ đổi sang ca khác miễn phí.\n   - Hủy sau 24 giờ: Không hoàn cọc do sân đã được khoá lịch.\n3. **Thời tiết:** Trong trường hợp mưa bão to ngập sân không đảm bảo an toàn, ban quản lý sẽ liên hệ dời lịch hoặc hoàn lại 100% tiền cọc.`;
    }

    // Default welcoming response
    return `Chào bạn! Tôi là Trợ lý sân bóng **Pitch Master 11**. ⚽\n\nTôi có thể giúp bạn:\n1. 🏟️ **Tư vấn chọn sân:** Phân tích sân cỏ tự nhiên, cỏ nhân tạo, kích thước FIFA.\n2. ⏱️ **Kiểm tra ca trống:** Tra cứu lịch các ca đá sáng, chiều, tối.\n3. 💵 **Báo giá & Dịch vụ:** Giá thuê sân, thuê áo bib, trọng tài, bóng thi đấu.\n4. 📝 **Hướng dẫn đặt sân & chính sách cọc 30%.**\n\nBạn muốn tìm sân đá vào ngày nào và khung giờ nào? Hãy cho tôi biết nhé!\n\n*(💡 Mẹo: Thêm \`GEMINI_API_KEY\` vào file \`server/.env\` để trò chuyện tự nhiên với mô hình Google Gemini)*`;
  }
}

export const aiService = new AIService();


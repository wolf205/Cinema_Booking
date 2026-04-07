// Application/Payment/Handler/ConfirmPaymentHandler.js
import AppError from "../../../Domain/Errors/AppError.js";

class ConfirmPaymentHandler {
  /**
   * @param {import('../../../Domain/Payment/Repository/PaymentRepositoryInterface.js').default}  paymentRepository
   * @param {import('../../../Domain/Booking/Repository/BookingRepositoryInterface.js').default}  bookingRepository
   * @param {import('../../../Domain/Showtime/Repository/ShowtimeRepositoryInterface.js').default} showtimeRepository
   */
  constructor(paymentRepository, bookingRepository, showtimeRepository) {
    this.paymentRepository = paymentRepository;
    this.bookingRepository = bookingRepository;
    this.showtimeRepository = showtimeRepository;
  }

  async execute(command) {
    const { id, transactionId } = command;

    // ── Bước 1: Tìm payment session ───────────────────────────────────
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new AppError(`Payment với id=${id} không tồn tại`, 404);
    }

    // ── Bước 2: Kiểm tra payment còn có thể complete không ────────────
    // isPayable() = status === "PENDING" && !isExpired()
    if (!payment.isPayable()) {
      const reason = payment.isExpired()
        ? "phiên thanh toán đã hết hạn"
        : `trạng thái hiện tại là "${payment.status}"`;
      throw new AppError(`Không thể xác nhận thanh toán: ${reason}`, 422);
    }

    // ── Bước 3: Tìm booking tương ứng ─────────────────────────────────
    const booking = await this.bookingRepository.findById(payment.bookingId);

    if (!booking) {
      throw new AppError(
        `Booking với id=${payment.bookingId} không tồn tại`,
        404,
      );
    }

    // ── Bước 4: Kiểm tra booking vẫn còn confirmable không ────────────
    // Edge case: booking hết hold trong lúc user đang ở trang TT
    // isConfirmable() = status === "PENDING" && !isHoldExpired()
    if (!booking.isConfirmable()) {
      // Đánh dấu payment FAILED luôn — session này không còn dùng được
      payment.fail();
      await this.paymentRepository.update(payment);

      throw new AppError(
        "Booking đã hết thời gian giữ ghế trong lúc thanh toán. Vui lòng đặt lại.",
        422,
      );
    }

    // ── Bước 5: Kiểm tra showtime chưa bị huỷ ────────────────────────
    // Edge case hiếm: admin huỷ showtime sau khi user đã tạo booking
    const showtime = await this.showtimeRepository.findById(booking.showtimeId);

    if (!showtime || showtime.status === "CANCELLED") {
      payment.fail();
      await this.paymentRepository.update(payment);

      throw new AppError(
        "Suất chiếu này đã bị huỷ. Vui lòng liên hệ để được hoàn tiền.",
        422,
      );
    }

    // ── Bước 6: Gọi domain methods — mutation nằm trong Entity ────────
    // Phải gọi cả 2 trước khi persist để nếu entity throw thì không có
    // gì được ghi xuống DB
    try {
      payment.complete(transactionId);
    } catch (err) {
      throw new AppError(err.message, 422);
    }

    try {
      booking.confirm();
    } catch (err) {
      throw new AppError(err.message, 422);
    }

    // ── Bước 7: Persist cả 2 trong 1 transaction ─────────────────────
    // Payment SUCCESS + Booking CONFIRMED phải xảy ra cùng lúc
    // Nếu 1 trong 2 fail → rollback toàn bộ, không bị state lệch nhau
    await this.paymentRepository.withTransaction(async (conn) => {
      await this.paymentRepository.updateWithConn(payment, conn);
      await this.bookingRepository.updateWithConn(booking, conn);
    });

    // ── Bước 8: Trả về kết quả ────────────────────────────────────────
    return {
      message: "Thanh toán thành công. Vé đã được xác nhận.",
      payment: payment.toJSON(),
      booking: booking.toJSON(),
    };
  }
}

export default ConfirmPaymentHandler;

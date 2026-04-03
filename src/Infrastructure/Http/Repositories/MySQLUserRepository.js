// Infrastructure/Persistence/Repositories/MySQLUserRepository.js
import UserRepositoryInterface from "../../../Domain/User/Repository/UserRepositoryInterface.js";
import User from "../../../Domain/User/Entity/User.js";

class MySQLUserRepository extends UserRepositoryInterface {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  // ── Tìm user theo email — dùng trong LoginHandler ─────────────────
  async findByEmail(email) {
    const [rows] = await this.pool.execute(
      `SELECT id, name, email, password_hash, role, created_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    if (rows.length === 0) return null;

    return this.#toEntity(rows[0]);
  }

  // ── Tìm user theo id — dùng trong authMiddleware ──────────────────
  async findById(id) {
    const [rows] = await this.pool.execute(
      `SELECT id, name, email, password_hash, role, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    if (rows.length === 0) return null;

    return this.#toEntity(rows[0]);
  }

  // ── Kiểm tra email tồn tại — dùng trong RegisterHandler ──────────
  // Dùng SELECT 1 thay vì SELECT * — không cần lấy data, chỉ cần biết có tồn tại không
  // Nhẹ hơn findByEmail vì không fetch passwordHash ra ngoài không cần thiết
  async existsByEmail(email) {
    const [rows] = await this.pool.execute(
      `SELECT 1
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    return rows.length > 0;
  }

  // ── Lưu user mới — dùng trong RegisterHandler ────────────────────
  async save(user) {
    const { name, email, passwordHash, role, createdAt } = user.toPersistence();

    const [result] = await this.pool.execute(
      `INSERT INTO users (name, email, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, role, createdAt],
    );

    // Trả về entity với id thật từ AUTO_INCREMENT
    return User.fromPersistence({
      id: result.insertId,
      name,
      email,
      passwordHash,
      role,
      createdAt,
    });
  }

  // ── Cập nhật user — dùng khi đổi tên, đổi password, promote admin ─
  // Chỉ update các field có thể thay đổi, không cho update email và created_at
  async update(user) {
    const { name, passwordHash, role } = user.toPersistence();

    const [result] = await this.pool.execute(
      `UPDATE users
       SET name          = ?,
           password_hash = ?,
           role          = ?
       WHERE id = ?`,
      [name, passwordHash, role, user.id],
    );

    // affectedRows = 0 nghĩa là id không tồn tại trong DB
    if (result.affectedRows === 0) {
      throw new Error(`User với id=${user.id} không tồn tại`);
    }

    return user;
  }

  // ── Lấy danh sách user có phân trang — dùng cho trang Admin ───────
  async findAll({ page = 1, limit = 20 }) {
    // Tính offset từ page
    // page=1 → offset=0, page=2 → offset=20, ...
    const offset = (page - 1) * limit;

    // Query 1: lấy data của page hiện tại
    const [rows] = await this.pool.execute(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Query 2: đếm tổng để tính totalPages ở tầng trên
    const [[{ total }]] = await this.pool.execute(
      `SELECT COUNT(*) AS total FROM users`,
    );

    return {
      data: rows.map((row) =>
        User.fromPersistence({
          id: row.id,
          name: row.name,
          email: row.email,
          passwordHash: null, // không cần passwordHash ở danh sách admin
          role: row.role,
          createdAt: row.created_at,
        }),
      ),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  // ── Private helper — map raw DB row → User entity ─────────────────
  // Dùng private method để tránh lặp code mapping ở findByEmail/findById
  #toEntity(row) {
    return User.fromPersistence({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
    });
  }
}

export default MySQLUserRepository;

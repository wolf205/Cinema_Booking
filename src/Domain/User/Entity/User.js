import Email from "./ValueObject/Email.js";

class User {
  constructor({ id, name, email, passwordHash, role, createdAt }) {
    this.id = id ?? null;
    this.name = name;
    this.email = email instanceof Email ? email : new Email(email);
    this.passwordHash = passwordHash;
    this.role = role ?? "user";
    this.createdAt = createdAt ?? new Date();
  }

  // --- Factory Methods ---

  static create({ name, email, passwordHash }) {
    return new User({
      id: null,
      name,
      email,
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });
  }

  static fromPersistence({ id, name, email, passwordHash, role, createdAt }) {
    return new User({
      id,
      name,
      email: new Email(email),
      passwordHash,
      role,
      createdAt,
    });
  }

  // --- Business Methods ---

  isAdmin() {
    return this.role === "admin";
  }

  promoteToAdmin() {
    this.role = "admin";
  }

  changeName(newName) {
    if (!newName || newName.trim().length < 2) {
      throw new Error("Tên phải có ít nhất 2 ký tự");
    }
    this.name = newName.trim();
  }

  changePassword(newPasswordHash) {
    if (!newPasswordHash) throw new Error("Password hash không hợp lệ");
    this.passwordHash = newPasswordHash;
  }

  // --- Serialization ---

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  toPersistence() {
    return {
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

export default User;

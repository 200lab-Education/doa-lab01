export enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  AVAILABLE = 'available',
  OUTOFSTOCK = 'out_of_stock',
  DELETED = 'deleted'
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted'
}

// enum('pending','confirmed','processing','shipping','deliveried','completed','canceled','refunded','deleted')

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
  REFUNDED = 'refunded',
  DELETED = 'deleted'
}

export enum PaymentMethod {
  COD = 'cod',
  ZALO = 'zalo_pay'
}

export enum ShippingMethod {
  FREE = 'free',
  STANDARD = 'standard'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum ProductGender {
  FEMALE = 'female',
  MALE = 'male',
  UNISEX = 'unisex'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class Paging {
  constructor(
    public page: number,
    public limit: number,
    // readonly cursor?: string,
    // nextCursor?: string
  ) { }

  process() {
    if (this.page <= 0) this.page = 1;
    if (this.limit <= 0) this.limit = 10;
    if (this.limit >= 1000) this.limit = 1000;
  }
}

export class Paginated<E> extends Paging {
  constructor(
    readonly page: number,
    readonly total: number,
    readonly limit: number,
    readonly data: Array<E>) {
    super(page, limit);
  }
}

export const DataNotFoundStr = "data not found";

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    // decimal into string
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        }
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        }
      }
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        }
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        }
      },
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price.toString();
        }
      }
    }
  }
})

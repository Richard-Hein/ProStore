"use server"
import { cookies } from "next/headers";

import { convertToPlainObject, formatError, round2 } from "@/lib/utils"
import { CartItem } from "@/types";
import { auth } from "@/auth";
import { prisma } from "@/src/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from './../../src/generated/prisma/index.d';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0));
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cookie and get vale
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) throw new Error("Cart session not found");

        // Get session and user id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get cart
        const cart = await getMyCart();
        // Parse and validate items
        const item = cartItemSchema.parse(data);
        const product = await prisma.product.findFirst({ where: { id: item.productId } })
        if (!product) throw new Error("Product not found");
        if (!cart) {
            // Create new cart obj
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item])
            });
            // Add to db
            await prisma.cart.create({
                data: newCart
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);
            return {
                success: true,
                message: `${product.name} added to cart`
            }
        } else {
            // Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

            if (existItem) {
                // check stock
                if (product.stock < existItem.qty + 1) {
                    throw new Error("Not enough stock")
                }
                // Increase qty
                (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1;

            } else {
                // If item doesn't exist in cart
                // Check stock
                if (product.stock < 1) throw new Error("Not enough stock");
                // Add item to the cart.items
                cart.items.push(item);
            }
            // Save to db
            await prisma.cart.update(
                {
                    where: { id: cart.id },
                    data: {
                        items: cart.items as Prisma.CartUpdateitemsInput[],
                        ...calcPrice(cart.items as CartItem[])
                    }
                });

                revalidatePath(`/product/${product.slug}`);
                return {
                    success: true,
                    message: `${product.name} ${existItem ? "updated in": "added to"} cart`
                }
        }




    } catch (error) {


        return {
            success: false,
            message: formatError(error)
        }

    }



}

export async function getMyCart() {
    // Check for cookie and get vale
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from db
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
    });

    if (!cart) return undefined;

    // convert decimals and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })


}

export async function removeItemFromCart(productId: string) {
    try {
         // Check for cookie and get vale
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) throw new Error("Cart session not found");
        // Get product
        const product = await prisma.product.findFirst({
            where: {id: productId}
        })
        if(!product) throw new Error("Product not found");
        // Get user cart
        const cart = await getMyCart();
        if(!cart) throw new Error("Cart not found!");
        // Check for item
        const exist = (cart.items as CartItem[]).find((x)=> x.productId === productId);
        if(!exist) throw new Error("Item not found!");
        // Check if only one in qty
        if(exist.qty === 1){
            // remove from cart
            cart.items = (cart.items as CartItem[]).filter((x)=> x.productId !=exist.productId);

        }else {
            // decrease qty
            (cart.items as CartItem[]).find((x)=> x.productId === productId)!.qty = exist.qty-1;
        }
         // save to db
            await prisma.cart.update({
                where: {id: cart.id},
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            });
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} is removed from cart`
            }


    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}
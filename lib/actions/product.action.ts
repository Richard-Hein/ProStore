"use server"
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from '@/src/db/prisma'
import { convertToPlainObject } from "../utils";

// Get latest products
export async function getLatestProducts() {  
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {createdAt: 'desc'}
    })
    return convertToPlainObject(data);
}


// Get Single Product by it's slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({where: {slug}});
}


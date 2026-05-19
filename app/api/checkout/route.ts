export const revalidate = 0;

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    const items =
      body.items || [];

    for (const item of items) {

      const product =
        await prisma.product.findUnique({
          where: {
            id: item.id,
          },
        });

      if (!product) {
        continue;
      }

      if (
        product.stock <
        item.qty
      ) {

        return NextResponse.json(
          {
            error:
              `${product.name} stock tidak cukup`,
          },
          {
            status: 400,
          }
        );
      }

      await prisma.product.update({
        where: {
          id: item.id,
        },

        data: {
          stock:
            product.stock -
            item.qty,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Checkout gagal",
      },
      {
        status: 500,
      }
    );
  }
}
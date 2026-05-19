import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request
) {
  try {
    const body = await req.json();

    const product =
      await prisma.product.update({
        where: {
          id: body.id,
        },
        data: {
          stock: Number(body.stock),
        },
      });

    return NextResponse.json(
      product
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Gagal update stock",
      },
      { status: 500 }
    );
  }
}
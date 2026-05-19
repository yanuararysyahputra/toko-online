export const dynamic =
  "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: any
) {
  const body = await req.json();

  const product =
    await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        stock: {
          increment: body.qty,
        },
      },
    });

  return NextResponse.json(product);
}
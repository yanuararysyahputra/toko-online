export const dynamic =
  "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: any
) {
  const body = await req.json();

  const product =
    await prisma.product.update({
      where: {
        id: params.id,
      },
      data: body,
    });

  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: any
) {
  await prisma.product.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(true);
}
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

/* GET */
export async function GET() {
  try {

    const vouchers =
      await prisma.voucher.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      vouchers
    );

  } catch {

    return NextResponse.json(
      {
        error:
          "Gagal mengambil voucher",
      },
      {
        status: 500,
      }
    );
  }
}

/* CREATE */
export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    const voucher =
      await prisma.voucher.create({
        data: {
          code:
            body.code.toUpperCase(),

          discount:
            Number(
              body.discount
            ),

          minPurchase:
            Number(
              body.minPurchase
            ),

          expiredAt:
            new Date(
              body.expiredAt
            ),
        },
      });

    return NextResponse.json(
      voucher
    );

  } catch {

    return NextResponse.json(
      {
        error:
          "Voucher gagal dibuat",
      },
      {
        status: 500,
      }
    );
  }
}

/* DELETE */
export async function DELETE(
  req: Request
) {
  try {

    const body =
      await req.json();

    await prisma.voucher.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch {

    return NextResponse.json(
      {
        error:
          "Gagal menghapus voucher",
      },
      {
        status: 500,
      }
    );
  }
}
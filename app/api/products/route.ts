export const dynamic =
  "force-dynamic";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

/* =========================
   GET PRODUCTS
========================= */
export async function GET() {
  try {
    const products =
      await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Gagal mengambil produk",
      },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE PRODUCT
========================= */
/* CREATE PRODUCT */
export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    const product =
      await prisma.product.create({
        data: {

          name:
            body.name,

          description:
            body.description,

          price:
            Number(
              body.price
            ),

          stock:
            Number(
              body.stock
            ),

          category:
            body.category,

          image:
            body.image,

          /* FLASH SALE */
          flashSalePrice:
            body.flashSalePrice
              ? Number(
                  body.flashSalePrice
                )
              : null,

          flashSaleEnd:
            body.flashSaleEnd
              ? new Date(
                  body.flashSaleEnd
                )
              : null,
        },
      });

    return NextResponse.json(
      product
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Gagal tambah produk",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   UPDATE PRODUCT
========================= */
export async function PUT(
  req: Request
) {
  try {

    const body =
      await req.json();

    const product =
      await prisma.product.update({
        where: {
          id: body.id,
        },

        data: {

          name:
            body.name,

          description:
            body.description,

          price:
            Number(
              body.price
            ),

          image:
            body.image,

          stock:
            Number(
              body.stock
            ),

          category:
            body.category,

          /* FLASH SALE */
          flashSalePrice:
            body.flashSalePrice
              ? Number(
                  body.flashSalePrice
                )
              : null,

          flashSaleEnd:
            body.flashSaleEnd
              ? new Date(
                  body.flashSaleEnd
                )
              : null,
        },
      });

    return NextResponse.json(
      product
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Gagal update produk",
      },
      {
        status: 500,
      }
    );
  }
}
/* =========================
   DELETE PRODUCT
========================= */
export async function DELETE(
  req: Request
) {
  try {
    const body = await req.json();

    await prisma.product.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Gagal hapus produk",
      },
      { status: 500 }
    );
  }
}


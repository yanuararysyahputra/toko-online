export const dynamic =
  "force-dynamic";
import { NextResponse } from "next/server";

import { cookies } from "next/headers";

export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    if (
      body.password !==
      process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          error:
            "Password salah",
        },
        {
          status: 401,
        }
      );
    }

    const cookieStore =
      await cookies();

    cookieStore.set(
      "admin-login",
      "true",
      {
        httpOnly: true,
        secure: false,
        path: "/",
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan server",
      },
      {
        status: 500,
      }
    );
  }
}
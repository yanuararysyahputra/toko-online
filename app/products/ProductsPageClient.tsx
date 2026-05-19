"use client";

import { useMemo, useState, useEffect } from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

import {
  Search,
  ShoppingBag,
  Minus,
  Plus,
  Store,
  X,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;

  flashSalePrice?: number | null;
  flashSaleEnd?: string | null;
};

export default function ProductsPageClient({
  products,
}: {
  products: Product[];
}) {
  const [search, setSearch] =
    useState("");
  
  const [selectedCategory, setSelectedCategory] =
  useState("Semua");

  const [openCart, setOpenCart] =
    useState(false);

  const [cart, setCart] = useState<{
    [key: string]: number;
  }>({});

  const [tempQty, setTempQty] =
    useState<{
      [key: string]: number;
    }>({});

  /* LOAD CART */
  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  /* SAVE CART */
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const categories = [
  "Semua",
  ...new Set(
    products.map(
      (p) => p.category
    )
  ),
];



function getFinalPrice(
  product: Product
) {

  const isFlashSale =
    product.flashSalePrice &&
    product.flashSaleEnd &&
    new Date(
      product.flashSaleEnd
    ) > new Date();

  return isFlashSale
    ? product.flashSalePrice!
    : product.price;
}

  /* FILTER */
  const filteredProducts =
    useMemo(() => {
      return products.filter(
  (product) => {

    const matchSearch =
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchCategory =
      selectedCategory ===
        "Semua" ||
      product.category ===
        selectedCategory;

    return (
      matchSearch &&
      matchCategory
    );
  }
);
    }, [
  products,
  search,
  selectedCategory,
]);

  async function applyVoucher() {

  if (!voucher) {
    toast.error(
      "Masukkan voucher"
    );
    return;
  }

  try {

    const res =
      await fetch(
        "/api/vouchers"
      );

    const data =
      await res.json();

    const found =
      data.find(
        (v: any) =>
          v.code.toLowerCase() ===
          voucher.toLowerCase()
      );

    if (!found) {
      toast.error(
        "Voucher tidak ditemukan"
      );
      return;
    }

    /* CEK DEVICE */
    const usedVouchers =
      JSON.parse(
        localStorage.getItem(
          "usedVouchers"
        ) || "[]"
      );

    const alreadyUsed =
      usedVouchers.includes(
        found.code
      );

    if (alreadyUsed) {

      toast.error(
        "Voucher sudah pernah digunakan"
      );

      return;
    }

    /* EXPIRED */
    if (
      new Date(
        found.expiredAt
      ) < new Date()
    ) {
      toast.error(
        "Voucher sudah expired"
      );
      return;
    }

    /* MIN PURCHASE */
    if (
      subtotal <
      found.minPurchase
    ) {
      toast.error(
        `Minimal belanja Rp ${found.minPurchase.toLocaleString("id-ID")}`
      );

      return;
    }

    setDiscount(
      found.discount
    );

    setFoundVoucher(
      found
    );

    setVoucherApplied(
      true
    );

    toast.success(
      "Voucher berhasil dipakai"
    );

  } catch {

    toast.error(
      "Terjadi kesalahan"
    );
  }
}

  const [voucher, setVoucher] =
  useState("");

  const [discount, setDiscount] =
    useState(0);

    const [voucherApplied, setVoucherApplied] =
  useState(false);

    const [foundVoucher, setFoundVoucher] =
  useState<any>(null);

  /* OPEN QTY */
  function addToCart(id: string) {
    if (
      products.find(
        (p) => p.id === id
      )?.stock === 0
    ) {
      toast.error("Stock habis");
      return;
    }

    setTempQty((prev) => ({
      ...prev,
      [id]: 1,
    }));
  }

  /* PLUS */
  function increase(
    id: string,
    stock: number
  ) {
    setTempQty((prev) => ({
      ...prev,
      [id]:
        (prev[id] || 1) < stock
          ? (prev[id] || 1) + 1
          : stock,
    }));
  }

  /* MINUS */
  function decrease(id: string) {
    if (
      (tempQty[id] || 1) <= 1
    ) {
      const updated = {
        ...tempQty,
      };

      delete updated[id];

      setTempQty(updated);

      return;
    }

    setTempQty((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
  }

  /* CONFIRM */
  function confirmCart(id: string) {
    setCart((prev) => ({
      ...prev,
      [id]:
        (prev[id] || 0) +
        tempQty[id],
    }));

    toast.success(
      "Produk ditambahkan"
    );

    const updated = {
      ...tempQty,
    };

    delete updated[id];

    setTempQty(updated);
  }

  /* REMOVE */
  function removeCart(id: string) {
    const updated = {
      ...cart,
    };

    delete updated[id];

    setCart(updated);

    toast.success(
      "Produk dihapus"
    );
  }

  /* CART PRODUCTS */
  const cartProducts =
    products.filter(
      (product) => cart[product.id]
    );

  /* TOTAL */
  const subtotal =
  cartProducts.reduce(
    (total, product) =>
      total +
      getFinalPrice(product) *
cart[product.id],
    0
  );

  /* AUTO REMOVE VOUCHER */
useEffect(() => {

  if (
    voucherApplied &&
    foundVoucher &&
    subtotal <
      foundVoucher.minPurchase
  ) {

    setDiscount(0);

    setVoucher("");

    setFoundVoucher(null);

    setVoucherApplied(false);

    toast.error(
      "Voucher dibatalkan karena minimal belanja tidak terpenuhi"
    );
  }

}, [
  subtotal,
  foundVoucher,
  voucherApplied,
]);

const validDiscount =
  voucherApplied &&
  foundVoucher &&
  subtotal >=
    foundVoucher.minPurchase
    ? discount
    : 0;

const totalPrice =
  subtotal -
  subtotal *
    (validDiscount / 100);

  const totalItems =
    Object.values(cart).reduce(
      (a, b) => a + b,
      0
    );

  /* CHECKOUT */
  async function checkoutWhatsApp() {

  if (cartProducts.length === 0)
    return;

  const message =
    cartProducts
      .map(
        (item) =>
          `• ${item.name} x${cart[item.id]} = Rp ${(getFinalPrice(item) *
cart[item.id]).toLocaleString("id-ID")}`
      )
      .join("%0A");

  /* STATUS VOUCHER */
  const voucherText =
    validDiscount > 0
      ? `%0A%0A🎫 Voucher: ${voucher.toUpperCase()} (${validDiscount}% OFF)%0A💸 Hemat: Rp ${(
          subtotal *
          (validDiscount / 100)
        ).toLocaleString("id-ID")}`
      : `%0A%0A🎫 Voucher: Tidak menggunakan voucher`;

  const finalMessage =
    `Halo, saya ingin membeli:%0A%0A${message}${voucherText}%0A%0ASubtotal: Rp ${subtotal.toLocaleString(
      "id-ID"
    )}%0ATotal: Rp ${totalPrice.toLocaleString(
      "id-ID"
    )}`;


    /* SIMPAN VOUCHER DEVICE */
if (
  voucherApplied &&
  foundVoucher
) {

  const usedVouchers =
    JSON.parse(
      localStorage.getItem(
        "usedVouchers"
      ) || "[]"
    );

  /* HINDARI DUPLIKAT */
  if (
    !usedVouchers.includes(
      foundVoucher.code
    )
  ) {

    usedVouchers.push(
      foundVoucher.code
    );

    localStorage.setItem(
      "usedVouchers",
      JSON.stringify(
        usedVouchers
      )
    );
  }
}

/* UPDATE STOCK */
await fetch(
  "/api/checkout",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      items:
        cartProducts.map(
          (item) => ({
            id: item.id,

            qty:
              cart[item.id],
          })
        ),
    }),
  }
);

  window.open(
    `https://wa.me/6285176860801?text=${finalMessage}`,
    "_blank"
  );

  /* KOSONGKAN CART */
setCart({});

localStorage.removeItem(
  "cart"
);

setVoucher("");

setDiscount(0);

setFoundVoucher(null);

setVoucherApplied(false);

setOpenCart(false);



  toast.success(
    "Checkout berhasil"
  );
}

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007ACC] flex items-center justify-center text-white">
              <Store size={18} />
            </div>

            <div>
              <h1 className="font-bold text-black">
                Toko Aga
              </h1>

              <p className="text-xs text-zinc-500">
                Toko Sembako
              </p>
            </div>
          </div>

          {/* CART */}
          <button
            onClick={() =>
              setOpenCart(true)
            }
            className="relative bg-[#007ACC] hover:bg-[#0062A3] transition text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <ShoppingBag size={17} />

            Kantong Belanjaan

            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          <div>
            <h2 className="text-3xl font-bold text-black">
              Sembako Pilihan
            </h2>

            <p className="text-zinc-500 mt-1">
              Pilih kebutuhan terbaik kamu
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              placeholder="Cari sembako..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-white border border-blue-100 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-[#007ACC]"
            />
          </div>
        </div>

{/* CATEGORY */}
<div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">

  {categories.map(
    (category) => (

      <button
        key={category}
        onClick={() =>
          setSelectedCategory(
            category
          )
        }
        className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition font-medium ${
          selectedCategory ===
          category
            ? "bg-[#007ACC] text-white"
            : "bg-white border border-blue-100 text-zinc-600"
        }`}
      >
        {category}
      </button>
    )
  )}
</div>

        {/* PRODUCTS */}
        {filteredProducts.length >
        0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {filteredProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  {/* IMAGE */}
<div className="relative">

  {/* FLASH SALE BADGE */}
  {product.flashSalePrice &&
   product.flashSaleEnd &&
   new Date(
     product.flashSaleEnd
   ) > new Date() && (

    <div className="absolute top-2 left-2 z-20 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
      🔥 FLASH SALE
    </div>
  )}

  <img
    src={
      product.image &&
      product.image.trim() !==
        ""
        ? product.image
        : "https://placehold.co/400x300/png?text=Sembako"
    }
    alt={
      product.name
    }
    className="w-full h-[140px] object-contain bg-[#F8FAFF] p-2"
  />

  {/* STOCK */}
  <div
    className={`absolute top-2 right-2 text-white text-[10px] px-2 py-1 rounded-full ${
      product.stock >
      0
        ? "bg-[#007ACC]"
        : "bg-red-500"
    }`}
  >
    {product.stock >
    0
      ? `Stock ${product.stock}`
      : "Habis"}
  </div>
</div>

                  {/* BODY */}
                  <div className="p-3">

                    {/* CATEGORY */}
                    <div className="mb-2">
                      <span className="bg-blue-100 text-[#007ACC] text-[10px] px-2 py-1 rounded-full">
                        {
                          product.category
                        }
                      </span>
                    </div>

                    <h2 className="font-bold text-sm text-black line-clamp-1">
                      {product.name}
                    </h2>

                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
                      {
                        product.description
                      }
                    </p>

                    


    {/* FLASH SALE INFO */}
{product.flashSalePrice &&
 product.flashSaleEnd &&
 new Date(product.flashSaleEnd) >
   new Date() && (

  <>
    <div className="mt-3 flex items-center gap-2">

      <span className="text-zinc-400 line-through text-xs">
        Rp{" "}
        {product.price.toLocaleString(
          "id-ID"
        )}
      </span>

      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">
        -
        {Math.round(
          ((product.price -
            product.flashSalePrice) /
            product.price) *
            100
        )}
        %
      </span>
    </div>

    <p className="text-[10px] text-red-500 mt-1 font-medium">
      Berakhir:
      {" "}
      {new Date(
        product.flashSaleEnd
      ).toLocaleDateString(
        "id-ID"
      )}
    </p>
  </>
)}


{/* PRICE */}
<div className="mt-3">
  <p className="text-lg font-bold text-black">
    Rp{" "}
    {getFinalPrice(
      product
    ).toLocaleString(
      "id-ID"
    )}
  </p>
</div>

                    {/* ACTION */}
                    <div className="mt-3">
                      {!tempQty[
                        product.id
                      ] ? (
                        <button
                          onClick={() =>
                            addToCart(
                              product.id
                            )
                          }
                          disabled={
                            product.stock ===
                            0
                          }
                          className="w-full bg-[#007ACC] disabled:bg-zinc-300 hover:bg-[#0062A3] transition text-white py-2 rounded-xl text-sm font-semibold"
                        >
                          {product.stock >
                          0
                            ? "Beli"
                            : "Stock Habis"}
                        </button>
                      ) : (
                        <div className="space-y-2">

                          {/* QTY */}
                          <div className="flex items-center justify-between bg-blue-50 rounded-xl p-1">
                            <button
                              onClick={() =>
                                decrease(
                                  product.id
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-white border border-blue-100 flex items-center justify-center"
                            >
                              <Minus
                                size={
                                  14
                                }
                              />
                            </button>

                            <span className="font-semibold text-sm">
                              {
                                tempQty[
                                  product
                                    .id
                                ]
                              }
                            </span>

                            <button
                              onClick={() =>
                                increase(
                                  product.id,
                                  product.stock
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-[#007ACC] text-white flex items-center justify-center"
                            >
                              <Plus
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>

                          {/* CONFIRM */}
                          <button
                            onClick={() =>
                              confirmCart(
                                product.id
                              )
                            }
                            className="w-full bg-[#007ACC] hover:bg-[#0062A3] transition text-white py-2 rounded-xl text-sm font-semibold"
                          >
                            Konfirmasi
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* EMPTY */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <Search
                size={40}
                className="text-[#007ACC]"
              />
            </div>

            <h2 className="text-2xl font-bold text-black">
              Barang Tidak Ditemukan
            </h2>

            <p className="text-zinc-500 mt-2 text-center">
              Coba kata kunci lain
            </p>
          </div>
        )}
      </div>

      {/* BACKDROP */}
      {openCart && (
        <div
          onClick={() =>
            setOpenCart(false)
          }
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] bg-white shadow-2xl z-50 transition duration-300 ${
          openCart
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="h-16 border-b border-zinc-100 px-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">
            Keranjang
          </h2>

          <button
            onClick={() =>
              setOpenCart(false)
            }
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 flex flex-col gap-4 h-[calc(100%-64px)]">

          {/* PRODUCTS */}
          <div className="flex-1 overflow-auto space-y-4">
            {cartProducts.length >
            0 ? (
              cartProducts.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-[#F8FAFF] p-3 rounded-2xl"
                  >
                    <img
                      src={
                        item.image &&
                        item.image.trim() !==
                          ""
                          ? item.image
                          : "https://placehold.co/400x300/png?text=Sembako"
                      }
                      className="w-16 h-16 rounded-xl object-contain bg-white p-1"
                    />

                    <div className="flex-1">
  <h3 className="font-semibold text-sm">
    {item.name}
  </h3>

  <p className="font-bold text-sm mt-1">
    Rp{" "}
    {(
  getFinalPrice(item) *
  cart[item.id]
).toLocaleString(
      "id-ID"
    )}
  </p>

  {/* QTY CONTROL */}
  <div className="flex items-center gap-2 mt-3">
    
    {/* MINUS */}
    <button
      onClick={() => {
        if (cart[item.id] <= 1) {
          removeCart(item.id);
          return;
        }

        setCart((prev) => ({
          ...prev,
          [item.id]:
            prev[item.id] - 1,
        }));
      }}
      className="w-7 h-7 rounded-lg border border-blue-100 flex items-center justify-center bg-white"
    >
      <Minus size={14} />
    </button>

    {/* QTY */}
    <span className="text-sm font-semibold min-w-[20px] text-center">
      {cart[item.id]}
    </span>

    {/* PLUS */}
    <button
      onClick={() => {
        if (
          cart[item.id] >=
          item.stock
        ) {
          toast.error(
            "Melebihi stock"
          );
          return;
        }

        setCart((prev) => ({
          ...prev,
          [item.id]:
            prev[item.id] + 1,
        }));
      }}
      className="w-7 h-7 rounded-lg bg-[#007ACC] text-white flex items-center justify-center"
    >
      <Plus size={14} />
    </button>
  </div>
</div>

                    <button
                      onClick={() =>
                        removeCart(
                          item.id
                        )
                      }
                      className="text-red-500"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                )
              )
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Yahh.. keranjang nya masih kosong nih
              </div>
            )}
          </div>

            <div className="space-y-2 mb-4">

  <input
    type="text"
    placeholder="Kode voucher"
    value={voucher}
    onChange={(e) =>
      setVoucher(
        e.target.value
      )
    }
    className="w-full border border-blue-100 rounded-xl px-4 py-3"
  />

  <button
    onClick={applyVoucher}
    className="w-full bg-[#007ACC] text-white py-2 rounded-xl"
  >
    Pakai Voucher
  </button>
</div>
          {/* TOTAL */}
          <div className="border-t border-zinc-100 pt-4">
            {/* DETAIL VOUCHER */}
            <div className="flex items-center justify-between text-xs mt-1">
  <span className="text-zinc-600">
    Min. Belanja
  </span>

  <span className="font-bold text-green-600">
    Rp{" "}
    {foundVoucher?.minPurchase?.toLocaleString(
      "id-ID"
    )}
  </span>
</div>
{validDiscount > 0 && (
  <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">

    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-600">
        Voucher
      </span>

      <span className="font-semibold text-green-600">
        {voucher.toUpperCase()}
      </span>
    </div>

    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-zinc-600">
        Potongan
      </span>

      <span className="font-bold text-green-600">
        {validDiscount}%
      </span>
    </div>

    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-zinc-600">
        Hemat
      </span>

      <span className="font-bold text-green-600">
        Rp{" "}
        {(
          subtotal *
          (validDiscount / 100)
        ).toLocaleString(
          "id-ID"
        )}
      </span>
    </div>
  </div>
)}

            <div className="space-y-1 mb-3">

  {/* SUBTOTAL */}
  <div className="flex items-center justify-between text-sm">
    <span className="text-zinc-500">
      Subtotal
    </span>

    <span className="font-medium">
      Rp{" "}
      {subtotal.toLocaleString(
        "id-ID"
      )}
    </span>
  </div>

  {/* DISCOUNT */}
  {validDiscount > 0 && (
    <div className="flex items-center justify-between text-sm">
      <span className="text-green-600">
        Diskon
      </span>

      <span className="font-bold text-green-600">
        - Rp{" "}
        {(
          subtotal *
          (validDiscount / 100)
        ).toLocaleString(
          "id-ID"
        )}
      </span>
    </div>
  )}

  {/* TOTAL */}
  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
    <span className="text-zinc-700 font-medium">
      Total
    </span>

    <span className="text-2xl font-bold text-[#007ACC]">
      Rp{" "}
      {totalPrice.toLocaleString(
        "id-ID"
      )}
    </span>
  </div>
</div>

            <button
              onClick={
                checkoutWhatsApp
              }
              disabled={
                cartProducts.length ===
                0
              }
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-300 transition text-white py-2.5 rounded-xl font-semibold"
            >
              Checkout by WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING WA */}
      <a
  href="https://wa.me/6281234567890?text=Halo%20admin,%20saya%20ingin%20bertanya%20stok%20produk"
  target="_blank"
  className="fixed bottom-5 right-5 z-40"
>
        <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition flex items-center justify-center shadow-2xl shadow-green-500/30 text-white">
          <FaWhatsapp size={30} />
        </div>
      </a>

      {/* FOOTER */}
<footer className="mt-10 bg-[#007ACC] text-white">

  <div className="max-w-7xl mx-auto px-3 py-6">

    {/* TOP */}
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

      {/* BRAND */}
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-lg shrink-0">
          🛒
        </div>

        <div>
          <h2 className="text-sm font-bold">
            Toko Aga
          </h2>

          <p className="text-white/70 text-xs">
            Belanja kebutuhan harian
          </p>
        </div>
      </div>

      {/* KONTAK */}
      <div>

        <h3 className="font-semibold text-sm mb-2">
          Kontak
        </h3>

        <div className="flex flex-col gap-2 text-xs text-white/80">

          <p>
            📞 0812-3456-7890
          </p>

          <p>
            ✉ tokoaga@gmail.com
          </p>
        </div>
      </div>

      {/* SOSMED */}
<div className="col-span-2 md:col-span-1">

  <h3 className="font-semibold text-sm mb-3 text-center">
    Develop By 
  </h3>

  <div className="flex justify-center gap-3">

    {/* INSTAGRAM */}
    <a
      href="https://www.instagram.com/yanuararysyahputra/"
      target="_blank"
      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-pink-500 transition flex items-center justify-center cursor-pointer text-lg"
    >
      <FaInstagram />
    </a>

    {/* WHATSAPP */}
    <a
      href="https://wa.me/62895379301095"
      target="_blank"
      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-green-500 transition flex items-center justify-center cursor-pointer text-lg"
    >
      <FaWhatsapp />
    </a>

    {/* TIKTOK */}
    <a
      href="https://www.tiktok.com/@yanuararysyahputra?_t=8ZirXILFTsY&_r=1"
      target="_blank"
      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-black transition flex items-center justify-center cursor-pointer text-lg"
    >
      <FaTiktok />
    </a>
  </div>
</div>
    </div>

    {/* BOTTOM */}
    <div className="border-t border-white/10 mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">

      <p className="text-[11px] text-white/70 text-center w-full">
  © 2026 Yanuar Ary Syahputra — All Rights Reserved
</p>

      <div className="flex gap-4 text-[11px] text-white/70">

        <p className="hover:text-white transition cursor-pointer">
          Privacy
        </p>

        <p className="hover:text-white transition cursor-pointer">
          Terms
        </p>

        <p className="hover:text-white transition cursor-pointer">
          Support
        </p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

import {
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

import { UploadButton } from "@/utils/uploadthing";

import {
  Store,
  Search,
  Pencil,
  Trash2,
  Plus,
  Ticket,
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

  flashSalePrice?: number;
  flashSaleEnd?: string;
};

type Voucher = {
  id: string;
  code: string;
  discount: number;
  minPurchase: number;
  expiredAt: string;
  isActive: boolean;
};

export default function AdminPage() {

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showVoucher, setShowVoucher] =
    useState(false);
  

  const [voucherCode, setVoucherCode] =
    useState("");

  const [
    voucherDiscount,
    setVoucherDiscount,
  ] = useState("");

  const [
    voucherMinPurchase,
    setVoucherMinPurchase,
  ] = useState("");

  const [
  voucherMaxDiscount,
  setVoucherMaxDiscount,
] = useState("");
  const [
    voucherExpired,
    setVoucherExpired,
  ] = useState("");

  const [vouchers, setVouchers] =
    useState<Voucher[]>([]);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      price: "",
      image: "",
      stock: "",
      category: "Bahan Pokok",

      flashSalePrice: "",
      flashSaleEnd: "",
    });

  /* =========================
     FETCH PRODUCTS
  ========================= */
  async function fetchProducts() {

    const res =
      await fetch(
        "/api/products"
      );

    const data =
      await res.json();

    setProducts(data);
  }

  /* =========================
     FETCH VOUCHERS
  ========================= */
  async function fetchVouchers() {

    const res =
      await fetch(
        "/api/vouchers"
      );

    const data =
      await res.json();

    setVouchers(data);
  }

  useEffect(() => {

    fetchProducts();

    fetchVouchers();

  }, []);

  /* =========================
     SUBMIT PRODUCT
  ========================= */
  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!form.image) {

      toast.error(
        "Upload gambar terlebih dahulu"
      );

      return;
    }

    setLoading(true);

    const method =
      editingId
        ? "PUT"
        : "POST";

    const body =
      editingId
        ? {
            id:
              editingId,
            ...form,
          }
        : form;

    const res =
      await fetch(
        "/api/products",
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              body
            ),
        }
      );

    setLoading(false);

    if (res.ok) {

      toast.success(
        editingId
          ? "Produk berhasil diupdate"
          : "Produk berhasil ditambahkan"
      );

      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        stock: "",
        category:
          "Bahan Pokok",

        flashSalePrice:
          "",

        flashSaleEnd:
          "",
      });

      setEditingId(null);

      setShowForm(false);

      fetchProducts();
    }
  }

  /* =========================
     CREATE VOUCHER
  ========================= */
  async function createVoucher() {

    try {

      if (
        !voucherCode ||
        !voucherDiscount
      ) {

        toast.error(
          "Isi voucher terlebih dahulu"
        );

        return;
      }

      const res =
        await fetch(
          "/api/vouchers",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                code:
                  voucherCode,

                discount:
                  Number(
                    voucherDiscount
                  ),

                minPurchase:
                  Number(
                    voucherMinPurchase
                  ),
                
                maxDiscount:
  Number(
    voucherMaxDiscount
  ),

                expiredAt:
                  voucherExpired,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
            "Gagal membuat voucher"
        );

        return;
      }

      toast.success(
        "Voucher berhasil dibuat"
      );

      setVoucherCode("");
      setVoucherDiscount("");
      setVoucherMinPurchase("");
      setVoucherExpired("");

      fetchVouchers();

      setShowVoucher(false);

    } catch {

      toast.error(
        "Terjadi kesalahan"
      );
    }
  }

  /* =========================
     DELETE PRODUCT
  ========================= */
  async function deleteProduct(
    id: string
  ) {

    const confirmDelete =
      confirm(
        "Hapus produk?"
      );

    if (!confirmDelete)
      return;

    const res =
      await fetch(
        "/api/products",
        {
          method:
            "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              id,
            }),
        }
      );

    if (res.ok) {

      toast.success(
        "Produk berhasil dihapus"
      );

      fetchProducts();
    }
  }

  /* =========================
     EDIT PRODUCT
  ========================= */
  function editProduct(
    product: Product
  ) {

    setEditingId(
      product.id
    );

    setShowForm(true);

    setForm({
      name:
        product.name,

      description:
        product.description,

      price:
        product.price.toString(),

      image:
        product.image,

      stock:
        product.stock.toString(),

      category:
        product.category,

      flashSalePrice:
        product.flashSalePrice
          ? product.flashSalePrice.toString()
          : "",

      flashSaleEnd:
        product.flashSaleEnd
          ? product.flashSaleEnd.slice(
              0,
              16
            )
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }

  /* =========================
     ADD STOCK
  ========================= */
  async function addStock(
    id: string,
    currentStock: number
  ) {

    const qty =
      prompt(
        "Tambah stok berapa?"
      );

    if (!qty) return;

    const res =
      await fetch(
        "/api/products/stock",
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              id,

              stock:
                currentStock +
                Number(qty),
            }),
        }
      );

    if (res.ok) {

      toast.success(
        "Stock berhasil ditambah"
      );

      fetchProducts();
    }
  }

  /* =========================
     FILTER PRODUCTS
  ========================= */
  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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
                Admin Dashboard
              </h1>

              <p className="text-xs text-zinc-500">
                Kelola Produk
              </p>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex items-center gap-2">

            {/* PRODUCT */}
            <button
              onClick={() =>
                setShowForm(
                  !showForm
                )
              }
              className="bg-[#007ACC] hover:bg-[#0062A3] transition text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Plus size={16} />

              {showForm
                ? "Tutup Form"
                : "Tambah Produk"}
            </button>

            {/* VOUCHER */}
            <button
              onClick={() =>
                setShowVoucher(
                  !showVoucher
                )
              }
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Ticket size={16} />

              {showVoucher
                ? "Tutup Voucher"
                : "Tambah Voucher"}
            </button>

            {/* LOGOUT */}
            <button
              onClick={async () => {

                await fetch(
                  "/api/logout",
                  {
                    method:
                      "POST",
                  }
                );

                window.location.href =
                  "/login";
              }}
              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* PRODUCT FORM */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm mb-8">

            <h2 className="text-2xl font-bold text-black mb-6">
              {editingId
                ? "Edit Produk"
                : "Tambah Produk"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* IMAGE */}
              <div className="border-2 border-dashed border-blue-100 rounded-3xl p-6 bg-blue-50/50">

                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="max-w-full max-h-[220px] object-contain rounded-2xl mx-auto"
                  />
                ) : (
                  <div className="flex justify-center py-10 text-zinc-500">
                    Upload gambar produk
                  </div>
                )}

                <div className="flex justify-center mt-5">

                  <UploadButton
                    endpoint="imageUploader"

                    className="ut-button:bg-[#007ACC]"

                    appearance={{
                      container:
                        "flex flex-col items-center gap-3",

                      button:
                        "bg-[#007ACC] hover:bg-[#0062A3] text-white px-5 py-2 rounded-xl border-0",

                      allowedContent:
                        "text-black text-sm",
                    }}

                    content={{
                      button() {
                        return form.image
                          ? "Ganti Gambar"
                          : "Upload Gambar";
                      },

                      allowedContent() {
                        return "PNG, JPG hingga 4MB";
                      },
                    }}

                    onClientUploadComplete={(
                      res
                    ) => {

                      if (
                        !res ||
                        !res[0]
                      ) {

                        toast.error(
                          "Upload gagal"
                        );

                        return;
                      }

                      setForm(
                        (prev) => ({
                          ...prev,

                          image:
                            res[0].url,
                        })
                      );

                      toast.success(
                        "Upload berhasil"
                      );
                    }}
                  />
                </div>
              </div>

              {/* INPUT */}
              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Nama Produk"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"                />

                <input
                  type="number"
                  placeholder="Harga"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price:
                        e.target.value,
                    })
                  }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock:
                        e.target.value,
                    })
                  }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black"                >
                  <option>
                    Bahan Pokok
                  </option>

                  <option>
                    Minuman
                  </option>

                  <option>
                    Keperluan Bayi
                  </option>

                  <option>
                    Makanan
                  </option>

                  <option>
                    Lainnya
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* FLASH SALE PRICE */}
  <div className="space-y-2">

    <label className="text-sm font-semibold text-zinc-700">
      Harga Flash Sale
    </label>

    <input
      type="number"
      placeholder="Contoh: 25000"
      value={form.flashSalePrice}
onChange={(e) =>
  setForm({
    ...form,
    flashSalePrice:
      e.target.value,
  })
}
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"    />

    <p className="text-xs text-zinc-500">
      Kosongkan jika tidak ingin flash sale.
    </p>
  </div>

  {/* FLASH SALE END */}
  <div className="space-y-2">

    <label className="text-sm font-semibold text-zinc-700">
      Tanggal Berakhir Flash Sale
    </label>

    <input
      type="datetime-local"
      value={form.flashSaleEnd}
onChange={(e) =>
  setForm({
    ...form,
    flashSaleEnd:
      e.target.value,
  })
}
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"    />

    <p className="text-xs text-zinc-500">
      Setelah waktu habis,
      harga otomatis kembali normal.
    </p>
  </div>
</div>

              {/* DESCRIPTION */}
              <textarea
                placeholder="Deskripsi"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                rows={4}
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none resize-none text-black placeholder:text-zinc-500"              />

              {/* BUTTON */}
              <button className="bg-[#007ACC] hover:bg-[#0062A3] transition text-white px-8 py-3 rounded-2xl font-semibold">
                {loading
                  ? "Loading..."
                  : editingId
                  ? "Update Produk"
                  : "Tambah Produk"}
              </button>
            </form>
          </div>
        )}

        {/* VOUCHER FORM */}
        {showVoucher && (
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm mb-8">

            <h2 className="text-2xl font-bold text-black mb-5">
              Tambah Voucher
            </h2>

            <div className="grid md:grid-cols-5 gap-4">

              <input
                type="text"
                placeholder="Kode Voucher"
                value={voucherCode}
                onChange={(e) =>
                  setVoucherCode(
                    e.target.value
                  )
                }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"              />

              <input
                type="number"
                placeholder="Potongan (%)"
                value={voucherDiscount}
                onChange={(e) =>
                  setVoucherDiscount(
                    e.target.value
                  )
                }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"              />

              <input
                type="number"
                placeholder="Minimal Belanja"
                value={
                  voucherMinPurchase
                }
                onChange={(e) =>
                  setVoucherMinPurchase(
                    e.target.value
                  )
                }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"              />

              <input
  type="number"
  placeholder="Maksimal Diskon"
  value={voucherMaxDiscount}
  onChange={(e) =>
    setVoucherMaxDiscount(
      e.target.value
    )
  }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"/>

              <input
                type="date"
                value={
                  voucherExpired
                }
                onChange={(e) =>
                  setVoucherExpired(
                    e.target.value
                  )
                }
className="w-full bg-[#F5F9FF] border border-blue-100 rounded-2xl px-4 py-3 outline-none text-black placeholder:text-zinc-500"              />

              <button
                type="button"
                onClick={
                  createVoucher
                }
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold"
              >
                Simpan Voucher
              </button>
            </div>
          </div>
        )}

        {/* MANAGE VOUCHER */}
        <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-black">
                Manage Voucher
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Kelola voucher toko
              </p>
            </div>

            <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm font-semibold">
              {vouchers.length} Voucher
            </div>
          </div>

          <div className="space-y-4">

            {vouchers.length ===
              0 && (
              <div className="text-center py-10 text-zinc-400">
                Belum ada voucher
              </div>
            )}

            {vouchers.map(
              (voucher) => {

                const expired =
                  new Date(
                    voucher.expiredAt
                  ) <
                  new Date();

                return (
                  <div
                    key={
                      voucher.id
                    }
                    className="border border-blue-100 rounded-2xl p-4 flex items-center justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="font-bold text-black">
                          {
                            voucher.code
                          }
                        </h3>

                        <span
                          className={`text-[10px] px-2 py-1 rounded-full ${
                            expired
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {expired
                            ? "Expired"
                            : "Aktif"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-500">

                        <span>
                          Diskon{" "}
                          <b>
                            {
                              voucher.discount
                            }
                            %
                          </b>
                        </span>

                        <span>
                          Min Belanja{" "}
                          <b>
                            Rp{" "}
                            {voucher.minPurchase.toLocaleString(
                              "id-ID"
                            )}
                          </b>
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-2">
                        Berlaku sampai{" "}
                        {new Date(
                          voucher.expiredAt
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month:
                              "long",
                            year:
                              "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={async () => {

                        const confirmDelete =
                          confirm(
                            "Hapus voucher?"
                          );

                        if (
                          !confirmDelete
                        )
                          return;

                        const res =
                          await fetch(
                            "/api/vouchers",
                            {
                              method:
                                "DELETE",

                              headers:
                                {
                                  "Content-Type":
                                    "application/json",
                                },

                              body:
                                JSON.stringify(
                                  {
                                    id:
                                      voucher.id,
                                  }
                                ),
                            }
                          );

                        if (
                          res.ok
                        ) {

                          toast.success(
                            "Voucher berhasil dihapus"
                          );

                          fetchVouchers();
                        }
                      }}
                      className="bg-red-100 hover:bg-red-200 transition text-red-600 p-3 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
className="w-full bg-white border border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none text-black placeholder:text-zinc-500"          />
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

          {filteredProducts.map(
            (product) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-blue-100 hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[160px] object-contain bg-[#F8FAFF] p-2"
                />

                <div className="p-3">

                  {/* TOP */}
                  <div className="flex items-center justify-between">

                    <span className="text-[10px] bg-blue-100 text-[#007ACC] px-2 py-1 rounded-full">
                      {
                        product.category
                      }
                    </span>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${
                        product.stock >
                        0
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      Stock{" "}
                      {
                        product.stock
                      }
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2 className="font-bold text-black mt-3 line-clamp-1">
                    {product.name}
                  </h2>

                  {/* DESC */}
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
                    {
                      product.description
                    }
                  </p>

                  {/* FLASH SALE */}
                  {product.flashSalePrice &&
                    product.flashSaleEnd &&
                    new Date(
                      product.flashSaleEnd
                    ) >
                      new Date() && (

                      <div className="mt-3">

                        <div className="inline-flex items-center gap-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">
                          🔥 FLASH SALE
                        </div>

                        <div className="flex items-center gap-2 mt-2">

                          <span className="text-zinc-400 line-through text-sm">
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

                        <p className="text-[11px] text-red-500 mt-1">
                          Sampai{" "}
                          {new Date(
                            product.flashSaleEnd
                          ).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    )}

                  {/* PRICE */}
                  <p className="font-bold text-lg text-black mt-3">
                    Rp{" "}
                    {(
                      product.flashSalePrice &&
                      product.flashSaleEnd &&
                      new Date(
                        product.flashSaleEnd
                      ) >
                        new Date()
                        ? product.flashSalePrice
                        : product.price
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  {/* ACTION */}
                  <div className="grid grid-cols-3 gap-2 mt-4">

                    <button
                      onClick={() =>
                        editProduct(
                          product
                        )
                      }
                      className="bg-yellow-100 text-yellow-600 p-2 rounded-xl flex justify-center"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product.id
                        )
                      }
                      className="bg-red-100 text-red-600 p-2 rounded-xl flex justify-center"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() =>
                        addStock(
                          product.id,
                          product.stock
                        )
                      }
                      className="bg-green-100 text-green-600 p-2 rounded-xl flex justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
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
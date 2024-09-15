import React from 'react';
import { useParams } from 'react-router-dom';
import bfBanner1 from '../../assets/images/bf_banner1.png';
import psBanner1 from '../../assets/images/PS_banner1.png';
import psBanner2 from '../../assets/images/PS_banner2.png';
import './promo.css'; 

const promoDetails = [
  {
    id: "promo1",
    title: "PROMO GAJIAN TIBA! – Beli Voucher Bloxmurah di BloxBlox Makin Hemat dengan Diskon!",
    description: `Hi Sahabat Bloxmurah,
    
    Mau beli voucher game tapi takut boncos? Tenang aja, beli Voucher Bloxmurah di BloxBlox makin hemat dengan diskon hingga Rp8.500! Buruan buka aplikasi atau website BloxBlox dan dapatkan diskonnya! Promo terbatas lho, jadi jangan sampai kelewatan dan simak syarat dan ketentuannya di bawah ini!`,
    terms: [
      "Periode promo: 28 Agustus – 3 September 2024.",
      "Promo berlaku untuk pembelian Voucher Bloxmurah di BloxBlox dengan minimum pembelian Rp20.000.",
      "Pengguna akan mendapatkan diskon 7% hingga Rp8.500 yang akan langsung didapatkan dengan memasukan kode diskon BPDBloxmurah-824 saat melakukan checkout di BloxBlox.",
      "Diskon berlaku untuk 50 Pengguna per hari yang melakukan pembelian selama periode promo berlangsung.",
      "1 (satu) akun Pengguna BloxBlox hanya dapat mendapatkan diskon 1 (satu) kali per hari (selama kuota diskon masih tersedia per harinya).",
      "Promo tidak dapat diuangkan, dikembalikan, ataupun ditransfer kepada Pengguna lain.",
      "Promo tidak dapat digunakan bersamaan dengan promo dan/atau kode promo lainnya yang berlaku di BloxBlox.",
      "Bloxmurah berhak untuk mengubah syarat dan ketentuan tanpa pemberitahuan terlebih dahulu kepada Pengguna serta berhak untuk membatalkan pesanan atau promo yang tidak memenuhi syarat dan ketentuan berlaku.",
      "Bloxmurah berhak sewaktu-waktu membatalkan promo apabila diduga terjadi tindakan kecurangan dari Pengguna yang merugikan Bloxmurah."
    ],
    image: bfBanner1,
    date: "29 AUG - 8 SEP 2024"
  },
  {
    id: "promo2",
    title: "Another Promo Title",
    description: "Description for another promo.",
    terms: [
        "Periode promo: 28 Agustus – 3 September 2024.",
        "Promo berlaku untuk pembelian Voucher Bloxmurah di Blibli dengan minimum pembelian Rp20.000.",
        "Pengguna akan mendapatkan diskon 7% hingga Rp8.500 yang akan langsung didapatkan dengan memasukan kode diskon BPDBloxmurah-824 saat melakukan checkout di Blibli.",
        "Diskon berlaku untuk 50 Pengguna per hari yang melakukan pembelian selama periode promo berlangsung.",
        "1 (satu) akun Pengguna Bloxmurah hanya dapat mendapatkan diskon 1 (satu) kali per hari (selama kuota diskon masih tersedia per harinya).",
        "Promo tidak dapat diuangkan, dikembalikan, ataupun ditransfer kepada Pengguna lain.",
        "Promo tidak dapat digunakan bersamaan dengan promo dan/atau kode promo lainnya yang berlaku di Blibli.",
        "Bloxmurah berhak untuk mengubah syarat dan ketentuan tanpa pemberitahuan terlebih dahulu kepada Pengguna serta berhak untuk membatalkan pesanan atau promo yang tidak memenuhi syarat dan ketentuan berlaku.",
        "Bloxmurah berhak sewaktu-waktu membatalkan promo apabila diduga terjadi tindakan kecurangan dari Pengguna yang merugikan Bloxmurah."
      ],
    image: psBanner1,
    date: "1 SEP - 15 SEP 2024"
  },
  {
    id: "promo3",
    title: "Yet Another Promo",
    description: "Description for yet another promo.",
    terms: [
      "Periode promo: 28 Agustus – 3 September 2024.",
      "Promo berlaku untuk pembelian Voucher Bloxmurah di BloxBlox dengan minimum pembelian Rp20.000.",
      "Pengguna akan mendapatkan diskon 7% hingga Rp8.500 yang akan langsung didapatkan dengan memasukan kode diskon BPDBloxmurah-824 saat melakukan checkout di BloxBlox.",
      "Diskon berlaku untuk 50 Pengguna per hari yang melakukan pembelian selama periode promo berlangsung.",
      "1 (satu) akun Pengguna BloxBlox hanya dapat mendapatkan diskon 1 (satu) kali per hari (selama kuota diskon masih tersedia per harinya).",
      "Promo tidak dapat diuangkan, dikembalikan, ataupun ditransfer kepada Pengguna lain.",
      "Promo tidak dapat digunakan bersamaan dengan promo dan/atau kode promo lainnya yang berlaku di BloxBlox.",
      "Bloxmurah berhak untuk mengubah syarat dan ketentuan tanpa pemberitahuan terlebih dahulu kepada Pengguna serta berhak untuk membatalkan pesanan atau promo yang tidak memenuhi syarat dan ketentuan berlaku.",
      "Bloxmurah berhak sewaktu-waktu membatalkan promo apabila diduga terjadi tindakan kecurangan dari Pengguna yang merugikan Bloxmurah."
    ],
    image: psBanner2,
    date: "15 SEP - 30 SEP 2024"
  }
];

const PromoPage = () => {
    const { id } = useParams();
    const promo = promoDetails.find(promo => promo.id === id);
  
    if (!promo) {
      return <div>Promo not found</div>;
    }
  
    return (
      <div className="promo-page">
        <div className="promo-banner" style={{ backgroundImage: `url(${promo.image})` }}>
        </div>
        <div className="promo-content">
          <h1>{promo.title}</h1>
          <p className="promo-date">{promo.date}</p>
          <p className="promo-description">{promo.description}</p>
          <h2>Syarat dan Ketentuan:</h2>
          <ul className="promo-terms">
            {promo.terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default PromoPage;

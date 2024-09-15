import { Link } from 'react-router-dom';
import bfBanner1 from '../../assets/images/bf_banner1.png';
import psBanner1 from '../../assets/images/PS_banner1.png';
import psBanner2 from '../../assets/images/PS_banner2.png';
import './promo.css'; 

const PromoList = () => {
    const promoDetails = [
      {
        id: "promo1",
        title: "PROMO GAJIAN TIBA! – Beli Voucher Bloxmurah di BloxBlox Makin Hemat dengan Diskon!",
        image: bfBanner1,
        date: "29 AUG - 8 SEP 2024"
      },
      {
        id: "promo2",
        title: "Another Promo Title",
        image: psBanner1,
        date: "1 SEP - 15 SEP 2024"
      },
      {
        id: "promo3",
        title: "Yet Another Promo",
        image: psBanner2,
        date: "15 SEP - 30 SEP 2024"
      }
    ];
  
    return (
      <div className="promo-list-container">
        <h1>Promo</h1>
        <div className="promo-grid">
          {promoDetails.map(promo => (
            <Link key={promo.id} to={`/promo/${promo.id}`} className="promo-item">
              <div className="promo-banners" style={{ backgroundImage: `url(${promo.image})` }}>
                <div className="promo-date">{promo.date}</div>
              </div>
              <h2 className="promo-title">{promo.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  export default PromoList;
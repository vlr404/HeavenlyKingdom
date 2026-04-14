import './Header.css';
import { Link, useLocation } from "react-router-dom";


export const Header = () => {
    const location = useLocation();

    const isShop = location.pathname.includes('/shop');
    // const isAdmin = location.pathname.includes('/admin');
    return (
        <header className="header">
            <div className="header__wrapper">
                <div className="header__logo">
                    <div className="logo"><img src="icons/logo.png" alt=""/></div>
                    <div className="title">ЦАРСТВИЕ НЕБЕСНОЕ</div>
                </div>
                {!isShop && (
                <nav className="header__nav">
                    <ul>
<<<<<<< Updated upstream:src/widgets/Header/Header.tsx
                        <li><a href="#Home">ГЛАВНАЯ</a></li>
                        <li><a href="#About">О НАС</a></li>
                        <li><a href="#Father">ОТЦЫ</a></li>
                        <li><a href="#Events">СОБЫТИЯ</a></li>
                        <li><a href="#Ceremony">ЦЕРЕМОНИИ</a></li>
                        <li><a href="#Contacts">КОНТАКТЫ</a></li>
                        <li><a href="#Shop">МАГАЗИН</a></li>
=======
                        <li><a href="#hero">ГЛАВНАЯ</a></li>
                        <li><a href="#about">О НАС</a></li>
                        <li><a href="#fathers">ОТЦЫ</a></li>
                        <li><a href="#events">СОБЫТИЯ</a></li>
                        <li><a href="#ceremony">ЦЕРЕМОНИИ</a></li>
                        <li><a href="#contacts">КОНТАКТЫ</a></li>
                        <li><Link to="/shop" className="shop-link">МАГАЗИН</Link></li>
>>>>>>> Stashed changes:src/components/common/Header/Header.tsx
                    </ul>
                </nav>
            )}

            {isShop && (
               <div className="shop-tools">
              <input type="text" placeholder="Поиск..." className="search-bar" />
              <div className="shop-icons">
                <button className="profile-btn">👤</button>
                <button className="cart-btn">🛒</button>
              </div>
            </div>
            )}
            </div>
        </header>
    );
};

import './Header.css';
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../../entity/cart/cartStore'
import ProfileButton from '../../Shop/ProfileButton/ProfileButton';
import SearchBar from '../../common/SearchBar/SearchBar';
import { useSearch } from '../../../context/SearchContext';

export const Header = () => {
    const location = useLocation();
    const isShop = location.pathname.includes('/shop');
    const navigate = useNavigate()
    const items = useCartStore(state => state.items);
    const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
    const { setResults } = useSearch()

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
                            <li><a href="#hero">ГЛАВНАЯ</a></li>
                            <li><a href="#about">О НАС</a></li>
                            <li><a href="#fathers">ОТЦЫ</a></li>
                            <li><a href="#events">СОБЫТИЯ</a></li>
                            <li><a href="#ceremony">ЦЕРЕМОНИИ</a></li>
                            <li><a href="#contacts">КОНТАКТЫ</a></li>
                            <li><Link to="/shop" className="shop-link">МАГАЗИН</Link></li>
                        </ul>
                    </nav>
                )}

                {isShop && (
                    <div className="shop-tools">
                        <SearchBar
                            placeholder="Поиск товаров..."
                            onResults={(res) => setResults(res)}
                        />
                        <div className="shop-icons">
                            <ProfileButton />
                            <button className="cart-btn" onClick={() => navigate('/cart')}>
                                <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.6571 0.118233C20.9679 -0.0145496 21.3276 -0.0364402 21.6572 0.0573727C21.9868 0.151186 22.2594 0.353024 22.415 0.618521L26.2609 7.19247C28.6251 7.34778 30.1086 7.74502 31.0662 8.75606C32.6388 10.4197 32.0115 12.9226 30.7569 17.93L30.0073 20.9168C29.1563 24.3113 28.7317 26.0078 27.2901 27.0039C25.8485 28 23.8181 28 19.7572 28H12.2435C8.18265 28 6.1522 28 4.71237 27.0039C3.26905 26.0078 2.84269 24.3113 1.99347 20.9168L1.24385 17.93C-0.0107616 12.9226 -0.639814 10.4197 0.934564 8.75606C1.89212 7.74353 3.37564 7.34778 5.73983 7.19247L9.58578 0.618521C9.74265 0.355132 10.015 0.155406 10.3434 0.0628691C10.6718 -0.0296679 11.0297 -0.00751515 11.3391 0.1245C11.6485 0.256515 11.8843 0.487691 11.9951 0.76765C12.1059 1.04761 12.0828 1.35366 11.9307 1.6191L8.72433 7.09988C9.56656 7.0949 10.4903 7.09241 11.4957 7.09241H20.5051C21.5104 7.09141 22.4342 7.0939 23.2764 7.09988L20.07 1.6191C19.9148 1.35333 19.8894 1.04575 19.9995 0.764001C20.1096 0.482257 20.3462 0.250924 20.6571 0.118233ZM7.70037 14.5594C7.70037 14.2623 7.83845 13.9775 8.08422 13.7674C8.32999 13.5574 8.66333 13.4394 9.0109 13.4394H22.9898C23.3374 13.4394 23.6708 13.5574 23.9165 13.7674C24.1623 13.9775 24.3004 14.2623 24.3004 14.5594C24.3004 14.8565 24.1623 15.1413 23.9165 15.3514C23.6708 15.5614 23.3374 15.6795 22.9898 15.6795H9.0109C8.66333 15.6795 8.32999 15.5614 8.08422 15.3514C7.83845 15.1413 7.70037 14.8565 7.70037 14.5594ZM12.5056 17.9196C12.1581 17.9196 11.8247 18.0376 11.579 18.2476C11.3332 18.4577 11.1951 18.7425 11.1951 19.0396C11.1951 19.3367 11.3332 19.6215 11.579 19.8316C11.8247 20.0416 12.1581 20.1597 12.5056 20.1597H19.4951C19.8427 20.1597 20.176 20.0416 20.4218 19.8316C20.6676 19.6215 20.8056 19.3367 20.8056 19.0396C20.8056 18.7425 20.6676 18.4577 20.4218 18.2476C20.176 18.0376 19.8427 17.9196 19.4951 17.9196H12.5056Z" fill="white"/>
                                </svg>
                                {totalCount > -1 && (
                                    <span className="badge">{totalCount}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

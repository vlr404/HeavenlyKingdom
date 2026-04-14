import React from 'react';
import './Footer.css';

interface SocialLinks {
    instagram: string;
    facebook: string;
    gmail: string;
    youtube: string;
    telegram: string;
}

export const Footer: React.FC = () => {
    const socialLinks: SocialLinks = {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        gmail: "mailto:info@example.com",
        youtube: "https://youtube.com",
        telegram: "https://t.me",
    };

    return (
        <footer className="footer">
            <div className="footer__socials">
                <a href={socialLinks.instagram} className="footer__social-btn" aria-label="Instagram" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                    </svg>
                </a>
                <a href={socialLinks.facebook} className="footer__social-btn" aria-label="Facebook" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                </a>
                <a href={socialLinks.gmail} className="footer__social-btn" aria-label="Email" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <polyline points="22,4 12,13 2,4" />
                    </svg>
                </a>
                <a href={socialLinks.youtube} className="footer__social-btn" aria-label="YouTube" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#1a1a1a" />
                    </svg>
                </a>
                <a href={socialLinks.telegram} className="footer__social-btn" aria-label="Telegram" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.8 2.2L1.4 10.1c-1.3.5-1.3 1.3-.2 1.6l5.1 1.6 1.9 5.8c.3.7.2 1 1 1 .6 0 .9-.3 1.2-.6l2.9-2.8 5.9 4.4c1.1.6 1.9.3 2.2-.9l3-14.5c.4-1.7-.6-2.4-1.6-2z" />
                    </svg>
                </a>
            </div>
            <p className="footer__copyright">
                © {new Date().getFullYear()} Царствие Небесное. Все права защищены.
            </p>
        </footer>
    );
};

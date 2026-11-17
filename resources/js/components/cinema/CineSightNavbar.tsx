import { useState } from 'react';
import './CineSightNavbar.css';

type Props = {
    active: 'home' | 'experience';
};

export default function CineSightNavbar({ active }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { label: 'Home', href: '/cinema', key: 'home' },
        { label: 'Experience', href: '/cinema/experience', key: 'experience' },
    ] as const;

    return (
        <nav className="cxn-navbar" aria-label="CineSight navigation">
            <div className="cxn-inner">
                <a className="cxn-brand" href="/cinema">
                    <span className="cxn-mark" aria-hidden="true">?</span>
                    <span>CineSight <strong>X</strong></span>
                </a>

                <div className="cxn-desktop-links">
                    {links.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            className={
                                active === link.key
                                    ? 'cxn-link cxn-active'
                                    : 'cxn-link'
                            }
                            aria-current={
                                active === link.key ? 'page' : undefined
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <button
                    type="button"
                    className="cxn-menu-toggle"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                    aria-controls="cxn-mobile-menu"
                    onClick={() => setIsOpen((previous) => !previous)}
                >
                    <span aria-hidden="true">{isOpen ? '?' : '?'}</span>
                </button>
            </div>

            <div
                id="cxn-mobile-menu"
                className={
                    isOpen
                        ? 'cxn-mobile-links cxn-open'
                        : 'cxn-mobile-links'
                }
            >
                {links.map((link) => (
                    <a
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={
                            active === link.key
                                ? 'cxn-mobile-link cxn-active'
                                : 'cxn-mobile-link'
                        }
                        aria-current={
                            active === link.key ? 'page' : undefined
                        }
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}

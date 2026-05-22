import './header.css';
import { Link } from 'react-router';
export function Header() {
    return (
        <>
            <div className="header">
                <div className="left-section">
                    <Link className="header-brand" to="/">
                        <img
                            className="header-brand-logo"
                            src="/restaurant-iq-logo.png"
                            alt="Restaurant IQ"
                        />
                        <span className="header-brand-text">
                            <span className="header-brand-title">
                                Restaurant<span className="header-brand-iq">IQ</span>
                            </span>
                        </span>
                    </Link>
                </div>


                <div className="middle-section">

                </div>

                <div className="right-section">
                    <Link className="about-us-link" to="/about-us">

                        <span className="about-us-text">About Us</span>
                    </Link>

                    <Link className="how-works-link" to="/how-works">

                        <span className="how-works-text">How It Works</span>
                    </Link>

                </div>

            </div>
        </>
    )
}
import { Link } from "react-router";
import { Header } from "../components/Header";
import "./AboutUs.css";
import "./HowItWorks.css";

export function HowItWorks() {
    return (
        <div className="about-page">
            <Header />
            <main className="about-main how-works-wide">
                <header className="about-hero">
                    <p className="about-eyebrow">The flow</p>
                    <h1 className="about-title">
                        How it <span className="title-accent">works</span>
                    </h1>
                    <p className="about-lead">
                        You enter where you are; we find nearby restaurants with websites, try to read
                        menu-related text, and run an automated allergy-risk summary. Each search is
                        kept separate so you only see results for the address you just looked up.
                    </p>
                </header>

                <ol className="how-steps">
                    <li className="how-step">
                        <span className="how-step-marker" aria-hidden="true">
                            1
                        </span>
                        <div className="how-step-body">
                            <h2>Enter your address</h2>
                            <p>
                                On the home page, type an address and choose <strong>Find Restaurants</strong>.
                                The app sends that text to the backend, which geocodes it and searches
                                for restaurants near that location (Google Places).
                            </p>
                        </div>
                    </li>
                    <li className="how-step">
                        <span className="how-step-marker" aria-hidden="true">
                            2
                        </span>
                        <div className="how-step-body">
                            <h2>We shortlist places with a website</h2>
                            <p>
                                For each candidate, we fetch place details. Only venues that expose a
                                public <strong>website</strong> are kept (the scraper needs a URL). Up to
                                six restaurants are saved for <strong>this search only</strong>—each run
                                gets its own batch so you are not mixed with older lookups.
                            </p>
                        </div>
                    </li>
                    <li className="how-step">
                        <span className="how-step-marker" aria-hidden="true">
                            3
                        </span>
                        <div className="how-step-body">
                            <h2>Menu text (when possible)</h2>
                            <p>
                                The server opens each site, looks for links that look like a menu, and
                                extracts readable text. If that does not yield enough text, it falls back
                                to scanning the homepage. If scraping still fails, that restaurant is
                                analyzed with <strong>no menu</strong>—only the name and location context.
                            </p>
                        </div>
                    </li>
                    <li className="how-step">
                        <span className="how-step-marker" aria-hidden="true">
                            4
                        </span>
                        <div className="how-step-body">
                            <h2>Allergy summary (AI)</h2>
                            <p>
                                A language model reads the menu text (or the restaurant name when there
                                is no menu) and returns a <strong>risk score</strong> (1–100, higher means
                                more caution for diners with allergies) and a short list of{" "}
                                <strong>top allergens or risk factors</strong> to consider. Outputs are
                                conservative when data is missing or unclear.
                            </p>
                        </div>
                    </li>
                    <li className="how-step">
                        <span className="how-step-marker" aria-hidden="true">
                            5
                        </span>
                        <div className="how-step-body">
                            <h2>Your results</h2>
                            <p>
                                Cards show the image, name, score, and tags. While results load, you will
                                see a loading state. Click a card to open that restaurant&apos;s website in
                                a new tab—useful for checking the real menu or calling ahead.
                            </p>
                        </div>
                    </li>
                </ol>

                <section className="about-section how-disclaimer">
                    <h2>Please read</h2>
                    <p>
                        This tool is for <strong>informational purposes only</strong>. It is not medical
                        advice, does not know a kitchen&apos;s cross-contact practices, and can make
                        mistakes. Always confirm ingredients, preparation, and allergens directly with
                        the restaurant before you eat.
                    </p>
                </section>

                <p className="about-back-wrap">
                    <Link className="about-back-link" to="/">
                        ← Back to home
                    </Link>
                </p>
            </main>
        </div>
    );
}

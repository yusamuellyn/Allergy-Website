import { Link } from "react-router";
import { Header } from "../components/Header";
import "./AboutUs.css";

export function AboutUs() {
    return (
        <div className="about-page">
            <Header />
            <main className="about-main">
                <header className="about-hero">
                    <p className="about-eyebrow">About the project</p>
                    <h1 className="about-title">
                        About <span className="title-accent">us</span>
                    </h1>
                    <p className="about-lead">
                        [TEMP] Short one-sentence tagline — replace with what you want visitors to
                        remember first.
                    </p>
                </header>

                <section className="about-section">
                    <h2>Our story</h2>
                    <p>
                        [TEMP] Paragraph 1: Who you are, why you built this, and what problem you
                        care about (food allergies, dining out, transparency, etc.).
                    </p>
                    <p>
                        [TEMP] Paragraph 2: Optional — how the idea started, a personal note, or
                        what you hope changes for people who use the site.
                    </p>
                </section>

                <div className="about-cards">
                    <article className="about-card">
                        <h3>Mission</h3>
                        <p>
                            [TEMP] One or two sentences on your mission — e.g. making it easier to
                            choose where to eat with clearer allergy-related signals.
                        </p>
                    </article>
                    <article className="about-card">
                        <h3>What this tool does</h3>
                        <p>
                            [TEMP] Plain-language summary: address search, nearby restaurants,
                            menu scraping, and AI-assisted risk context — adjust to match your
                            actual features.
                        </p>
                    </article>
                    <article className="about-card">
                        <h3>Important note</h3>
                        <p>
                            [TEMP] Disclaimer: this is informational, not medical or legal advice;
                            always confirm with the restaurant. Edit to your comfort level.
                        </p>
                    </article>
                </div>

                <section className="about-section about-section-narrow">
                    <h2>Contact / feedback</h2>
                    <p>
                        [TEMP] How people can reach you — email, form, GitHub, or “coming soon.”
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

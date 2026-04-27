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
                        A small project built to make allergy-aware dining decisions feel less stressful.
                    </p>
                </header>

                <section className="about-section">
                    <h2>Our story</h2>
                    <p>
                        Eating out with food allergies can mean a lot of uncertainty. Menus aren&apos;t
                        always clear, ingredients can be hidden in sauces, and cross-contact risk is
                        hard to judge from a quick glance.
                    </p>
                    <p>
                        This tool is meant to help you start the conversation: it finds nearby restaurants,
                        pulls what it can from public information, and summarizes likely allergy risks so
                        you can decide where to look deeper or who to call.
                    </p>
                </section>

                <div className="about-cards">
                    <article className="about-card">
                        <h3>Mission</h3>
                        <p>
                            Give people a faster way to shortlist restaurants and spot common allergy
                            risks before they arrive.
                        </p>
                    </article>
                    <article className="about-card">
                        <h3>What this tool does</h3>
                        <p>
                            You enter an address, we find nearby restaurants with websites, extract menu-like
                            text when possible, and generate an allergy risk score plus top allergen/risk tags.
                        </p>
                    </article>
                    <article className="about-card">
                        <h3>Important note</h3>
                        <p>
                            This is informational only. Always confirm ingredients and preparation with the
                            restaurant—especially for severe allergies.
                        </p>
                    </article>
                </div>

                <section className="about-section about-section-narrow">
                    <h2>Contact / feedback</h2>
                    <p>
                        If you find a menu that wasn&apos;t captured well or have ideas to improve results,
                        send feedback and we&apos;ll keep iterating.
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

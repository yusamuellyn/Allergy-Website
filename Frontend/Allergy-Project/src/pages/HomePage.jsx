import { useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import "./HomePage.css";

function toWebsiteHref(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

export function HomePage() {

    const [inputText, setInputText] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function saveInputText(event) {
        setInputText(event.target.value);
    }

    const sendAddress = async () => {
        const address = inputText.trim();
        if (!address || isLoading) return;

        setIsLoading(true);
        try {
            setData([]);
            const response = await axios.post(
                "http://localhost:5001/api/postPlaces",
                { address }
            );

            const searchId = response.data?.searchId;
            if (!searchId) {
                console.error("No searchId from server");
                return;
            }

            await axios.get("http://localhost:5001/api/analyzePlaces", {
                params: { searchId }
            });

            const allData = await axios.get("http://localhost:5001/api/getAllData", {
                params: { searchId }
            });
            setData(allData.data);

            setInputText("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <div className="home-page">
                {isLoading ? (
                    <div className="loading-overlay" role="status" aria-live="polite" aria-busy="true">
                        <div className="loading-card">
                            <div className="loading-spinner" aria-hidden />
                            <p className="loading-title">Working on it</p>
                            <p className="loading-sub">Finding restaurants and analyzing allergy risk…</p>
                        </div>
                    </div>
                ) : null}
                <Header />
                <section className="home-hero" aria-labelledby="home-heading">
                    <p className="home-hero-eyebrow">Allergy-aware dining</p>
                    <h1 id="home-heading" className="home-hero-title">
                        Find safer meals
                        <span className="home-hero-title-accent"> near you</span>
                    </h1>
                    <p className="home-hero-sub">
                        Search by address for nearby restaurants, quick allergy-risk context, and
                        links to their sites.
                    </p>
                </section>
                <div className="user-input-container">
                    <input
                        placeholder="Enter your address" size="30"
                        onChange={saveInputText}
                        value={inputText}
                        className="address-input"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    />
                    <button
                        type="button"
                        onClick={sendAddress}
                        className="send-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading…" : "Find Restaurants"}
                    </button>
                </div>

                <div className="results-container">
                    {data.map((item) => {
                        const websiteHref = toWebsiteHref(item.website);
                        const body = (
                            <>
                                <div className="restuarant-image"><img src={item.image} alt="" /></div>
                                <div className="restuarant-name">{item.name}</div>
                                <div className="allergy-analysis">
                                    {item.allergyAnalysis?.risk_score != null ? (
                                        <>
                                            <span className="risk-label">Allergy risk</span>
                                            <span className="risk-value">{item.allergyAnalysis.risk_score}</span>
                                            <span className="risk-scale">/ 100</span>
                                        </>
                                    ) : null}
                                </div>
                                <div className="top-allergies">
                                    {(item.allergyAnalysis?.top_allergies ?? []).map((a, i) => (
                                        <span key={`${a}-${i}`}>{a}</span>
                                    ))}
                                </div>
                                {websiteHref ? (
                                    <div className="result-item-hint">Open website</div>
                                ) : null}
                            </>
                        );
                        return websiteHref ? (
                            <a
                                key={item._id}
                                className="result-item result-item-link"
                                href={websiteHref}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {body}
                            </a>
                        ) : (
                            <div key={item._id} className="result-item">
                                {body}
                            </div>
                        );
                    })}
                </div>

            </div>
        </>
    );
}
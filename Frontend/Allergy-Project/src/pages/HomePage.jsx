import { useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import "./HomePage.css";
export function HomePage() {

    const [inputText, setInputText] = useState('');
    const [data, setData] = useState([]);

    function saveInputText(event) {
        setInputText(event.target.value);
    }

    const sendAddress = async () => {
        try {
            // send inputText to backend
            const response = await axios.post(
                "http://localhost:5001/api/postPlaces",
                { address: inputText }
            );

            const analyzeData = await axios.get("http://localhost:5001/api/analyzePlaces");
            console.log(analyzeData);

            console.log(response.data);

            const allData = await axios.get("http://localhost:5001/api/getAllData");
            setData(allData.data);


            setInputText("");
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <div>
                <Header />
                <div className="user-input-container">
                    <input
                        placeholder="Enter your address" size="30"
                        onChange={saveInputText}
                        value={inputText} className="address-input"
                    />
                    <button
                        onClick={sendAddress}
                        className="send-button"
                    >Find Restaurants</button>
                </div>

                <div className="results-container">
                    {data.map((item) => (
                        <div key={item._id} className="result-item">
                            <div className="restuarant-image"><img src={item.image} alt={item.name} /></div>
                            <div className="restuarant-name">{item.name}</div>
                            <div className="allergy-analysis">{item.allergyAnalysis?.risk_score}</div>
                            <div className="top-allergies">{item.allergyAnalysis?.top_allergies?.join(' ')}</div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}
import axios from "axios";
export const getAllRestaurants = async (query, placesKey) => {
    let allResults = [];
    let hasNextPage = true;

    let params = {
        query: query,
        type: "restaurant",
        key: placesKey
    };

    while (hasNextPage) {
        const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            { params }
        );

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            console.error("Google API error:", data.status, data.error_message);
            break;
        }

        allResults = allResults.concat(data.results || []);

        if (data.next_page_token) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            params.pagetoken = data.next_page_token;
        } else {
            hasNextPage = false;
        }
    }

    return allResults;
};


// Fetch crypto data from CoinGecko API
async function fetchCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    const data = await response.json();
    return data;
}

// Fetch stock data from Alpha Vantage API
async function fetchStockData(symbol) {
    const apiKey = 'EK44GMP5M8N2EBB1'; // Replace with your Alpha Vantage API key
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
    const data = await response.json();
    return data;
}

// Calculate top risers and losers for crypto
function calculateRisersAndLosers(data) {
    const sortedData = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    const risers = sortedData.slice(0, 10); // Top 10 risers
    const losers = sortedData.slice(-10).reverse(); // Top 10 losers
    return { risers, losers };
}

// Populate dropdown with data
function populateDropdown(dropdownId, items) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear loading message
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id || item['Meta Data']['2. Symbol']; // Use symbol for stocks
        option.text = item.name ? `${item.name} (${item.symbol.toUpperCase()}) - ${item.price_change_percentage_24h.toFixed(2)}%` : item['Meta Data']['2. Symbol'];
        dropdown.add(option);
    });
}

// Display asset details
function displayAssetDetails(asset) {
    const detailsDiv = document.getElementById('details');
    if (asset.current_price) {
        // Display crypto data
        detailsDiv.innerHTML = `
            <h2>${asset.name} (${asset.symbol.toUpperCase()})</h2>
            <p>Price: $${asset.current_price}</p>
            <p>24h Change: ${asset.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: $${asset.market_cap.toLocaleString()}</p>
        `;
    } else {
        // Display stock data
        const latestDate = Object.keys(asset['Time Series (Daily)'])[0];
        const latestData = asset['Time Series (Daily)'][latestDate];
        detailsDiv.innerHTML = `
            <h2>${asset['Meta Data']['2. Symbol']}</h2>
            <p>Date: ${latestDate}</p>
            <p>Open: $${latestData['1. open']}</p>
            <p>High: $${latestData['2. high']}</p>
            <p>Low: $${latestData['3. low']}</p>
            <p>Close: $${latestData['4. close']}</p>
        `;
    }
}

// Initialize the app
async function init() {
    // Fetch crypto data
    const cryptoData = await fetchCryptoData();
    const { risers, losers } = calculateRisersAndLosers(cryptoData);
    populateDropdown('risers-dropdown', risers);
    populateDropdown('losers-dropdown', losers);

    // Fetch stock data
    const stockSymbols = ['AAPL', 'MSFT', 'TSLA']; // Add more symbols as needed
    const stockData = await Promise.all(stockSymbols.map(symbol => fetchStockData(symbol)));
    populateDropdown('stocks-dropdown', stockData);

    // Add event listeners
    document.getElementById('risers-dropdown').addEventListener('change', (e) => {
        const selectedAsset = risers.find(asset => asset.id === e.target.value);
        if (selectedAsset) displayAssetDetails(selectedAsset);
    });

    document.getElementById('losers-dropdown').addEventListener('change', (e) => {
        const selectedAsset = losers.find(asset => asset.id === e.target.value);
        if (selectedAsset) displayAssetDetails(selectedAsset);
    });

    document.getElementById('stocks-dropdown').addEventListener('change', (e) => {
        const selectedAsset = stockData.find(data => data['Meta Data']['2. Symbol'] === e.target.value);
        if (selectedAsset) displayAssetDetails(selectedAsset);
    });
}

// Run the app
init();
// Initialize Chart.js context for each chart
const cryptoChartCtx = document.getElementById('crypto-chart').getContext('2d');
const memecoinChartCtx = document.getElementById('memecoin-chart').getContext('2d');
const stockChartCtx = document.getElementById('stock-chart').getContext('2d');

// Chart variables
let cryptoChart, memecoinChart, stockChart;

// Function to create a chart
function createChart(ctx, data, label) {
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            aspectRatio: 2,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: label
                }
            }
        }
    });
}

// Resize canvas function
function resizeCanvas() {
    const charts = ['crypto-chart', 'memecoin-chart', 'stock-chart'];
    charts.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        const containerWidth = canvas.parentElement.offsetWidth; // Get the parent container's width
        const newHeight = containerWidth * 0.5; // Set the height to 50% of the container's width
        canvas.style.height = newHeight + 'px'; // Apply the new height dynamically
        canvas.width = containerWidth; // Set width to parent container's width
    });
}

// Call the resize function on window resize or when the chart is initialized
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize when the page loads

// Function to load cryptocurrency data
async function loadCryptoData(coinId) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`;
    const response = await fetch(url);
    const data = await response.json();

    const prices = data.prices.map(item => item[1]);
    const times = data.prices.map(item => new Date(item[0]).toLocaleTimeString());

    const chartData = {
        labels: times,
        datasets: [{
            label: 'Price ($)',
            data: prices,
            borderColor: prices[prices.length - 1] > prices[0] ? 'green' : 'red',
            borderWidth: 2
        }]
    };

    if (cryptoChart) {
        cryptoChart.destroy();
    }

    cryptoChart = createChart(cryptoChartCtx, chartData, `Price of ${coinId} (Last 24 Hours)`);
}

// Function to load memecoin data
async function loadMemecoinData(coinId) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`;
    const response = await fetch(url);
    const data = await response.json();

    const prices = data.prices.map(item => item[1]);
    const times = data.prices.map(item => new Date(item[0]).toLocaleTimeString());

    const chartData = {
        labels: times,
        datasets: [{
            label: 'Price ($)',
            data: prices,
            borderColor: prices[prices.length - 1] > prices[0] ? 'green' : 'red',
            borderWidth: 2
        }]
    };

    if (memecoinChart) {
        memecoinChart.destroy();
    }

    memecoinChart = createChart(memecoinChartCtx, chartData, `Price of ${coinId} (Last 24 Hours)`);
}

// Function to load stock data
async function loadStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=EK44GMP5M8N2EBB1`; // Use your API key here
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (5min)']) {
        const times = Object.keys(data['Time Series (5min)']);
        const prices = times.map(time => parseFloat(data['Time Series (5min)'][time]['4. close']));

        // Determine the color of the line based on the price trend
        const trendColor = prices[prices.length - 1] > prices[0] ? 'green' : 'red'; // Green if price is rising, red if falling

        const chartData = {
            labels: times,
            datasets: [{
                label: `Price of ${symbol} (Last 24 Hours)`,
                data: prices,
                borderColor: trendColor, // Set the color dynamically based on the trend
                borderWidth: 2,
                fill: false // No fill under the line
            }]
        };

        if (stockChart) {
            stockChart.destroy();
        }

        stockChart = createChart(stockChartCtx, chartData, `Price of ${symbol} (Last 24 Hours)`);
    } else {
        console.error('Failed to load stock data:', data);
    }
}

// Tab Switching Function
function openTab(tabName) {
    // Step 1: Hide all tab content
    const tabContents = document.querySelectorAll('.tabcontent');
    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none'; // Hide all tabs
    });

    // Step 2: Remove the "active" class from all tab buttons
    const tabLinks = document.querySelectorAll('.tablink');
    tabLinks.forEach(tabLink => {
        tabLink.classList.remove('active'); // Remove active class from all tabs
    });

    // Step 3: Show the selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block'; // Show the selected tab
    }

    // Step 4: Add the "active" class to the clicked tab button
    const clickedTab = Array.from(tabLinks).find(tabLink => tabLink.textContent.toLowerCase() === tabName.toLowerCase());
    if (clickedTab) {
        clickedTab.classList.add('active'); // Highlight the clicked tab
    }

    // Step 5: Load the respective category data
    if (tabName === 'Crypto') {
        loadCryptoCategory(); // Load crypto buttons and data
    } else if (tabName === 'Memecoin') {
        loadMemecoinCategory(); // Load memecoin buttons and data
    } else if (tabName === 'Stock') {
        loadStockCategory(); // Load stock buttons and data
    }
}

// Function to open the default tab (Home)
document.addEventListener('DOMContentLoaded', () => {
    openTab('Home'); // Open the Home tab by default
});

// Function to load the Crypto category
function loadCryptoCategory() {
    // Clear any existing chart
    if (cryptoChart) {
        cryptoChart.destroy();
    }

    // Highlight the first crypto button by default
    const firstCryptoButton = document.querySelector('#crypto-buttons .coin-btn');
    if (firstCryptoButton) {
        firstCryptoButton.click(); // Simulate a click on the first button
    }
}

// Function to load the Memecoin category
function loadMemecoinCategory() {
    // Clear any existing chart
    if (memecoinChart) {
        memecoinChart.destroy();
    }

    // Highlight the first memecoin button by default
    const firstMemecoinButton = document.querySelector('#memecoin-buttons .coin-btn');
    if (firstMemecoinButton) {
        firstMemecoinButton.click(); // Simulate a click on the first button
    }
}

// Function to load the Stock category
function loadStockCategory() {
    // Clear any existing chart
    if (stockChart) {
        stockChart.destroy();
    }

    // Highlight the first stock button by default
    const firstStockButton = document.querySelector('#stock-buttons .stock-btn');
    if (firstStockButton) {
        firstStockButton.click(); // Simulate a click on the first button
    }
}

// Populate crypto buttons
const cryptoButtonsContainer = document.getElementById('crypto-buttons');
const cryptoCoins = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin', 'cardano'];

cryptoCoins.forEach(coinId => {
    const button = document.createElement('button');
    button.className = 'coin-btn';
    button.innerText = coinId.charAt(0).toUpperCase() + coinId.slice(1);
    button.onclick = () => {
        // Unhighlight all buttons
        document.querySelectorAll('.coin-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active'); // Highlight the clicked button
        loadCryptoData(coinId); // Load data for the selected coin
    };
    cryptoButtonsContainer.appendChild(button);
});

// Populate memecoin buttons
const memecoinButtonsContainer = document.getElementById('memecoin-buttons');
const memecoins = [
    'shiba-inu',  // Existing coin
    'trumpcoin',
    //'safemoon',    // Existing coin
  //  'trumpcoin'  // New coin
  //  'dogecoin',    // New coin
    //'litecoin',    // New coin
    //'floki-inu',   // New coin
    //'akita-inu'   // New coin
];

memecoins.forEach(coinId => {
    const button = document.createElement('button');
    button.className = 'coin-btn';
    button.innerText = coinId.charAt(0).toUpperCase() + coinId.slice(1);
    button.onclick = () => {
        // Unhighlight all buttons
        document.querySelectorAll('.coin-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active'); // Highlight the clicked button
        loadMemecoinData(coinId); // Load data for the selected coin
    };
    memecoinButtonsContainer.appendChild(button);
});

// Populate stock buttons
const stockButtonsContainer = document.getElementById('stock-buttons');
const stockSymbols = ['AAPL', 'TSLA', 'GOOGL'];

stockSymbols.forEach(symbol => {
    const button = document.createElement('button');
    button.className = 'stock-btn';
    button.innerText = symbol;
    button.onclick = () => {
        // Unhighlight all buttons
        document.querySelectorAll('.stock-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active'); // Highlight the clicked button
        loadStockData(symbol); // Load data for the selected stock
    };
    stockButtonsContainer.appendChild(button);
});

// Start live ticker
async function updateTicker() {
    const symbols = ['AAPL', 'TSLA', 'GOOGL', 'BTC', 'ETH', 'DOGE']; // Add more symbols as needed
    const tickerContainer = document.getElementById('live-ticker');
    tickerContainer.innerHTML = ''; // Clear previous content

    for (const symbol of symbols) {
        const data = await fetchLiveStockData(symbol);

        if (data) {
            const tickerItem = document.createElement('span');
            tickerItem.style.color = data.color; // Apply green or red color
            tickerItem.innerHTML = `${data.symbol}: $${data.price} (${data.change > 0 ? '+' : ''}${data.change}) <span style="margin-right: 30px;">|</span>`;
            tickerContainer.appendChild(tickerItem);
        }
    }

    // Refresh ticker every 5 seconds for updates
    setTimeout(updateTicker, 5000);
}

// Start the live ticker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateTicker(); // Start the live ticker to update periodically
});


// Fetch live stock data
// Function to fetch stock/crypto data and calculate daily change
// Function to fetch stock data
async function fetchLiveStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=EK44GMP5M8N2EBB1`; // Ensure the API key is correct
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if the response contains valid data
        if (data['Time Series (5min)']) {
            const times = Object.keys(data['Time Series (5min)']);
            const latestPrice = parseFloat(data['Time Series (5min)'][times[0]]['4. close']);
            const previousPrice = parseFloat(data['Time Series (5min)'][times[1]]['4. close']);
            
            const priceChange = latestPrice - previousPrice;
            const priceColor = priceChange > 0 ? 'green' : 'red'; // Green if price is rising, red if falling

            return {
                symbol: symbol,
                price: latestPrice.toFixed(2),
                change: priceChange.toFixed(2),
                color: priceColor
            };
        } else {
            // Handle invalid data response
            console.error('Failed to fetch valid stock data. Response:', data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
    }
}

// Update the ticker every 5 seconds
async function updateTicker() {
    const symbols = ['AAPL', 'TSLA', 'GOOGL', 'BTC', 'ETH', 'DOGE']; // Add more symbols as needed
    const tickerContainer = document.getElementById('live-ticker');
    tickerContainer.innerHTML = ''; // Clear previous content

    for (const symbol of symbols) {
        const data = await fetchLiveStockData(symbol);

        if (data) {
            const tickerItem = document.createElement('span');
            tickerItem.style.color = data.color; // Apply green or red color
            tickerItem.innerHTML = `${data.symbol}: $${data.price} (${data.change > 0 ? '+' : ''}${data.change}) <span style="margin-right: 30px;">|</span>`;
            tickerContainer.appendChild(tickerItem);
        } else {
            // If data fetch failed, handle gracefully by showing an error message
            const tickerItem = document.createElement('span');
            tickerItem.style.color = 'gray';
            tickerItem.innerHTML = `${symbol}: Data Unavailable <span style="margin-right: 30px;">|</span>`;
            tickerContainer.appendChild(tickerItem);
        }
    }

    // Refresh ticker every 5 seconds for updates
    setTimeout(updateTicker, 5000);
}

// Start the live ticker
updateTicker();

// Function to show the notification
function showNotification(message) {
    const notificationPanel = document.getElementById('notification-panel');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = message;
    notificationPanel.style.display = 'block';

    // Set a timer to hide the notification after 5 seconds
    setTimeout(function() {
        notificationPanel.style.display = 'none';
    }, 5000);
}

// Function to dismiss the notification manually
function dismissNotification() {
    const notificationPanel = document.getElementById('notification-panel');
    notificationPanel.style.display = 'none';
}

// Request permission for browser notifications
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Function to show native notifications
function showBrowserNotification() {
    if (Notification.permission === 'granted') {
        new Notification("TLF Industries Update", {
            body: "Refresh for new update!",
            icon: "/path-to-your-icon.png"
        });
    }
}

// Example of triggering the notification after successful Git commit and push
function triggerNotification() {
    showBrowserNotification(); // Call the notification function
}

# Equity Screener

A mini web platform that allows users to search equities, view them in a rich table, drill into detail pages, and explore an interactive dashboard, all powered by the Alpha Vantage API.

## 🚀 Live Demo

## ✨ Features Implemented

### Core Features (Completed)

1. **Live Search Input (✅ Completed)**

   - Real-time search suggestions as users type
   - Debounced API calls to Alpha Vantage SYMBOL_SEARCH endpoint
   - Filtering by type, country, and other relevant parameters
   - Accessible keyboard navigation and error handling

2. **Results Table (✅ Completed)**

   - Responsive and well-structured table showing search results
   - Columns include: Symbol, Company Name, Bloomberg Ticker, Asset Class, Region, Country, Currency, Match Score
   - Pagination to handle large result sets
   - Clean, responsive layout that works on all devices

3. **Interactive Dashboard (✅ Completed)**

   - Multi-select functionality allowing users to choose 3-5 symbols
   - Interactive multi-line price chart comparing selected stocks
   - Comparative analysis of key metrics with visual indicators showing similarities/differences
   - Optimized with memoization for performance
   - Interactive chart features including tooltips, zooming, and legend toggling

4. **Detail Page (✅ Completed)**

   - Fully clickable rows in the results table linking to detail pages
   - Dynamic routing via `/stock/[symbol]` paths
   - Comprehensive stock detail page featuring:
     - Price history chart with adjustable timeframes
     - Company overview information from the OVERVIEW endpoint
     - Recent news section with data from Alpha Vantage News API
     - Clean loading states and error handling

5. **Lazy Loading for News (✅ Completed)**
   - Implemented lazy loading for the news section on detail pages
   - Initial load shows first 5 news items
   - Additional news items load as the user scrolls
   - Efficient API usage by only requesting data when needed
   - Smooth user experience with loading indicators

### TODO (Not Yet Implemented)

1. **Row Hover Modal (⏳ Planned)**

   - Show tooltips with last price, day change %, and 52-week high/low on row hover
   - Lazy fetch data on first hover and cache for subsequent hovers

2. **Global News Integration (⏳ Planned)**

   - Display finance headlines related to selected symbols or top market news
   - Implement as a side panel, modal, or ticker

3. **Dark Mode Toggle (⏳ Planned)**

   - Implement dark/light theme switching
   - Store preference in localStorage
   - Custom implementation of theme switching logic

4. **Favorites System (⏳ Planned)**

   - Save favorite symbols to localStorage
   - Pre-load favorites on revisit
   - Create a dedicated "Watch List" tab

5. **Vercel Edge Deployment (⏳ Planned)**
   - Deploy to Vercel Edge
   - Set up a custom domain

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js (App Router)
- **Styling**: TailwindCSS
- **State Management**: React Hooks + Context API
- **Charting Library**: Recharts
- **API Integration**: Alpha Vantage API

## 🏗️ Architecture

### Folder Structure

```
src/
├── app/                      # Next.js App Router structure
├── api/                      # API routes
│   └── mock/                # Mock API endpoints for development
│   ├── stock-history/   # stock history pricing data
│   ├── stock-overview/  # stock overview and news data
│   ├── stock-prices/    # stock price data
│   ├── symbol-search/   # symbol search data
│   └── test/            # Test endpoint
├── components/              # UI components
│   ├── Dashboard.tsx        # Dashboard component
│   ├── FilterPanel.tsx      # Search filter panel
│   ├── StockPrice.tsx       # Stock price component
│   ├── StockTable.tsx       # Results table component
│   └── SymbolSearch.tsx     # Search input component
├── constants/               # Application constants
│   └── mockdata.ts          # Mock data constants
├── hooks/                   # Custom React hooks
│   └── useDebounce.ts       # Debounce hook for search
├── lib/                     # Library code
│   └── throttle.ts          # API request throttling
├── stock/                   # Stock detail page components
│   └── [symbol]/            # Dynamic route
│       └── page.tsx         # Stock detail page
├── types/                   # TypeScript type definitions
│   └── types.ts             # Shared type definitions
├── utils/                   # Utility functions
│   └── apiUtils.ts          # API utilities
```

### Data Flow

1. **Search Flow**:

   - User input → Debounced query → API call → Results rendering
   - Implemented with proper error handling and loading states

2. **Detail Page Flow**:

   - Table row click → Dynamic route → Data fetching → Rendering
   - Parallel data fetching for different sections (overview, chart, news)

3. **Dashboard Flow**:
   - Symbol selection → API calls → Data processing → Visualization
   - Optimized with memoization for performance

### API Integration

- **Request Optimization**:

  - Debounced search requests to prevent API overload
  - Cached responses where appropriate
  - Respects Alpha Vantage's free tier limit (5 req/min)

- **Mock API System**:
  - Implemented mock endpoints for development
  - Mirrors the structure of real Alpha Vantage API
  - Allows for offline development and testing

### Performance Considerations

- Lazy loading for news content
- Memoization of expensive calculations
- Optimized re-renders using React's useMemo and useCallback
- Efficient data fetching patterns

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd equity-screener
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Design Decisions

- **App Router**: Chose Next.js App Router for improved performance and simplified routing
- **TailwindCSS**: Used for rapid UI development and consistent styling
- **Component Modularity**: Focused on creating reusable components that can be composed together
- **Lazy Loading**: Implemented lazy loading for content-heavy sections to improve initial load time
- **API Abstraction**: Created utility functions to abstract API calls and provide consistent error handling
- **Mock API System**: Developed a comprehensive mock API system to avoid hitting API limits during development

## 🔧 Areas for Improvement

- Implement remaining features (row hover modal, dark mode, favorites system)
- Add more comprehensive error handling
- Improve accessibility features
- Add unit and integration tests
- Implement more advanced caching strategies

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Alpha Vantage API Documentation](https://www.alphavantage.co/documentation/)
- [Recharts Documentation](https://recharts.org/en-US/)

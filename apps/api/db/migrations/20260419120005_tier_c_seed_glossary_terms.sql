-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- TASK_03_UPDATE Tier C — glossary_terms seed (50 MVP entries, en locale)
--
-- Source-of-truth for the Explainer module (design brief §14.3). Updates
-- to copy go via a new `..._update_glossary_*.sql` migration (UPDATE rows)
-- so content drift is tracked in git history.
--
-- Scope choice matches design brief §14.3 Phase 1 (~50 predefined terms);
-- Phase 2 (AI-generated on-the-fly) is post-MVP and does NOT live in this
-- table.
-- =====================================================================

INSERT INTO glossary_terms (slug, locale, title, short_def, long_def, related_slugs) VALUES
('pe-ratio', 'en', 'P/E ratio',
 'Share price divided by earnings per share — a rough gauge of how expensive a stock is relative to profits.',
 'A P/E of 20 means investors are paying $20 for each $1 of annual earnings. High P/E often reflects growth expectations; low P/E can signal value or distress. Use alongside growth rate and sector norms, not in isolation.',
 ARRAY['pb-ratio','eps']),

('pb-ratio', 'en', 'P/B ratio',
 'Share price divided by book value per share. Under 1.0 means the market values the company below its accounting equity.',
 'Mostly useful for asset-heavy businesses (banks, insurers, industrials). Tech and service firms often carry little book value and trade at high P/B regardless of quality.',
 ARRAY['pe-ratio']),

('eps', 'en', 'EPS (earnings per share)',
 'A company''s net profit divided by its outstanding shares — how much the business earned for each share.',
 'Diluted EPS accounts for options and convertible securities. Trailing EPS is the last 12 months; forward EPS is analyst estimate.',
 ARRAY['pe-ratio']),

('dividend-yield', 'en', 'Dividend yield',
 'Annual dividend per share as a percentage of the current share price.',
 'A 3% yield on a $100 stock means $3 of dividends per year. Yield rises when price falls, so a spiking yield can signal trouble rather than an opportunity.',
 ARRAY['qualified-dividend','reit']),

('expense-ratio', 'en', 'Expense ratio',
 'The yearly fee (as a percentage of assets) an ETF or mutual fund charges for management.',
 'Compounds over decades — 0.10% vs 0.80% on a $100k portfolio over 30 years is tens of thousands of dollars. Index ETFs average <0.10%; active funds often 0.5–1.0%.',
 ARRAY['etf','index-fund','mutual-fund']),

('etf', 'en', 'ETF (exchange-traded fund)',
 'A basket of assets (stocks, bonds, commodities) that trades on an exchange like a single stock.',
 'ETFs price continuously intraday and usually have lower expense ratios and better tax efficiency than mutual funds. Not all ETFs are index funds — some are actively managed.',
 ARRAY['index-fund','mutual-fund','expense-ratio']),

('index-fund', 'en', 'Index fund',
 'A fund that passively tracks a specific market index (e.g. S&P 500) rather than being actively managed.',
 'Low fees and broad diversification make index funds the default recommendation for most retail investors. Available as both ETFs and mutual funds.',
 ARRAY['etf','mutual-fund','benchmark']),

('mutual-fund', 'en', 'Mutual fund',
 'A pooled investment vehicle priced once daily at net asset value, unlike ETFs which trade intraday.',
 'Mutual funds can require minimum investments and may charge higher fees than ETFs. Some offer features ETFs don''t, like automatic dividend reinvestment and fractional shares.',
 ARRAY['etf','index-fund']),

('bond', 'en', 'Bond',
 'A loan you make to a government or company in exchange for periodic interest plus return of principal at maturity.',
 'Bond prices move inversely to interest rates — if rates rise, existing bond prices fall. Duration measures sensitivity to rate changes.',
 ARRAY['yield','coupon','yield-curve']),

('yield', 'en', 'Yield',
 'The income (interest, dividends) an investment produces, expressed as a percentage of its current price.',
 'For bonds, "yield to maturity" is the total expected return including price changes if held to maturity. For stocks, yield usually means dividend yield.',
 ARRAY['bond','dividend-yield']),

('coupon', 'en', 'Coupon',
 'The fixed interest rate a bond pays on its face value, typically twice a year.',
 'A $1,000 bond with a 5% coupon pays $50 annually ($25 each half). Coupon rate is fixed at issuance; yield fluctuates with the bond''s market price.',
 ARRAY['bond','yield']),

('bid-ask-spread', 'en', 'Bid/ask spread',
 'The gap between the highest price buyers will pay (bid) and the lowest sellers accept (ask).',
 'Wider spreads mean less liquidity and higher hidden transaction cost. Large-cap stocks often trade with penny spreads; thinly traded or after-hours markets can have spreads of several percent.',
 ARRAY['liquidity','volume']),

('market-cap', 'en', 'Market capitalisation',
 'Total value of a company''s outstanding shares (share price × shares outstanding).',
 'Used to classify companies as large-cap (>$10B), mid-cap ($2–10B), small-cap ($250M–2B) or micro-cap. Bigger caps tend to be lower volatility but slower growing.',
 ARRAY['sector','style-box']),

('volume', 'en', 'Volume',
 'The number of shares (or contracts) traded during a given period.',
 'High volume usually means tight spreads and easier execution. Unusually high volume on a news day can signal institutional activity.',
 ARRAY['liquidity','bid-ask-spread']),

('liquidity', 'en', 'Liquidity',
 'How quickly an asset can be bought or sold at a fair price without moving the market.',
 'Cash is perfectly liquid; large-cap stocks during market hours are very liquid; real estate, collectibles and some crypto tokens are the least.',
 ARRAY['volume','bid-ask-spread']),

('volatility', 'en', 'Volatility',
 'How much an asset''s price swings over time, usually measured as the standard deviation of returns.',
 'Annualised volatility of 20% means roughly two-thirds of years will see returns within ±20% of the average. Higher volatility means bigger ups AND bigger downs.',
 ARRAY['standard-deviation','beta','sharpe-ratio','sortino-ratio']),

('beta', 'en', 'Beta',
 'An asset''s sensitivity to the overall market.',
 'Beta of 1.0 moves with the market; 1.5 moves 50% more in either direction; 0 means no correlation. Low-beta stocks (utilities, consumer staples) are defensive; high-beta (tech, small caps) are offensive.',
 ARRAY['alpha','volatility']),

('alpha', 'en', 'Alpha',
 'Return in excess of what a benchmark would predict — the value a manager or strategy adds beyond market exposure.',
 'Positive alpha = outperformance after adjusting for risk. Most active managers fail to deliver persistent positive alpha after fees.',
 ARRAY['beta','benchmark']),

('sharpe-ratio', 'en', 'Sharpe ratio',
 'Excess return per unit of total risk (return above risk-free rate ÷ volatility). Higher is better.',
 'Above 1.0 is generally considered good; above 2.0, excellent. Sharpe treats upside and downside volatility the same — see Sortino for a one-sided alternative.',
 ARRAY['sortino-ratio','volatility']),

('sortino-ratio', 'en', 'Sortino ratio',
 'Like Sharpe, but only penalises downside volatility — a fairer measure for asymmetric return profiles.',
 'Useful when returns are skewed (e.g. option-like strategies). Many practitioners prefer Sortino because investors don''t mind upside "volatility".',
 ARRAY['sharpe-ratio','max-drawdown']),

('max-drawdown', 'en', 'Maximum drawdown',
 'The largest peak-to-trough decline during a given period.',
 'Answers "how bad did it get before recovering?" A portfolio with 20% max drawdown is psychologically very different from one with 50%, even if annual returns are identical.',
 ARRAY['volatility','sortino-ratio']),

('standard-deviation', 'en', 'Standard deviation',
 'Statistical measure of how far returns spread around their average — the common proxy for volatility.',
 'Roughly 68% of observations fall within one standard deviation of the mean, 95% within two. Calculated over the chosen period (monthly, annually, etc.).',
 ARRAY['volatility']),

('correlation', 'en', 'Correlation',
 'How two assets move together. +1 = lockstep, 0 = unrelated, −1 = opposite.',
 'Uncorrelated (or negatively correlated) assets improve diversification. In a crisis, correlations often rise toward 1 — exactly when diversification matters most.',
 ARRAY['diversification']),

('diversification', 'en', 'Diversification',
 'Spreading investments across uncorrelated assets to reduce risk without giving up expected return.',
 'The "only free lunch in finance". Effective diversification requires genuinely uncorrelated holdings — owning 20 US tech stocks is not diversified.',
 ARRAY['correlation','asset-allocation']),

('asset-allocation', 'en', 'Asset allocation',
 'How your portfolio is split across asset classes (stocks, bonds, cash, crypto, real estate, …).',
 'Academic research suggests asset allocation explains the vast majority of long-term portfolio return variance — far more than individual security selection.',
 ARRAY['rebalancing','diversification']),

('rebalancing', 'en', 'Rebalancing',
 'Periodically resetting your portfolio to its target allocation by trimming winners and buying laggards.',
 'Mechanical rebalancing (annual, threshold-based) enforces "buy low, sell high" discipline. Watch tax drag: in taxable accounts, prefer new contributions over outright sales.',
 ARRAY['asset-allocation','dca']),

('dca', 'en', 'Dollar-cost averaging',
 'Investing a fixed amount on a fixed schedule regardless of price — smooths out entry timing.',
 'Removes the "when to buy" decision and reduces the cost of being wrong about timing. Lump-sum investing has historically beaten DCA on average, but DCA reduces regret risk.',
 ARRAY['rebalancing','cost-basis']),

('cost-basis', 'en', 'Cost basis',
 'What you paid for a holding (purchase price + fees). Used to calculate realised gain/loss on sale.',
 'Matters for taxes. Different lots of the same security can have different cost bases; the method you pick (FIFO, LIFO, specific-lot) changes your tax bill.',
 ARRAY['capital-gain','fifo','lifo','wash-sale']),

('fifo', 'en', 'FIFO (first in, first out)',
 'Cost-basis method: the shares you sell are assumed to be the earliest ones you bought.',
 'Often the default. Tends to realise older (larger) gains first, which in a long bull market means higher current-year taxes.',
 ARRAY['cost-basis','lifo']),

('lifo', 'en', 'LIFO (last in, first out)',
 'Cost-basis method: the most recent purchases are treated as sold first.',
 'Useful for minimising short-term tax by realising recent, smaller gains. Availability varies by jurisdiction and asset class.',
 ARRAY['cost-basis','fifo']),

('wash-sale', 'en', 'Wash sale rule',
 'US rule: if you sell at a loss and buy the same (or "substantially identical") security within 30 days, you can''t claim that loss.',
 'The disallowed loss is added to the cost basis of the replacement shares, so it is not permanently lost — just deferred. Applies to spouse and IRA accounts too.',
 ARRAY['capital-gain','cost-basis']),

('capital-gain', 'en', 'Capital gain',
 'The profit from selling an investment above its cost basis.',
 'Short-term (held <1 year, US) is taxed at ordinary income rates. Long-term (≥1 year) usually gets preferential rates. Rules and holding periods vary by jurisdiction.',
 ARRAY['cost-basis','wash-sale','qualified-dividend']),

('qualified-dividend', 'en', 'Qualified dividend',
 'A dividend paid by a US (or qualifying foreign) corporation on shares held long enough to qualify for long-term capital-gains tax rates.',
 'Non-qualified (ordinary) dividends are taxed at regular income rates. Holding-period rules are strict — day traders rarely qualify.',
 ARRAY['dividend-yield','capital-gain','withholding-tax']),

('withholding-tax', 'en', 'Withholding tax',
 'Tax a foreign jurisdiction deducts from dividends or interest before the cash reaches you.',
 'Often partially reclaimable via bilateral tax treaties (e.g. W-8BEN for US withholding on non-US residents). Typical rates are 15–30% depending on country.',
 ARRAY['qualified-dividend','dividend-yield']),

('cagr', 'en', 'CAGR (compound annual growth rate)',
 'The constant yearly rate that would produce the observed total return over the period.',
 'Smooths out volatile year-by-year returns into a single headline number. CAGR of 8% over 10 years means the portfolio compounded as if it earned exactly 8% every year.',
 ARRAY['ytd','volatility']),

('ytd', 'en', 'YTD (year to date)',
 'Performance from January 1 of the current year through today.',
 'Not annualised — a 5% YTD return in March is NOT a 5% annual rate. Compare YTD vs benchmarks over the same window, never across different windows.',
 ARRAY['cagr']),

('bull-market', 'en', 'Bull market',
 'Extended period of rising prices, typically defined as a 20%+ gain from recent lows.',
 'Average historical duration is ~5 years with ~180% cumulative return. Bull markets "climb a wall of worry" — sentiment rarely matches fundamentals until near the top.',
 ARRAY['bear-market','market-correction']),

('bear-market', 'en', 'Bear market',
 'Extended period of falling prices, typically a 20%+ decline from recent highs.',
 'Average historical duration is ~9 months with ~35% decline. Recoveries often happen faster than the preceding decline.',
 ARRAY['bull-market','market-correction','recession']),

('market-correction', 'en', 'Market correction',
 'A 10–20% decline from recent highs. Milder than a bear market and usually short-lived.',
 'Corrections occur roughly once per year on average and usually resolve within a few months. Distinguishing a correction from a bear market is only possible in hindsight.',
 ARRAY['bull-market','bear-market']),

('recession', 'en', 'Recession',
 'Two consecutive quarters of negative GDP growth — the common rule of thumb.',
 'Usually coincides with rising unemployment, falling consumer spending and equity drawdowns. Markets typically bottom before the recession officially ends.',
 ARRAY['inflation','federal-funds-rate','bear-market']),

('inflation', 'en', 'Inflation',
 'The rate at which the general price level rises, eroding the purchasing power of cash.',
 'Stocks and real estate tend to outpace inflation over long horizons. Cash and nominal bonds lose ground. Central banks target ~2% as healthy.',
 ARRAY['cpi','federal-funds-rate']),

('cpi', 'en', 'CPI (Consumer Price Index)',
 'The most-watched inflation gauge, tracking a basket of household goods and services.',
 'Core CPI excludes food and energy (which are volatile). Different countries publish their own versions — US CPI-U is the most quoted globally.',
 ARRAY['inflation']),

('federal-funds-rate', 'en', 'Federal funds rate',
 'The overnight interbank lending rate the US Federal Reserve targets via open-market operations.',
 'Changes ripple through mortgage rates, savings yields, bond prices and ultimately equity valuations. Other central banks (ECB, BoE) maintain equivalent policy rates.',
 ARRAY['yield-curve','inflation','recession']),

('yield-curve', 'en', 'Yield curve',
 'Chart of bond yields across maturities (e.g. 3-month, 2-year, 10-year).',
 'A normal curve slopes up (long-term > short-term). An inverted curve (short > long) has historically preceded most US recessions by 6–18 months.',
 ARRAY['bond','federal-funds-rate','recession']),

('adr', 'en', 'ADR (American Depositary Receipt)',
 'A certificate traded on US exchanges that represents shares of a foreign company.',
 'Lets US investors buy foreign stocks without opening a foreign brokerage account. ADR fees are charged to holders and can reduce the effective dividend yield.',
 ARRAY['sector']),

('reit', 'en', 'REIT (Real Estate Investment Trust)',
 'A company that owns (or finances) income-producing property and must distribute at least 90% of taxable income as dividends.',
 'Offers real-estate exposure with the liquidity of a stock. US REIT dividends are generally taxed as ordinary income, not qualified dividends.',
 ARRAY['dividend-yield','sector']),

('sector', 'en', 'Sector',
 'Broad industry grouping (tech, healthcare, energy, financials, …) used to measure concentration.',
 'The GICS 11-sector taxonomy is the most common. Over-concentration in a single sector is the most common hidden risk in retail portfolios.',
 ARRAY['factor-investing','style-box']),

('factor-investing', 'en', 'Factor investing',
 'Portfolio construction targeting systematic return drivers — commonly value, growth, momentum, quality and size.',
 'Academic research shows certain factors have delivered persistent return premia over long periods. Factor ETFs tilt portfolios toward one or more factors cheaply.',
 ARRAY['style-box','beta','sector']),

('style-box', 'en', 'Style box',
 'A 3×3 grid (growth/core/value × small/mid/large cap) popularised by Morningstar to visualise a fund''s equity style.',
 'Cell shading shows the fund''s weight in each bucket. Helpful for spotting overlap between two "different" funds that secretly own the same large-cap growth names.',
 ARRAY['factor-investing','market-cap','sector']),

('benchmark', 'en', 'Benchmark',
 'A reference index used to judge portfolio performance (e.g. S&P 500, MSCI World, Bloomberg Agg Bond).',
 'Pick a benchmark that matches your portfolio''s risk and geography, not the highest-returning one. Alpha = portfolio return minus benchmark return.',
 ARRAY['alpha','index-fund']);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM glossary_terms WHERE locale = 'en';
-- +goose StatementEnd

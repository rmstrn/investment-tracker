# TASK 08 — iOS App (Swift/SwiftUI)

**Волна:** 2
**Зависит от:** TASK_02 (design system), TASK_03 (API contract), TASK_04 (Core API)
**Блокирует:** ничего (конечный продукт)
**Срок:** 6-8 недель

## Цель

Нативное iOS-приложение, которое ощущается премиально. Не "порт веба",
а полноценный iOS citizen — с Liquid Glass, Swift Charts, виджетами,
push-уведомлениями, SwiftData офлайн-кешем.

## Стек

- **Swift 6** (strict concurrency)
- **SwiftUI** (минимум iOS 17, целимся в iOS 26+ для Liquid Glass)
- **Observable + @Observable** для state management
  (TCA — если архитектура станет сложной)
- **URLSession + async/await** для сети (без Alamofire)
- **SwiftData** для локального хранения / офлайн-кеша
- **Swift Charts** — встроенные графики
- **Clerk iOS SDK** — auth
- **Swift OpenAPI Generator** (Apple, официальный) — сгенерированный клиент
- **swift-log + swift-metrics** — логирование и метрики
- **Sentry Swift SDK** — ошибки

## Структура

```
InvestmentTracker/
├── InvestmentTracker.xcodeproj
├── InvestmentTracker/
│   ├── App/
│   │   ├── InvestmentTrackerApp.swift   # @main
│   │   ├── AppState.swift
│   │   └── RootView.swift
│   ├── Features/
│   │   ├── Authentication/
│   │   ├── Dashboard/
│   │   │   ├── DashboardView.swift
│   │   │   ├── DashboardViewModel.swift
│   │   │   └── Components/
│   │   ├── Positions/
│   │   ├── Accounts/
│   │   ├── AIChat/
│   │   ├── Insights/
│   │   └── Settings/
│   ├── Core/
│   │   ├── API/
│   │   │   ├── APIClient.swift
│   │   │   ├── Generated/            # swift-openapi-generator output
│   │   │   └── Endpoints/
│   │   ├── Auth/
│   │   │   └── AuthManager.swift     # Clerk integration
│   │   ├── Storage/
│   │   │   └── Models/               # SwiftData models
│   │   ├── Networking/
│   │   │   └── URLSession+Ext.swift
│   │   └── Formatting/
│   │       └── MoneyFormatter.swift
│   ├── DesignSystem/
│   │   ├── Colors.swift              # generated from design tokens
│   │   ├── Typography.swift
│   │   ├── Spacing.swift
│   │   └── Components/
│   │       ├── PrimaryButton.swift
│   │       ├── Card.swift
│   │       └── ...
│   └── Resources/
│       ├── Assets.xcassets
│       └── Localizable.xcstrings
├── InvestmentTrackerTests/
├── InvestmentTrackerUITests/
└── InvestmentTrackerWidgets/          # extension для Home Screen
```

## Ключевые экраны

### 1. Authentication

Через Clerk iOS SDK:

```swift
import Clerk

@main
struct InvestmentTrackerApp: App {
    @StateObject private var clerk = Clerk.shared
    
    var body: some Scene {
        WindowGroup {
            if clerk.user != nil {
                RootView()
            } else {
                SignInView()
            }
        }
        .task {
            await clerk.configure(publishableKey: "pk_...")
        }
    }
}
```

### 2. Main Tab Structure

Bottom tab bar: **Portfolio | Positions | AI | Insights | Settings**

```swift
TabView {
    DashboardView()
        .tabItem { Label("Portfolio", systemImage: "chart.pie.fill") }
    PositionsView()
        .tabItem { Label("Positions", systemImage: "list.bullet") }
    AIChatView()
        .tabItem { Label("AI", systemImage: "sparkles") }
    InsightsView()
        .tabItem { Label("Insights", systemImage: "lightbulb.fill") }
    SettingsView()
        .tabItem { Label("Settings", systemImage: "gearshape.fill") }
}
```

### 3. Dashboard

Большая карточка портфеля сверху, ниже графики и mover'ы.

```swift
struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if let insight = viewModel.topInsight {
                    InsightCard(insight: insight)
                }
                
                PortfolioValueCard(portfolio: viewModel.portfolio)
                
                PortfolioChart(snapshots: viewModel.snapshots, 
                              selectedPeriod: $viewModel.period)
                
                AllocationDonut(allocation: viewModel.allocation)
                
                TopMoversCard(movers: viewModel.topMovers)
                
                if !viewModel.upcomingDividends.isEmpty {
                    DividendCalendarCard(dividends: viewModel.upcomingDividends)
                }
            }
            .padding()
        }
        .refreshable {
            await viewModel.refresh()
        }
        .task {
            await viewModel.load()
        }
    }
}
```

### 4. Swift Charts для графиков

```swift
struct PortfolioChart: View {
    let snapshots: [PortfolioSnapshot]
    @Binding var selectedPeriod: Period
    
    var body: some View {
        Chart(snapshots) { snapshot in
            LineMark(
                x: .value("Date", snapshot.date),
                y: .value("Value", snapshot.totalValue)
            )
            .foregroundStyle(.purple.gradient)
            .interpolationMethod(.catmullRom)
        }
        .chartYAxis {
            AxisMarks(position: .trailing)
        }
        .frame(height: 200)
        // period picker under the chart
    }
}
```

### 5. AI Chat

```swift
struct AIChatView: View {
    @State private var viewModel = AIChatViewModel()
    @FocusState private var inputFocused: Bool
    
    var body: some View {
        VStack {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.messages) { message in
                            MessageBubble(message: message)
                                .id(message.id)
                        }
                        
                        if viewModel.isStreaming {
                            StreamingBubble(text: viewModel.streamingText)
                        }
                    }
                    .padding()
                }
                .onChange(of: viewModel.messages.count) {
                    withAnimation { proxy.scrollTo(viewModel.messages.last?.id) }
                }
            }
            
            ChatInputBar(
                text: $viewModel.input,
                onSend: { Task { await viewModel.send() } },
                focused: $inputFocused
            )
        }
    }
}
```

SSE-стриминг через URLSession:

```swift
extension APIClient {
    func streamChat(message: String) -> AsyncThrowingStream<ChatEvent, Error> {
        AsyncThrowingStream { continuation in
            Task {
                let request = try makeRequest(...)
                let (bytes, response) = try await URLSession.shared.bytes(for: request)
                
                for try await line in bytes.lines {
                    guard line.hasPrefix("data: ") else { continue }
                    let json = String(line.dropFirst(6))
                    let event = try JSONDecoder().decode(ChatEvent.self, from: Data(json.utf8))
                    continuation.yield(event)
                }
                
                continuation.finish()
            }
        }
    }
}
```

### 6. Connect Account flow

SnapTrade использует OAuth — открываем в Safari View Controller:

```swift
import AuthenticationServices

func connectSnapTradeAccount() async throws {
    let connectionURL = try await api.getSnapTradeConnectionURL()
    
    let session = ASWebAuthenticationSession(
        url: connectionURL,
        callbackURLScheme: "investmenttracker"
    ) { callbackURL, error in
        // handle callback
    }
    session.presentationContextProvider = ...
    session.start()
}
```

Binance/Coinbase — ручной ввод API keys с инструкцией.

### 7. Position Detail

```swift
struct PositionDetailView: View {
    let positionId: String
    @State private var viewModel = PositionDetailViewModel()
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                CurrentHoldingCard(position: viewModel.position)
                
                PriceChart(prices: viewModel.prices)
                
                TransactionHistorySection(transactions: viewModel.transactions)
                
                if let dividends = viewModel.upcomingDividends {
                    DividendsCard(dividends: dividends)
                }
                
                AIInsightsSection(insights: viewModel.relatedInsights)
            }
            .padding()
        }
    }
}
```

## iOS-специфичные фичи

### Liquid Glass (iOS 26+)

Для совместимости делаем conditional:

```swift
@available(iOS 26, *)
var body: some View {
    content
        .glassEffect(...)           // новый iOS 26 API
}
```

На более старых iOS — деградируем до blur + transparency.

### Widgets (Home Screen)

`InvestmentTrackerWidgets` extension:
- Small: total value + day change
- Medium: total + график + top mover
- Large: full dashboard-like

Data provided by WidgetKit, обновляется каждые 30 мин.

```swift
struct PortfolioWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "PortfolioWidget", provider: Provider()) { entry in
            PortfolioWidgetView(entry: entry)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
```

### Live Activities (Dynamic Island)

Для важных событий: "Your portfolio just hit a new high".

```swift
struct PortfolioActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var totalValue: Decimal
        var dayChange: Decimal
    }
}
```

### Push Notifications

APNS нативно, через Clerk-backend интеграцию:
- Новый critical insight
- Существенное изменение портфеля (>5% за день)
- Дивидендная выплата
- Sync-ошибка (требует внимания юзера)

**Важно:** все уведомления opt-in, настраиваются в Settings.

### Biometric Auth

Для открытия приложения:

```swift
import LocalAuthentication

func authenticate() async throws -> Bool {
    let context = LAContext()
    var error: NSError?
    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        return false
    }
    
    return try await context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Unlock your portfolio"
    )
}
```

### App Intents + Siri

"Hey Siri, what's my portfolio value?"

```swift
struct GetPortfolioValueIntent: AppIntent {
    static var title: LocalizedStringResource = "Get Portfolio Value"
    
    func perform() async throws -> some IntentResult & ReturnsValue<String> {
        let portfolio = try await api.getPortfolio()
        return .result(value: formatMoney(portfolio.totalValue))
    }
}
```

### SwiftData для офлайн-кеша

```swift
@Model
class CachedPosition {
    @Attribute(.unique) var id: String
    var symbol: String
    var quantity: Decimal
    var currentPrice: Decimal
    var lastUpdated: Date
    
    init(...) { ... }
}
```

При открытии приложения — показываем кеш мгновенно, в фоне обновляем.

## Design System в Swift

Tokens генерятся из Figma через Style Dictionary:

```swift
// DesignSystem/Colors.swift (автогенерируется)
extension Color {
    static let backgroundPrimary = Color("BackgroundPrimary")      // из Asset Catalog
    static let textPrimary = Color("TextPrimary")
    static let portfolioGain = Color("PortfolioGain")              // зелёный, приглушённый
    static let portfolioLoss = Color("PortfolioLoss")              // красный, приглушённый
    // ...
}

extension Font {
    static let displayLarge = Font.system(size: 34, weight: .semibold, design: .rounded)
    // ...
}
```

Все цвета через Asset Catalog — light/dark автоматически.

## Performance

- **Cold start < 400ms** до первого экрана
- **60 FPS** при скролле даже больших списков (LazyVStack)
- **Battery-friendly** — минимум background work
- **Memory < 150 MB** для основного app

## Testing

- **Unit-тесты:** бизнес-логика, formatters, view models
- **Snapshot-тесты** через swift-snapshot-testing для ключевых экранов
- **UI-тесты** через XCUITest для критичных путей
- **Accessibility-тесты** — VoiceOver навигация работает

## Accessibility

- Dynamic Type (все размеры шрифтов уважаем)
- VoiceOver labels для всех интерактивных элементов
- Increase Contrast mode поддержан
- Reduce Motion уважаем

## Localization

- Stringsdict для plurals
- App localized на английский + русский (минимум) + Ukrainian
- Currency formatting через NumberFormatter с правильной локалью
- Date formatting через DateFormatter

## Definition of Done

- [ ] Все главные экраны реализованы
- [ ] Clerk auth работает end-to-end
- [ ] Все API endpoints интегрированы
- [ ] AI Chat streaming работает плавно
- [ ] Swift Charts выглядят как в дизайне
- [ ] Dark mode полный (не просто инвертированный)
- [ ] Widgets работают (small, medium, large)
- [ ] Push notifications работают
- [ ] Biometric auth для открытия
- [ ] SwiftData кеш работает (офлайн fallback)
- [ ] Accessibility: VoiceOver прогоняется на всех экранах
- [ ] Dynamic Type: интерфейс не ломается на максимальных размерах
- [ ] Locale: RU, EN, UK
- [ ] 60 FPS на скролле
- [ ] Sentry интеграция
- [ ] PostHog iOS SDK интегрирован
- [ ] TestFlight build для бета-тестирования
- [ ] App Store screenshots + метадата готовы
- [ ] App Store Review guidelines пройдены (пункты 2.1, 3.2, 5.1 особенно)

## Важные решения

- **Минимальная версия iOS 17** — новые SwiftUI API, ~95% юзеров покрыто
- **Observable macro, не ObservableObject** — новый API, быстрее
- **async/await + URLSession** — без сторонних networking libs
- **SwiftData, не Core Data** — проще, современнее
- **Нативный Swift Charts** — не рисуем графики вручную
- **Не переиспользуем ReactNative код** — нативный путь

## Что НЕ делаем на MVP

- Apple Watch companion (в v2)
- iPad-оптимизация (работает в compatibility mode, оптимизация позже)
- macOS (через Catalyst) — позже
- CloudKit sync (у нас свой бек, синх через него)

## App Store подготовка

- **Privacy labels** — что собираем (usage, crash data; не личные данные)
- **Age rating:** 17+ (финансовая информация)
- **Screenshots** на iPhone 15 Pro Max + iPhone 15 + iPad (если выпускаем)
- **App Preview video** (опционально, но конверсия выше)
- **Description** + keywords
- **Beta через TestFlight** за 2+ недели до публичного запуска

## Следующие шаги

Когда готово:
- Public beta через TestFlight → App Store
- Android версия (Kotlin + Compose) — использует те же API endpoints

// Brand
export { Logo, type LogoProps, type LogoVariant } from './brand/Logo';
export { ThemeToggle } from './brand/ThemeToggle';

// Dividers — section transitions (marketing register)
export {
  PaintDrip,
  type PaintDripProps,
  type PaintDripVariant,
} from './dividers/PaintDrip';

// Primitives — generic
export { AskAiButton, type AskAiButtonProps } from './primitives/AskAiButton';
export { Avatar, type AvatarProps } from './primitives/Avatar';
export { Badge, type BadgeProps } from './primitives/Badge';
export { Button, type ButtonProps } from './primitives/Button';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
} from './primitives/Card';
export { CountUpNumber, type CountUpNumberProps } from './primitives/CountUpNumber';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  type DialogProps,
} from './primitives/Dialog';
export {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  type DropdownItemProps,
} from './primitives/Dropdown';
export { EmptyState, type EmptyStateProps } from './primitives/EmptyState';
export { Input, type InputProps } from './primitives/Input';
export {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from './primitives/SegmentedControl';
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  type SheetProps,
} from './primitives/Sheet';
export { Shimmer } from './primitives/Shimmer';
export { Skeleton } from './primitives/Skeleton';
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsContentProps,
  type TabsProps,
  type TabsTriggerProps,
} from './primitives/Tabs';
export { ToastProvider, useToast, type ToastOptions } from './primitives/Toast';
export { Tooltip, type TooltipProps } from './primitives/Tooltip';

// Primitives — AI / chat
export { ChatInputPill, type ChatInputPillProps } from './primitives/ChatInputPill';
export {
  ExplainerTooltip,
  type ExplainerTooltipProps,
} from './primitives/ExplainerTooltip';
export {
  SuggestedPrompt,
  SuggestedPromptRow,
  type SuggestedPromptProps,
} from './primitives/SuggestedPrompt';
export { ToolUseCard, type ToolUseCardProps } from './primitives/ToolUseCard';
export { ThinkingDots, TypingCursor } from './primitives/TypingCursor';

// Primitives — freemium / trust / account state
export {
  BellDropdown,
  type BellDropdownProps,
  type Notification,
  type NotificationTone,
} from './primitives/BellDropdown';
export { GlobalBanner, type GlobalBannerProps } from './primitives/GlobalBanner';
export { LockedPreview, type LockedPreviewProps } from './primitives/LockedPreview';
export { PaywallModal, type PaywallModalProps } from './primitives/PaywallModal';
export { PlanBadge, type PlanBadgeProps, type PlanTier } from './primitives/PlanBadge';
export {
  SyncStatusBadge,
  type SyncStatus,
  type SyncStatusBadgeProps,
} from './primitives/SyncStatusBadge';
export { TrustRow, type TrustRowProps } from './primitives/TrustRow';
export { UsageIndicator, type UsageIndicatorProps } from './primitives/UsageIndicator';

// Shells — dumb presentational app chrome (no next/link, no usePathname)
export { AppShell, type AppShellProps } from './shells/AppShell';
export { FloatingAiFab, type FloatingAiFabProps } from './shells/FloatingAiFab';
export { MobileTabBar, type MobileTabBarProps } from './shells/MobileTabBar';
export { Sidebar, type SidebarProps } from './shells/Sidebar';
export { TopBar, type TopBarProps } from './shells/TopBar';
export type { LinkComponent, NavItem } from './shells/types';

// Domain
export {
  AccountConnectCard,
  type AccountConnectCardProps,
  type AccountStatus,
} from './domain/AccountConnectCard';
export { AssetRow, type AssetRowProps } from './domain/AssetRow';
export {
  ChatMessage,
  type ChatMessageProps,
  type ChatRole,
} from './domain/ChatMessage';
export {
  InsightCard,
  type InsightCardProps,
  type InsightSeverity,
} from './domain/InsightCard';
export { PortfolioCard, type PortfolioCardProps } from './domain/PortfolioCard';
export {
  TransactionRow,
  type TransactionRowProps,
  type TransactionKind,
} from './domain/TransactionRow';

// Components — page-level surfaces
export {
  COMPACT_COPY as REGULATORY_DISCLAIMER_COMPACT_COPY,
  FULL_DISCLAIMER_PATH as REGULATORY_DISCLAIMER_FULL_PATH,
  RegulatoryDisclaimer,
  type RegulatoryDisclaimerLang,
  type RegulatoryDisclaimerProps,
  type RegulatoryDisclaimerVariant,
  VERBOSE_COPY as REGULATORY_DISCLAIMER_VERBOSE_COPY,
} from './components/regulatory-disclaimer';

// Utilities
export { cn } from './lib/cn';
export { useReducedMotion } from './lib/useReducedMotion';

import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartPieIcon,
  StarIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/portfolio', label: 'Portfolio', icon: ChartPieIcon },
  { path: '/watchlist', label: 'Watchlist', icon: StarIcon },
  { path: '/trade', label: 'Trade', icon: ArrowsRightLeftIcon },
];

const secondaryNavItems = [
  { path: '/orders', label: 'Orders & History', icon: ClipboardDocumentListIcon },
  { path: '/news', label: 'Market News', icon: NewspaperIcon },
  { path: '/alerts', label: 'Price Alerts', icon: BellAlertIcon },
  { path: '/accounts', label: 'Connected Accounts', icon: BanknotesIcon },
];

const bottomNavItems = [
  { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  { path: '/help', label: 'Help & Support', icon: QuestionMarkCircleIcon },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();

  const NavLink = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-background transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between border-b border-border p-4 md:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>

        <ScrollArea className="h-full px-3 py-4">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main
              </h3>
              {mainNavItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="space-y-1">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                More
              </h3>
              {secondaryNavItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            {/* Bottom Navigation */}
            <div className="space-y-1 border-t border-border pt-4">
              {bottomNavItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

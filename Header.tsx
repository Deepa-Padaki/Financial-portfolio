import { Bars3Icon, BellIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <h1 className="hidden text-xl font-bold text-foreground sm:block">
            TradeShift
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Notifications" 
                className="relative hover:bg-accent transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-pulse"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-card shadow-lg border-border"
              sideOffset={8}
            >
              <DropdownMenuLabel className="text-base font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[320px]">
                <div className="space-y-1 p-1">
                  <div 
                    className="flex flex-col gap-2 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate('/alerts')}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm">Price Alert Triggered</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">2m ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          AAPL reached your target price of $175.00
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-col gap-2 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate('/orders')}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm">Order Filled</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">1h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your buy order for 10 shares of TSLA was executed at $245.50
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-col gap-2 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate('/portfolio')}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm">Market Update</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">3h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          S&P 500 up 1.2% today, your portfolio value increased by $1,234
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DropdownMenuSeparator />
              <button
                onClick={() => navigate('/alerts')}
                className="w-full p-2 text-center text-sm font-medium text-primary hover:bg-accent rounded-sm transition-colors"
              >
                View All Notifications
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

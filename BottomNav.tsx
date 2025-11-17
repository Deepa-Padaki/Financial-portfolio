import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartPieIcon, 
  StarIcon, 
  ArrowsRightLeftIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChartPieIcon as ChartPieIconSolid,
  StarIcon as StarIconSolid,
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: HomeIcon,
    iconSolid: HomeIconSolid
  },
  { 
    path: '/portfolio', 
    label: 'Portfolio', 
    icon: ChartPieIcon,
    iconSolid: ChartPieIconSolid
  },
  { 
    path: '/watchlist', 
    label: 'Watchlist', 
    icon: StarIcon,
    iconSolid: StarIconSolid
  },
  { 
    path: '/trade', 
    label: 'Trade', 
    icon: ArrowsRightLeftIcon,
    iconSolid: ArrowsRightLeftIconSolid
  },
  { 
    path: '/more', 
    label: 'More', 
    icon: EllipsisHorizontalIcon,
    iconSolid: EllipsisHorizontalIconSolid
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    {
      label: 'Overview',
      path: '/financial-overview-dashboard',
      icon: 'Home'
    },
    {
      label: 'Budget',
      path: '/budget-tracking-dashboard',
      icon: 'Target'
    },
    {
      label: 'Analytics',
      path: '/spending-analytics-dashboard',
      icon: 'BarChart3'
    },
    {
      label: 'Goals',
      path: '/financial-goals-dashboard',
      icon: 'Flag'
    }
  ];

  const secondaryNavItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Reports', path: '/reports', icon: 'FileText' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">FinanceTracker</span>
              <span className="text-xs text-muted-foreground font-medium">Pro</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* More Menu - Desktop */}
          <div className="hidden md:block relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              More
            </Button>
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 z-1001">
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              className="text-muted-foreground hover:text-foreground"
            />
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMoreMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-6 py-4 space-y-2">
            {primaryNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
            
            <div className="border-t border-border pt-2 mt-4">
              {secondaryNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-hover"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Click outside to close dropdown */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-999"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
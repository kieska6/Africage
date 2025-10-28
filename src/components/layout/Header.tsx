import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { MessageSquare, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { NotificationsBell } from '../notifications/NotificationsBell';
import logo from '../../assets/logo.png';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userInitials = user?.user_metadata.first_name?.[0] + user?.user_metadata.last_name?.[0] || user?.email?.[0] || 'U';

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="AFRICAGE" className="h-10 w-auto" />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/send-package" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Envoyer un colis
            </Link>
            <Link to="/travel" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Voyager
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationsBell />
                <Link to="/messages" className="p-2 rounded-full hover:bg-neutral-100">
                  <MessageSquare className="w-5 h-5 text-neutral-600" />
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    {userInitials.toUpperCase()}
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-neutral-800 truncate">{user.user_metadata.first_name} {user.user_metadata.last_name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </Link>
                      <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Mon Profil
                      </Link>
                      <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-neutral-700 hover:text-primary p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/send-package" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-700 hover:text-primary font-medium">
              Envoyer un colis
            </Link>
            <Link to="/travel" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-700 hover:text-primary font-medium">
              Voyager
            </Link>
            
            <hr className="my-2" />

            {user ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-neutral-700">Notifications</span>
                  <NotificationsBell />
                </div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-700 hover:text-primary font-medium">Tableau de bord</Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-700 hover:text-primary font-medium">Mon Profil</Link>
                <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-700 hover:text-primary font-medium">Messages</Link>
                <Button variant="outline" className="w-full mt-2" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">S'inscrire</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
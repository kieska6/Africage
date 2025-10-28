import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Package, MessageSquare, Menu, X } from 'lucide-react';
import { NotificationsBell } from '../notifications/NotificationsBell';

export function Header() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Ferme le menu si la taille de la fenêtre change pour passer en mode bureau
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <Package className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold text-accent">Africage</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/send-package" 
              className="text-neutral-700 hover:text-accent transition-colors font-medium"
            >
              Envoyer un colis
            </Link>
            <Link 
              to="/travel" 
              className="text-neutral-700 hover:text-accent transition-colors font-medium"
            >
              Voyager
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationsBell />
                <Link to="/messages">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Tableau de bord
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-700 hover:text-accent p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              to="/send-package" 
              onClick={() => setIsOpen(false)}
              className="block py-2 text-neutral-700 hover:text-accent font-medium"
            >
              Envoyer un colis
            </Link>
            <Link 
              to="/travel" 
              onClick={() => setIsOpen(false)}
              className="block py-2 text-neutral-700 hover:text-accent font-medium"
            >
              Voyager
            </Link>
            
            <hr className="my-2" />

            {user ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-neutral-700">Notifications</span>
                  <NotificationsBell />
                </div>
                <Link to="/messages" onClick={() => setIsOpen(false)} className="block py-2 text-neutral-700 hover:text-accent font-medium">Messages</Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-neutral-700 hover:text-accent font-medium">Tableau de bord</Link>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleSignOut}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
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
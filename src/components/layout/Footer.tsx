import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Africage. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/terms-of-service" className="text-sm hover:text-primary transition-colors">
              Conditions d'Utilisation
            </Link>
            <Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
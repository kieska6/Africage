import { CreateShipmentForm } from '../components/shipments/CreateShipmentForm';

export function CreateShipmentPage() {
  return (
    <>
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Publier une nouvelle annonce de colis
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Remplissez les informations de votre colis pour trouver un voyageur de confiance 
              qui pourra le transporter en toute sécurité.
            </p>
          </div>
          
          <div className="bg-white rounded-4xl shadow-xl p-8">
            <CreateShipmentForm />
          </div>
        </div>
      </div>
    </>
  );
}
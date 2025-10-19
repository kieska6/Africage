import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Package, MapPin, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

interface ShipmentForm {
  title: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  pickupAddress: string;
  pickupCity: string;
  pickupCountry: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCountry: string;
  proposedPrice: string;
  pickupDateFrom: string;
  pickupDateTo: string;
  deliveryDateBy: string;
  isUrgent: boolean;
  isFragile: boolean;
  requiresSignature: boolean;
}

export function NewShipmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ShipmentForm>({
    title: '',
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    pickupAddress: '',
    pickupCity: '',
    pickupCountry: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: '',
    proposedPrice: '',
    pickupDateFrom: '',
    pickupDateTo: '',
    deliveryDateBy: '',
    isUrgent: false,
    isFragile: false,
    requiresSignature: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/shipments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     weight: parseFloat(formData.weight),
      //     length: formData.length ? parseFloat(formData.length) : null,
      //     width: formData.width ? parseFloat(formData.width) : null,
      //     height: formData.height ? parseFloat(formData.height) : null,
      //     proposedPrice: parseFloat(formData.proposedPrice)
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error('Erreur lors de la création de l\'annonce');
      // }

      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/shipments');
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error('Error creating shipment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer une annonce de colis</h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations de votre colis pour trouver un voyageur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Informations du colis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Informations du colis</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Titre de l'annonce *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 15 Pro Max"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Décrivez votre colis en détail..."
                />
              </div>

              <Input
                label="Poids (kg) *"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="0.5"
                required
              />

              <Input
                label="Prix proposé (XOF) *"
                name="proposedPrice"
                type="number"
                value={formData.proposedPrice}
                onChange={handleInputChange}
                placeholder="25000"
                required
              />

              <Input
                label="Longueur (cm)"
                name="length"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={handleInputChange}
                placeholder="20"
              />

              <Input
                label="Largeur (cm)"
                name="width"
                type="number"
                step="0.1"
                value={formData.width}
                onChange={handleInputChange}
                placeholder="15"
              />

              <Input
                label="Hauteur (cm)"
                name="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="5"
              />
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Colis urgent</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFragile"
                  checked={formData.isFragile}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Colis fragile</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresSignature"
                  checked={formData.requiresSignature}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Signature requise à la livraison</span>
              </label>
            </div>
          </div>

          {/* Adresses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Adresses</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Récupération</h3>
                <div className="space-y-4">
                  <Input
                    label="Adresse complète *"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="123 Rue de la Paix"
                    required
                  />
                  <Input
                    label="Ville *"
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleInputChange}
                    placeholder="Dakar"
                    required
                  />
                  <Input
                    label="Pays *"
                    name="pickupCountry"
                    value={formData.pickupCountry}
                    onChange={handleInputChange}
                    placeholder="Sénégal"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Livraison</h3>
                <div className="space-y-4">
                  <Input
                    label="Adresse complète *"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="456 Avenue de la République"
                    required
                  />
                  <Input
                    label="Ville *"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleInputChange}
                    placeholder="Abidjan"
                    required
                  />
                  <Input
                    label="Pays *"
                    name="deliveryCountry"
                    value={formData.deliveryCountry}
                    onChange={handleInputChange}
                    placeholder="Côte d'Ivoire"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Contraintes temporelles</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Récupération à partir du"
                name="pickupDateFrom"
                type="date"
                value={formData.pickupDateFrom}
                onChange={handleInputChange}
              />

              <Input
                label="Récupération jusqu'au"
                name="pickupDateTo"
                type="date"
                value={formData.pickupDateTo}
                onChange={handleInputChange}
              />

              <Input
                label="Livraison avant le"
                name="deliveryDateBy"
                type="date"
                value={formData.deliveryDateBy}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/shipments')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Créer l'annonce
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
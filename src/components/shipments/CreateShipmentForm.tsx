import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Package, MapPin, DollarSign, Ruler } from 'lucide-react';

interface ShipmentFormData {
  title: string;
  description: string;
  pickup_city: string;
  pickup_country: string;
  delivery_city: string;
  delivery_country: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  proposed_price: string;
}

export function CreateShipmentForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ShipmentFormData>({
    title: '',
    description: '',
    pickup_city: '',
    pickup_country: '',
    delivery_city: '',
    delivery_country: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    proposed_price: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour publier une annonce');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validation des champs requis
      if (!formData.title || !formData.pickup_city || !formData.delivery_city || 
          !formData.weight || !formData.proposed_price) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Préparation des données pour Supabase
      const shipmentData = {
        sender_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        pickup_city: formData.pickup_city.trim(),
        pickup_country: formData.pickup_country.trim() || 'Non spécifié',
        delivery_city: formData.delivery_city.trim(),
        delivery_country: formData.delivery_country.trim() || 'Non spécifié',
        pickup_address: `${formData.pickup_city}, ${formData.pickup_country || 'Non spécifié'}`,
        delivery_address: `${formData.delivery_city}, ${formData.delivery_country || 'Non spécifié'}`,
        weight: parseFloat(formData.weight),
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        proposed_price: parseFloat(formData.proposed_price),
        currency: 'XOF',
        status: 'PENDING_MATCH'
      };

      // Insertion dans Supabase
      const { data, error: insertError } = await supabase
        .from('shipments')
        .insert([shipmentData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Erreur lors de la création de l\'annonce:', err);
      setError(err.message || 'Une erreur est survenue lors de la publication de votre annonce');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          Annonce publiée avec succès !
        </h3>
        <p className="text-neutral-600 mb-4">
          Votre annonce est maintenant visible par les voyageurs. 
          Vous serez notifié dès qu'un voyageur sera intéressé.
        </p>
        <p className="text-sm text-neutral-500">
          Redirection vers le tableau de bord...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Informations générales */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Informations du colis
          </h3>
        </div>

        <Input
          label="Titre de l'annonce *"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: iPhone 15 Pro Max neuf"
          required
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Décrivez votre colis en détail (état, contenu, précautions particulières...)"
          />
        </div>
      </div>

      {/* Adresses */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Itinéraire
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-700">Point de départ</h4>
            <Input
              label="Ville de départ *"
              name="pickup_city"
              value={formData.pickup_city}
              onChange={handleInputChange}
              placeholder="Ex: Dakar"
              required
            />
            <Input
              label="Pays de départ"
              name="pickup_country"
              value={formData.pickup_country}
              onChange={handleInputChange}
              placeholder="Ex: Sénégal"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-neutral-700">Destination</h4>
            <Input
              label="Ville d'arrivée *"
              name="delivery_city"
              value={formData.delivery_city}
              onChange={handleInputChange}
              placeholder="Ex: Abidjan"
              required
            />
            <Input
              label="Pays d'arrivée"
              name="delivery_country"
              value={formData.delivery_country}
              onChange={handleInputChange}
              placeholder="Ex: Côte d'Ivoire"
            />
          </div>
        </div>
      </div>

      {/* Dimensions et poids */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Ruler className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Dimensions et poids
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Poids (kg) *"
            name="weight"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Ex: 0.5"
            required
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700">
              Dimensions (cm) - Optionnel
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Input
                name="length"
                type="number"
                step="0.1"
                min="0"
                value={formData.length}
                onChange={handleInputChange}
                placeholder="Longueur"
              />
              <Input
                name="width"
                type="number"
                step="0.1"
                min="0"
                value={formData.width}
                onChange={handleInputChange}
                placeholder="Largeur"
              />
              <Input
                name="height"
                type="number"
                step="0.1"
                min="0"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Hauteur"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Récompense */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Récompense
          </h3>
        </div>

        <Input
          label="Récompense proposée (XOF) *"
          name="proposed_price"
          type="number"
          min="1000"
          step="500"
          value={formData.proposed_price}
          onChange={handleInputChange}
          placeholder="Ex: 25000"
          required
        />
        <p className="text-sm text-neutral-500">
          Montant que vous êtes prêt à payer pour le transport de votre colis.
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1 py-3 text-base"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold"
        >
          Publier l'annonce
        </Button>
      </div>
    </form>
  );
}
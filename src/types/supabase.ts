export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          profile_avatar_url: string | null;
          country: string | null;
          date_of_birth: string | null;
          role: 'USER' | 'MODERATOR' | 'ADMIN';
          kyc_status: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
          is_profile_complete: boolean;
          average_rating: number | null;
          review_count: number;
          is_admin: boolean;
          is_banned: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          profile_avatar_url?: string | null;
          country?: string | null;
          date_of_birth?: string | null;
          role?: 'USER' | 'MODERATOR' | 'ADMIN';
          kyc_status?: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
          is_profile_complete?: boolean;
          average_rating?: number | null;
          review_count?: number;
          is_admin?: boolean;
          is_banned?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          profile_avatar_url?: string | null;
          country?: string | null;
          date_of_birth?: string | null;
          role?: 'USER' | 'MODERATOR' | 'ADMIN';
          kyc_status?: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
          is_profile_complete?: boolean;
          average_rating?: number | null;
          review_count?: number;
          is_admin?: boolean;
          is_banned?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      shipments: {
        Row: {
          id: string;
          sender_id: string;
          title: string;
          description: string | null;
          weight: number;
          length: number | null;
          width: number | null;
          height: number | null;
          photos: string[] | null;
          pickup_address: string;
          pickup_city: string;
          pickup_country: string;
          delivery_address: string;
          delivery_city: string;
          delivery_country: string;
          proposed_price: number;
          currency: string;
          pickup_date_from: string | null;
          pickup_date_to: string | null;
          delivery_date_by: string | null;
          status: 'PENDING_MATCH' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELED';
          is_urgent: boolean;
          is_fragile: boolean;
          requires_signature: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          title: string;
          description?: string | null;
          weight: number;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          photos?: string[] | null;
          pickup_address: string;
          pickup_city: string;
          pickup_country: string;
          delivery_address: string;
          delivery_city: string;
          delivery_country: string;
          proposed_price: number;
          currency?: string;
          pickup_date_from?: string | null;
          pickup_date_to?: string | null;
          delivery_date_by?: string | null;
          status?: 'PENDING_MATCH' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELED';
          is_urgent?: boolean;
          is_fragile?: boolean;
          requires_signature?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          title?: string;
          description?: string | null;
          weight?: number;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          photos?: string[] | null;
          pickup_address?: string;
          pickup_city?: string;
          pickup_country?: string;
          delivery_address?: string;
          delivery_city?: string;
          delivery_country?: string;
          proposed_price?: number;
          currency?: string;
          pickup_date_from?: string | null;
          pickup_date_to?: string | null;
          delivery_date_by?: string | null;
          status?: 'PENDING_MATCH' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELED';
          is_urgent?: boolean;
          is_fragile?: boolean;
          requires_signature?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          traveler_id: string;
          title: string;
          description: string | null;
          departure_city: string;
          departure_country: string;
          arrival_city: string;
          arrival_country: string;
          departure_date: string;
          arrival_date: string;
          available_weight: number;
          available_volume: number | null;
          max_packages: number | null;
          price_per_kg: number | null;
          minimum_price: number | null;
          currency: string;
          status: 'AVAILABLE' | 'PARTIALLY_BOOKED' | 'FULLY_BOOKED' | 'COMPLETED' | 'CANCELED';
          is_recurring: boolean;
          recurring_pattern: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          traveler_id: string;
          title: string;
          description?: string | null;
          departure_city: string;
          departure_country: string;
          arrival_city: string;
          arrival_country: string;
          departure_date: string;
          arrival_date: string;
          available_weight: number;
          available_volume?: number | null;
          max_packages?: number | null;
          price_per_kg?: number | null;
          minimum_price?: number | null;
          currency?: string;
          status?: 'AVAILABLE' | 'PARTIALLY_BOOKED' | 'FULLY_BOOKED' | 'COMPLETED' | 'CANCELED';
          is_recurring?: boolean;
          recurring_pattern?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          traveler_id?: string;
          title?: string;
          description?: string | null;
          departure_city?: string;
          departure_country?: string;
          arrival_city?: string;
          arrival_country?: string;
          departure_date?: string;
          arrival_date?: string;
          available_weight?: number;
          available_volume?: number | null;
          max_packages?: number | null;
          price_per_kg?: number | null;
          minimum_price?: number | null;
          currency?: string;
          status?: 'AVAILABLE' | 'PARTIALLY_BOOKED' | 'FULLY_BOOKED' | 'COMPLETED' | 'CANCELED';
          is_recurring?: boolean;
          recurring_pattern?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          shipment_id: string;
          trip_id: string | null;
          sender_id: string;
          traveler_id: string;
          agreed_price: number;
          currency: string;
          platform_fee: number | null;
          security_code: string;
          status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DELIVERED' | 'DISPUTED' | 'CANCELED' | 'COMPLETED';
          payment_status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
          confirmed_at: string | null;
          picked_up_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shipment_id: string;
          trip_id?: string | null;
          sender_id: string;
          traveler_id: string;
          agreed_price: number;
          currency?: string;
          platform_fee?: number | null;
          security_code: string;
          status?: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DELIVERED' | 'DISPUTED' | 'CANCELED' | 'COMPLETED';
          payment_status?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
          confirmed_at?: string | null;
          picked_up_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shipment_id?: string;
          trip_id?: string | null;
          sender_id?: string;
          traveler_id?: string;
          agreed_price?: number;
          currency?: string;
          platform_fee?: number | null;
          security_code?: string;
          status?: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DELIVERED' | 'DISPUTED' | 'CANCELED' | 'COMPLETED';
          payment_status?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
          confirmed_at?: string | null;
          picked_up_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          shipment_id: string;
          sender_id: string;
          traveler_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shipment_id: string;
          sender_id: string;
          traveler_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          shipment_id?: string;
          sender_id?: string;
          traveler_id?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          transaction_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          type: 'SENDER_TO_TRAVELER' | 'TRAVELER_TO_SENDER' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          type?: 'SENDER_TO_TRAVELER' | 'TRAVELER_TO_SENDER' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          type?: 'SENDER_TO_TRAVELER' | 'TRAVELER_TO_SENDER' | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'NEW_MESSAGE' | 'OFFER_ACCEPTED' | 'SHIPMENT_COMPLETED' | 'NEW_MESSAGE' | 'OFFER_ACCEPTED';
          message: string;
          link_to: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'NEW_MESSAGE' | 'OFFER_ACCEPTED' | 'SHIPMENT_COMPLETED' | 'NEW_MESSAGE' | 'OFFER_ACCEPTED';
          message: string;
          link_to?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'NEW_MESSAGE' | 'OFFER_ACCEPTED' | 'SHIPMENT_COMPLETED' | 'NEW_MESSAGE' | 'OFFER_ACCEPTED';
          message?: string;
          link_to?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      stripe_customers: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      stripe_subscriptions: {
        Row: {
          id: string;
          customer_id: string;
          subscription_id: string | null;
          price_id: string | null;
          current_period_start: number | null;
          current_period_end: number | null;
          cancel_at_period_end: boolean;
          payment_method_brand: string | null;
          payment_method_last4: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          subscription_id?: string | null;
          price_id?: string | null;
          current_period_start?: number | null;
          current_period_end?: number | null;
          cancel_at_period_end?: boolean;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          status: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          subscription_id?: string | null;
          price_id?: string | null;
          current_period_start?: number | null;
          current_period_end?: number | null;
          cancel_at_period_end?: boolean;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
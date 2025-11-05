import { PrismaClient } from '@prisma/client';

/**
 * Service pour la gestion des paiements
 */
class PaymentService {
  /**
   * Obtenir les moyens de paiement de l'utilisateur
   */
  async getPaymentMethods(userId) {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        type: true,
        provider: true,
        accountNumber: true, // On masquera les données sensibles côté contrôleur
        accountName: true,
        isDefault: true,
        createdAt: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Masquer les numéros de compte (garder seulement les 4 derniers chiffres)
    return paymentMethods.map(method => ({
      ...method,
      accountNumber: this.maskAccountNumber(method.accountNumber)
    }));
  }

  /**
   * Ajouter un nouveau moyen de paiement
   */
  async addPaymentMethod(userId, paymentMethodData) {
    const {
      type,
      provider,
      accountNumber,
      accountName,
      isDefault = false
    } = paymentMethodData;

    // Vérifier si c'est le premier moyen de paiement (le rendre par défaut)
    const existingMethods = await prisma.paymentMethod.count({
      where: { userId, isActive: true }
    });

    const shouldBeDefault = isDefault || existingMethods === 0;

    // Si on définit comme défaut, désactiver les autres méthodes par défaut
    if (shouldBeDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // TODO: Chiffrer le numéro de compte avant de le stocker
    const encryptedAccountNumber = this.encryptAccountNumber(accountNumber);

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        type,
        provider,
        accountNumber: encryptedAccountNumber,
        accountName,
        isDefault: shouldBeDefault
      }
    });

    return {
      ...paymentMethod,
      accountNumber: this.maskAccountNumber(accountNumber)
    };
  }

  /**
   * Supprimer un moyen de paiement
   */
  async deletePaymentMethod(paymentMethodId, userId) {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });

    if (!paymentMethod) {
      throw new Error('Moyen de paiement non trouvé');
    }

    if (paymentMethod.userId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce moyen de paiement');
    }

    if (paymentMethod.isDefault) {
      // Vérifier s'il y a d'autres moyens de paiement
      const otherMethods = await prisma.paymentMethod.findMany({
        where: {
          userId,
          id: { not: paymentMethodId },
          isActive: true
        }
      });

      if (otherMethods.length > 0) {
        // Définir le premier autre moyen comme défaut
        await prisma.paymentMethod.update({
          where: { id: otherMethods[0].id },
          data: { isDefault: true }
        });
      }
    }

    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isActive: false }
    });

    return { success: true };
  }

  /**
   * Obtenir l'historique des paiements
   */
  async getPaymentHistory(userId, queryParams) {
    const { page = 1, limit = 20, type, status } = queryParams;
    const skip = (page - 1) * limit;

    const where = { userId };
    
    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          transaction: {
            select: {
              id: true,
              shipment: { select: { id: true, title: true } },
              trip: { select: { id: true, title: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    return { payments, total };
  }

  /**
   * Traiter un paiement
   */
  async processPayment(userId, paymentData) {
    const {
      transactionId,
      amount,
      method,
      paymentMethodId
    } = paymentData;

    // Vérifier la transaction si spécifiée
    let transaction = null;
    if (transactionId) {
      transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      if (transaction.senderId !== userId && transaction.travelerId !== userId) {
        throw new Error('Vous n\'êtes pas autorisé à effectuer ce paiement');
      }
    }

    // Vérifier le moyen de paiement si spécifié
    let paymentMethod = null;
    if (paymentMethodId) {
      paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId }
      });

      if (!paymentMethod || paymentMethod.userId !== userId) {
        throw new Error('Moyen de paiement non valide');
      }
    }

    // Créer l'enregistrement de paiement
    const payment = await prisma.payment.create({
      data: {
        userId,
        transactionId,
        amount,
        method,
        type: transactionId ? 'payment' : 'wallet_topup',
        status: 'PENDING',
        metadata: {
          paymentMethodId,
          processedAt: new Date()
        }
      }
    });

    // TODO: Intégrer avec un vrai prestataire de paiement (Stripe, PayPal, Mobile Money)
    // Pour l'instant, on simule un paiement réussi
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        externalId: `sim_${Date.now()}`
      }
    });

    // Si c'est un paiement pour une transaction, mettre à jour le statut
    if (transaction) {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { paymentStatus: 'PAID' }
      });
    }

    return updatedPayment;
  }

  /**
   * Traiter un remboursement
   */
  async processRefund(transactionId, userId, reason) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        payments: {
          where: { status: 'PAID' }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }

    if (transaction.senderId !== userId && transaction.travelerId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à demander ce remboursement');
    }

    const originalPayment = transaction.payments[0];
    if (!originalPayment) {
      throw new Error('Aucun paiement trouvé pour cette transaction');
    }

    // Créer l'enregistrement de remboursement
    const refund = await prisma.payment.create({
      data: {
        userId: originalPayment.userId,
        transactionId,
        amount: -originalPayment.amount, // Montant négatif pour le remboursement
        method: originalPayment.method,
        type: 'refund',
        status: 'PENDING',
        metadata: {
          originalPaymentId: originalPayment.id,
          reason,
          processedAt: new Date()
        }
      }
    });

    // TODO: Traiter le remboursement avec le prestataire de paiement
    // Pour l'instant, on simule un remboursement réussi
    const updatedRefund = await prisma.payment.update({
      where: { id: refund.id },
      data: {
        status: 'REFUNDED',
        externalId: `refund_${Date.now()}`
      }
    });

    // Mettre à jour le statut de la transaction
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: 'REFUNDED' }
    });

    return updatedRefund;
  }

  /**
   * Webhook pour les notifications de paiement
   */
  async handleWebhook(webhookData, headers) {
    // TODO: Vérifier la signature du webhook selon le prestataire
    
    const { eventType, paymentId, status, externalId } = webhookData;

    if (eventType === 'payment.succeeded') {
      await prisma.payment.updateMany({
        where: { externalId },
        data: { status: 'PAID' }
      });
    } else if (eventType === 'payment.failed') {
      await prisma.payment.updateMany({
        where: { externalId },
        data: { status: 'FAILED' }
      });
    }

    return { success: true };
  }

  /**
   * Masquer le numéro de compte (garder les 4 derniers chiffres)
   */
  maskAccountNumber(accountNumber) {
    if (!accountNumber || accountNumber.length <= 4) {
      return accountNumber;
    }
    
    const visiblePart = accountNumber.slice(-4);
    const maskedPart = '*'.repeat(accountNumber.length - 4);
    
    return maskedPart + visiblePart;
  }

  /**
   * Chiffrer le numéro de compte (simulation)
   */
  encryptAccountNumber(accountNumber) {
    // TODO: Implémenter un vrai chiffrement
    // Pour l'instant, on retourne tel quel
    return accountNumber;
  }

  /**
   * Déchiffrer le numéro de compte (simulation)
   */
  decryptAccountNumber(encryptedAccountNumber) {
    // TODO: Implémenter le déchiffrement correspondant
    return encryptedAccountNumber;
  }
}

export default new PaymentService();
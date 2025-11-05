const transactionService = require('../services/transaction.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des transactions
 */
class TransactionController {
  /**
   * Créer une nouvelle transaction (accord entre expéditeur et voyageur)
   */
  async createTransaction(req, res, next) {
    try {
      // TODO: Create new transaction
      // - Verify shipment and trip exist and are available
      // - Check capacity constraints
      // - Generate security code
      // - Create transaction
      // - Send notifications to both parties
      
      const transaction = await transactionService.createTransaction(req.user.id, req.body);
      return successResponse(res, transaction, 'Transaction created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir la liste des transactions
   */
  async getTransactions(req, res, next) {
    try {
      // TODO: Get paginated list of transactions (admin only)
      
      const { transactions, total } = await transactionService.getTransactions(req.query);
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total
      };
      
      return paginatedResponse(res, transactions, pagination, 'Transactions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les transactions de l'utilisateur connecté
   */
  async getMyTransactions(req, res, next) {
    try {
      // TODO: Get user's transactions (as sender or traveler)
      
      const transactions = await transactionService.getMyTransactions(req.user.id, req.query);
      return successResponse(res, transactions, 'My transactions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir une transaction par ID
   */
  async getTransactionById(req, res, next) {
    try {
      // TODO: Get transaction by ID
      // - Verify user is involved in transaction
      
      const transaction = await transactionService.getTransactionById(req.params.id, req.user.id);
      return successResponse(res, transaction, 'Transaction retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour le statut d'une transaction
   */
  async updateTransactionStatus(req, res, next) {
    try {
      // TODO: Update transaction status
      // - Verify user permissions
      // - Validate status transition
      // - Update status and related timestamps
      
      const transaction = await transactionService.updateTransactionStatus(req.params.id, req.user.id, req.body.status);
      return successResponse(res, transaction, 'Transaction status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirmer une transaction (voyageur accepte)
   */
  async confirmTransaction(req, res, next) {
    try {
      // TODO: Confirm transaction
      // - Verify user is the traveler
      // - Update status to CONFIRMED
      // - Set confirmedAt timestamp
      // - Send notification to sender
      
      const transaction = await transactionService.confirmTransaction(req.params.id, req.user.id);
      return successResponse(res, transaction, 'Transaction confirmed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirmer la récupération du colis
   */
  async confirmPickup(req, res, next) {
    try {
      // TODO: Confirm pickup
      // - Verify user is the traveler
      // - Update status to IN_PROGRESS
      // - Set pickedUpAt timestamp
      
      const transaction = await transactionService.confirmPickup(req.params.id, req.user.id);
      return successResponse(res, transaction, 'Pickup confirmed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirmer la livraison du colis
   */
  async confirmDelivery(req, res, next) {
    try {
      // TODO: Confirm delivery
      // - Verify security code
      // - Update status to DELIVERED
      // - Set deliveredAt timestamp
      // - Process payment
      
      const transaction = await transactionService.confirmDelivery(req.params.id, req.user.id, req.body.securityCode);
      return successResponse(res, transaction, 'Delivery confirmed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Créer un litige
   */
  async createDispute(req, res, next) {
    try {
      // TODO: Create dispute
      // - Update status to DISPUTED
      // - Create dispute record
      // - Send notifications to admin
      
      const dispute = await transactionService.createDispute(req.params.id, req.user.id, req.body.reason);
      return successResponse(res, dispute, 'Dispute created successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
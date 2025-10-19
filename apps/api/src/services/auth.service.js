const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

/**
 * Service pour l'authentification
 */
class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    const { email, password, firstName, lastName, role = 'BOTH' } = userData;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        isEmailVerified: true // Pour simplifier, on considère l'email comme vérifié
      }
    });

    // Générer le token JWT
    const token = this.generateToken(user.id);

    // Retourner les données sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Connexion utilisateur
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Générer le token JWT
    const token = this.generateToken(user.id);

    // Retourner les données sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(userId) {
    // Pour une implémentation simple, on peut juste invalider le token côté client
    // Dans une implémentation plus complexe, on pourrait maintenir une blacklist de tokens
    return { success: true };
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return { success: true };
    }

    // TODO: Implémenter l'envoi d'email avec token de réinitialisation
    // Pour l'instant, on simule juste le succès
    return { success: true };
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(resetData) {
    const { token, password } = resetData;
    
    // TODO: Vérifier le token de réinitialisation
    // Pour l'instant, on simule juste le succès
    throw new Error('Fonctionnalité non implémentée');
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const token = this.generateToken(user.id);
    
    return { token };
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePicture: true,
        role: true,
        status: true,
        isPhoneVerified: true,
        isEmailVerified: true,
        isIdentityVerified: true,
        city: true,
        country: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Générer un token JWT
   */
  generateToken(userId) {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET || 'default-secret-key', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  /**
   * Vérifier un token JWT
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
  }
}

module.exports = new AuthService();
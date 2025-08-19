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
    const { email, password, firstName, lastName, role } = userData;

    // - Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createError(409, 'An account with this email already exists.');
    }

    // - Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // - Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'BOTH', // Default role
      },
    });

    // - Generate JWT token
    const token = this.generateToken(user.id);

    // - Return user data and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Connexion utilisateur
   */
  async login(credentials) {
    const { email, password } = credentials;

    // - Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw createError(401, 'Invalid credentials. Please check your email and password.');
    }

    // - Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid credentials. Please check your email and password.');
    }

    // - Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // - Generate JWT token
    const token = this.generateToken(user.id);

    // - Return user data and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(userId) {
    // For now, this is a client-side responsibility (deleting the token).
    // For stateful invalidation, a token blacklist (e.g., in Redis) would be needed.
    return Promise.resolve();
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(email) {
    // This functionality is out of scope for the initial MVP implementation.
    throw createError(501, 'Forgot password functionality is not yet implemented.');
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(resetData) {
    // This functionality is out of scope for the initial MVP implementation.
    throw createError(501, 'Reset password functionality is not yet implemented.');
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(userId) {
    // This assumes the calling middleware has already verified the refresh token.
    const token = this.generateToken(userId);
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
        role: true,
        status: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw createError(404, 'User not found.');
    }
    return user;
  }

  /**
   * Générer un token JWT
   */
  generateToken(userId) {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw createError(500, 'JWT secret or expiration is not configured in environment variables.');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  }

  /**
   * Vérifier un token JWT
   */
  verifyToken(token) {
    if (!process.env.JWT_SECRET) {
        throw createError(500, 'JWT secret is not configured in environment variables.');
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createError(401, 'Invalid or expired token.');
    }
  }
}

module.exports = new AuthService();
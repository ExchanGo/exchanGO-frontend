import { exchangeService } from '../services/exchangeService';

/**
 * Token Management Utility
 * Use this to manage API authentication tokens
 */
export class TokenManager {
  /**
   * Update the API tokens with fresh ones
   * Call this method when you get new tokens from the authentication flow
   */
  static updateTokens(accessToken: string, refreshToken: string, tokenExpires: number): void {
    exchangeService.updateTokens(accessToken, refreshToken, tokenExpires);
    console.log('✅ API tokens updated successfully');
  }

  /**
   * Check if the current access token is expired or will expire soon
   */
  static isAccessTokenExpired(): boolean {
    return exchangeService.isAccessTokenExpired();
  }

  /**
   * Manually refresh the access token
   */
  static async refreshAccessToken(): Promise<void> {
    try {
      await exchangeService.refreshAccessToken();
      console.log('✅ Access token refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh access token:', error);
      throw error;
    }
  }

  /**
   * Get current tokens info (for debugging)
   */
  static getTokensInfo(): { accessToken: string; refreshToken: string; expiresAt: Date; isExpired: boolean } {
    return exchangeService.getTokensInfo();
  }

  /**
   * Get token expiration info in a readable format
   */
  static getTokenExpirationInfo(): { isExpired: boolean; expiresAt: Date; timeLeft: string } {
    const info = exchangeService.getTokensInfo();
    const now = Date.now();
    const timeLeftMs = info.expiresAt.getTime() - now;
    
    let timeLeft: string;
    if (timeLeftMs <= 0) {
      timeLeft = 'Expired';
    } else {
      const minutes = Math.floor(timeLeftMs / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        timeLeft = `${days} day(s)`;
      } else if (hours > 0) {
        timeLeft = `${hours} hour(s)`;
      } else {
        timeLeft = `${minutes} minute(s)`;
      }
    }

    return {
      isExpired: info.isExpired,
      expiresAt: info.expiresAt,
      timeLeft
    };
  }
}

// For easy access in browser console during development
if (typeof window !== 'undefined') {
  (window as any).TokenManager = TokenManager;
} 
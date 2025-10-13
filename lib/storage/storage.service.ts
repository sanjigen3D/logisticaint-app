import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Servicio de almacenamiento que maneja tanto web como móvil
 * - Web: Usa localStorage
 * - Móvil: Usa SecureStore para datos sensibles y AsyncStorage para otros datos
 */
class StorageService {
  private isWeb = Platform.OS === 'web';

  /**
   * Almacena un valor de forma segura
   * @param key - Clave del valor a almacenar
   * @param value - Valor a almacenar
   * @param secure - Si es true, usa almacenamiento seguro (solo móvil)
   */
  async setItem(key: string, value: string, secure: boolean = false): Promise<void> {
    try {
      if (this.isWeb) {
        // En web, siempre usa localStorage
        localStorage.setItem(key, value);
      } else {
        // En móvil, usa SecureStore para datos sensibles, AsyncStorage para otros
        if (secure) {
          await SecureStore.setItemAsync(key, value);
        } else {
          await AsyncStorage.setItem(key, value);
        }
      }
    } catch (error) {
      console.error(`Error al guardar ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un valor almacenado
   * @param key - Clave del valor a obtener
   * @param secure - Si es true, busca en almacenamiento seguro (solo móvil)
   */
  async getItem(key: string, secure: boolean = false): Promise<string | null> {
    try {
      if (this.isWeb) {
        // En web, siempre usa localStorage
        return localStorage.getItem(key);
      } else {
        // En móvil, usa SecureStore para datos sensibles, AsyncStorage para otros
        if (secure) {
          return await SecureStore.getItemAsync(key);
        } else {
          return await AsyncStorage.getItem(key);
        }
      }
    } catch (error) {
      console.error(`Error al obtener ${key}:`, error);
      return null;
    }
  }

  /**
   * Elimina un valor almacenado
   * @param key - Clave del valor a eliminar
   * @param secure - Si es true, elimina de almacenamiento seguro (solo móvil)
   */
  async removeItem(key: string, secure: boolean = false): Promise<void> {
    try {
      if (this.isWeb) {
        // En web, siempre usa localStorage
        localStorage.removeItem(key);
      } else {
        // En móvil, usa SecureStore para datos sensibles, AsyncStorage para otros
        if (secure) {
          await SecureStore.deleteItemAsync(key);
        } else {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`Error al eliminar ${key}:`, error);
      throw error;
    }
  }

  /**
   * Limpia todo el almacenamiento
   */
  async clear(): Promise<void> {
    try {
      if (this.isWeb) {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
        // SecureStore no tiene método clear, así que eliminamos las claves conocidas
        await this.removeItem('auth_token', true);
        await this.removeItem('user_data', true);
      }
    } catch (error) {
      console.error('Error al limpiar almacenamiento:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const storageService = new StorageService();

// Claves constantes para el almacenamiento
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const;

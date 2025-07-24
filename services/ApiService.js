// services/ApiService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = __DEV__
  ? "http://10.0.2.2:8000/api/v1" // Android Emulator
  : "https://your-production-url.com/api/v1";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  async init() {
    // Load token from storage on app start
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      this.setToken(token);
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      AsyncStorage.setItem("auth_token", token);
    } else {
      AsyncStorage.removeItem("auth_token");
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Token ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Handle FormData for file uploads
    if (options.body instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log(`API Request: ${options.method || "GET"} ${url}`);
      const response = await fetch(url, config);

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { message: response.statusText };
      }

      if (!response.ok) {
        throw new Error(data.message || data.detail || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);

      // Handle token expiration
      if (error.message?.includes("token") || error.message?.includes("auth")) {
        this.setToken(null);
      }

      throw error;
    }
  }

  // Authentication
  async register(userData) {
    const response = await this.request("/auth/register/", {
      method: "POST",
      body: userData,
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(email, password) {
    const response = await this.request("/auth/login/", {
      method: "POST",
      body: { email, password },
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout/", { method: "POST" });
    } catch (error) {
      console.log("Logout error:", error);
    }

    this.setToken(null);
    return { message: "Logged out successfully" };
  }

  async getProfile() {
    return this.request("/auth/profile/");
  }

  async updateProfile(userData) {
    return this.request("/auth/profile/", {
      method: "PUT",
      body: userData,
    });
  }

  async changePassword(passwordData) {
    return this.request("/auth/change-password/", {
      method: "POST",
      body: passwordData,
    });
  }

  // Waste Management
  async getWasteCategories() {
    return this.request("/waste/categories/");
  }

  async getWasteItems(categoryId = null) {
    const query = categoryId ? `?category=${categoryId}` : "";
    return this.request(`/waste/items/${query}`);
  }

  async getScannedWaste(page = 1) {
    return this.request(`/waste/scans/?page=${page}`);
  }

  async createWasteScan(scanData) {
    // Handle image upload
    if (scanData.image) {
      const formData = new FormData();
      formData.append("image_path", {
        uri: scanData.image.uri,
        type: scanData.image.type || "image/jpeg",
        name: scanData.image.fileName || "waste_image.jpg",
      });

      Object.keys(scanData).forEach((key) => {
        if (key !== "image") {
          formData.append(key, scanData[key]);
        }
      });

      return this.request("/waste/scans/", {
        method: "POST",
        body: formData,
      });
    }

    return this.request("/waste/scans/", {
      method: "POST",
      body: scanData,
    });
  }

  async updateWasteScan(scanId, scanData) {
    return this.request(`/waste/scans/${scanId}/`, {
      method: "PUT",
      body: scanData,
    });
  }

  async deleteWasteScan(scanId) {
    return this.request(`/waste/scans/${scanId}/`, {
      method: "DELETE",
    });
  }

  async getUserStats() {
    return this.request("/waste/stats/");
  }

  async getDashboardData() {
    return this.request("/waste/dashboard/");
  }

  // Notifications
  async getNotifications() {
    return this.request("/notifications/");
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read/`, {
      method: "POST",
    });
  }

  async markAllNotificationsAsRead() {
    return this.request("/notifications/read-all/", {
      method: "POST",
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getAuthToken() {
    return this.token;
  }
}

export default new ApiService();

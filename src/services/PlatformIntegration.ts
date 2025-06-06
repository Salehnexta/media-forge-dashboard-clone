
export interface Platform {
  id: string;
  name: string;
  type: 'social_media' | 'ecommerce' | 'analytics' | 'advertising';
  description: string;
  logo: string;
  supported_features: string[];
  setup_difficulty: 'easy' | 'medium' | 'hard';
  is_connected?: boolean;
  connection_status?: 'active' | 'inactive' | 'error';
}

export interface PlatformConnectionResult {
  success: boolean;
  message: string;
  platform_id: string;
  access_token?: string;
}

export class PlatformIntegration {
  private apiUrl: string;
  private connectedPlatforms: Map<string, Platform> = new Map();

  constructor(apiUrl: string = 'https://crewai-production-d99a.up.railway.app') {
    this.apiUrl = apiUrl;
  }

  async getAvailablePlatforms(): Promise<{ platforms: Platform[] } | null> {
    try {
      console.log('🔍 Fetching available platforms from:', `${this.apiUrl}/api/v2/platforms/available`);
      const response = await fetch(`${this.apiUrl}/api/v2/platforms/available`);
      
      if (!response.ok) {
        // Return mock data if API is not available
        return this.getMockPlatforms();
      }
      
      const data = await response.json();
      console.log('✅ Platforms data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching platforms:', error);
      // Return mock data for development
      return this.getMockPlatforms();
    }
  }

  private getMockPlatforms(): { platforms: Platform[] } {
    return {
      platforms: [
        {
          id: 'instagram',
          name: 'Instagram',
          type: 'social_media',
          description: 'Connect your Instagram business account for comprehensive social media marketing',
          logo: '/api/placeholder/48/48',
          supported_features: ['Post Analytics', 'Story Metrics', 'Audience Insights', 'Content Planning'],
          setup_difficulty: 'easy'
        },
        {
          id: 'facebook',
          name: 'Facebook',
          type: 'social_media', 
          description: 'Integrate Facebook Pages and Ads for complete social media management',
          logo: '/api/placeholder/48/48',
          supported_features: ['Page Analytics', 'Ad Performance', 'Audience Data', 'Campaign Management'],
          setup_difficulty: 'easy'
        },
        {
          id: 'shopify',
          name: 'Shopify',
          type: 'ecommerce',
          description: 'Connect your Shopify store for sales analytics and marketing automation',
          logo: '/api/placeholder/48/48',
          supported_features: ['Sales Analytics', 'Product Performance', 'Customer Insights', 'Inventory Tracking'],
          setup_difficulty: 'medium'
        },
        {
          id: 'woocommerce',
          name: 'WooCommerce',
          type: 'ecommerce',
          description: 'Integrate your WooCommerce store for comprehensive e-commerce analytics',
          logo: '/api/placeholder/48/48',
          supported_features: ['Order Tracking', 'Customer Analytics', 'Product Metrics', 'Revenue Reports'],
          setup_difficulty: 'medium'
        },
        {
          id: 'google_analytics',
          name: 'Google Analytics',
          type: 'analytics',
          description: 'Connect Google Analytics for detailed website performance tracking',
          logo: '/api/placeholder/48/48',
          supported_features: ['Traffic Analysis', 'Conversion Tracking', 'Audience Segmentation', 'Goal Monitoring'],
          setup_difficulty: 'hard'
        },
        {
          id: 'google_ads',
          name: 'Google Ads',
          type: 'advertising',
          description: 'Integrate Google Ads for campaign performance and optimization insights',
          logo: '/api/placeholder/48/48',
          supported_features: ['Campaign Analytics', 'Keyword Performance', 'Ad Optimization', 'Budget Management'],
          setup_difficulty: 'hard'
        }
      ]
    };
  }

  async connectPlatform(platformId: string): Promise<PlatformConnectionResult> {
    try {
      console.log('🔗 Attempting to connect platform:', platformId);
      
      // Mock connection for development
      const mockResult: PlatformConnectionResult = {
        success: true,
        message: `تم ربط ${platformId} بنجاح!`,
        platform_id: platformId,
        access_token: `mock_token_${platformId}_${Date.now()}`
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update connected platforms
      const platforms = await this.getAvailablePlatforms();
      const platform = platforms?.platforms.find(p => p.id === platformId);
      
      if (platform) {
        platform.is_connected = true;
        platform.connection_status = 'active';
        this.connectedPlatforms.set(platformId, platform);
      }
      
      console.log('✅ Platform connected:', mockResult);
      return mockResult;
    } catch (error) {
      console.error('❌ Error connecting platform:', error);
      return {
        success: false,
        message: `فشل في ربط ${platformId}`,
        platform_id: platformId
      };
    }
  }

  async disconnectPlatform(platformId: string): Promise<boolean> {
    try {
      console.log('🔌 Disconnecting platform:', platformId);
      
      // Remove from connected platforms
      this.connectedPlatforms.delete(platformId);
      
      console.log('✅ Platform disconnected:', platformId);
      return true;
    } catch (error) {
      console.error('❌ Error disconnecting platform:', error);
      return false;
    }
  }

  getConnectedPlatforms(): Platform[] {
    return Array.from(this.connectedPlatforms.values());
  }

  isPlatformConnected(platformId: string): boolean {
    return this.connectedPlatforms.has(platformId);
  }

  getConnectionStatus(platformId: string): string {
    const platform = this.connectedPlatforms.get(platformId);
    return platform?.connection_status || 'inactive';
  }
}

// Export singleton instance
export const platformIntegration = new PlatformIntegration();

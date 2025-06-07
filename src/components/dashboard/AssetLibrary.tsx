
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List,
  Image as ImageIcon, 
  Video, 
  FileText, 
  Download,
  Share,
  Trash2,
  Edit,
  Eye,
  Calendar,
  User,
  Tag,
  Folder,
  Plus
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  size: string;
  dimensions?: string;
  uploadDate: Date;
  tags: string[];
  category: string;
  usage: number;
  uploadedBy: string;
}

const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'شعار الشركة الرئيسي',
    type: 'image',
    url: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    size: '45 KB',
    dimensions: '512x512',
    uploadDate: new Date('2024-01-15'),
    tags: ['شعار', 'هوية بصرية', 'رسمي'],
    category: 'هوية العلامة التجارية',
    usage: 12,
    uploadedBy: 'أحمد محمد'
  },
  {
    id: '2',
    name: 'فيديو تعريفي للمنتج',
    type: 'video',
    url: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    size: '25.4 MB',
    dimensions: '1920x1080',
    uploadDate: new Date('2024-01-10'),
    tags: ['فيديو', 'تسويق', 'منتج'],
    category: 'مقاطع فيديو',
    usage: 8,
    uploadedBy: 'ليلى أحمد'
  },
  {
    id: '3',
    name: 'دليل العلامة التجارية',
    type: 'document',
    url: '/placeholder.svg',
    size: '2.1 MB',
    uploadDate: new Date('2024-01-08'),
    tags: ['دليل', 'إرشادات', 'هوية'],
    category: 'مستندات',
    usage: 15,
    uploadedBy: 'سارة علي'
  },
  {
    id: '4',
    name: 'صور المنتجات - مجموعة الصيف',
    type: 'image',
    url: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    size: '1.8 MB',
    dimensions: '1200x800',
    uploadDate: new Date('2024-01-05'),
    tags: ['منتجات', 'صيف', 'كتالوج'],
    category: 'صور المنتجات',
    usage: 6,
    uploadedBy: 'خالد حسن'
  },
  {
    id: '5',
    name: 'موسيقى خلفية للإعلانات',
    type: 'audio',
    url: '/placeholder.svg',
    size: '3.2 MB',
    uploadDate: new Date('2024-01-03'),
    tags: ['موسيقى', 'خلفية', 'إعلان'],
    category: 'ملفات صوتية',
    usage: 4,
    uploadedBy: 'نور فاروق'
  },
  {
    id: '6',
    name: 'قالب العروض التقديمية',
    type: 'document',
    url: '/placeholder.svg',
    size: '890 KB',
    uploadDate: new Date('2024-01-01'),
    tags: ['قالب', 'عرض', 'تقديمي'],
    category: 'قوالب',
    usage: 9,
    uploadedBy: 'محمد عبدالله'
  }
];

const categories = [
  'الكل',
  'هوية العلامة التجارية',
  'صور المنتجات',
  'مقاطع فيديو',
  'مستندات',
  'قوالب',
  'ملفات صوتية'
];

export const AssetLibrary = () => {
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'الكل' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'audio': return <span className="w-4 h-4">🎵</span>;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500';
      case 'video': return 'bg-purple-500';
      case 'document': return 'bg-green-500';
      case 'audio': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const stats = {
    total: assets.length,
    images: assets.filter(a => a.type === 'image').length,
    videos: assets.filter(a => a.type === 'video').length,
    documents: assets.filter(a => a.type === 'document').length,
    audio: assets.filter(a => a.type === 'audio').length,
    totalSize: assets.reduce((sum, asset) => {
      const size = parseFloat(asset.size.split(' ')[0]);
      const unit = asset.size.split(' ')[1];
      return sum + (unit === 'MB' ? size : size / 1024);
    }, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">مكتبة الأصول</h2>
          <p className="text-gray-600 mt-1">إدارة وتنظيم جميع ملفاتك الرقمية</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          رفع ملف
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">إجمالي الملفات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.images}</p>
            <p className="text-sm text-gray-600">صور</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.videos}</p>
            <p className="text-sm text-gray-600">فيديوهات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.documents}</p>
            <p className="text-sm text-gray-600">مستندات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.audio}</p>
            <p className="text-sm text-gray-600">ملفات صوتية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.totalSize.toFixed(1)}</p>
            <p className="text-sm text-gray-600">MB مستخدم</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في الملفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Selected Actions */}
      {selectedAssets.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            تم تحديد {selectedAssets.length} ملف
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="w-3 h-3" />
              تحميل
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Share className="w-3 h-3" />
              مشاركة
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
              <Trash2 className="w-3 h-3" />
              حذف
            </Button>
          </div>
        </div>
      )}

      {/* Assets Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card 
              key={asset.id} 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                selectedAssets.includes(asset.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleAssetSelect(asset.id)}
            >
              <CardContent className="p-4">
                {/* Preview */}
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {asset.type === 'image' && asset.thumbnail ? (
                    <img 
                      src={asset.thumbnail} 
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`p-4 rounded-full ${getTypeColor(asset.type)} text-white`}>
                      {getTypeIcon(asset.type)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {asset.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{asset.size}</span>
                    {asset.dimensions && (
                      <>
                        <span>•</span>
                        <span>{asset.dimensions}</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{asset.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>استخدم {asset.usage} مرة</span>
                    <span>{asset.uploadDate.toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-3 pt-3 border-t">
                  <Button size="sm" variant="ghost" className="flex-1 gap-1">
                    <Eye className="w-3 h-3" />
                    عرض
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 gap-1">
                    <Download className="w-3 h-3" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedAssets.includes(asset.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleAssetSelect(asset.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {asset.type === 'image' && asset.thumbnail ? (
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className={`p-2 rounded ${getTypeColor(asset.type)} text-white`}>
                          {getTypeIcon(asset.type)}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{asset.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{asset.size}</span>
                        {asset.dimensions && <span>{asset.dimensions}</span>}
                        <span>بواسطة {asset.uploadedBy}</span>
                        <span>{asset.uploadDate.toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">استخدم {asset.usage} مرة</span>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد ملفات</h3>
          <p className="text-gray-600 mb-4">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            رفع ملف جديد
          </Button>
        </div>
      )}
    </div>
  );
};

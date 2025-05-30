
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, TrendingUp, TrendingDown } from "lucide-react";

const platforms = [
  {
    name: "إنستغرام",
    followers: "25.4k",
    engagement: "8.2%",
    trend: "up",
    change: "+12%",
    color: "from-pink-500 to-purple-600"
  },
  {
    name: "فيسبوك",
    followers: "18.7k",
    engagement: "5.8%",
    trend: "up",
    change: "+5%",
    color: "from-blue-600 to-blue-700"
  },
  {
    name: "تويتر",
    followers: "12.3k",
    engagement: "4.1%",
    trend: "down",
    change: "-2%",
    color: "from-blue-400 to-blue-500"
  },
  {
    name: "لينكد إن",
    followers: "8.9k",
    engagement: "6.5%",
    trend: "up",
    change: "+18%",
    color: "from-blue-700 to-blue-800"
  },
  {
    name: "تيك توك",
    followers: "15.2k",
    engagement: "12.4%",
    trend: "up",
    change: "+25%",
    color: "from-black to-gray-800"
  },
  {
    name: "يوتيوب",
    followers: "6.8k",
    engagement: "7.3%",
    trend: "up",
    change: "+8%",
    color: "from-red-600 to-red-700"
  }
];

export const SocialPlatforms = () => {
  return (
    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          منصات التواصل الاجتماعي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, index) => (
            <div key={index} className="p-4 bg-white/30 rounded-lg border border-white/20 hover:bg-white/40 transition-all">
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${platform.color} mb-3`}></div>
              <h4 className="font-semibold text-gray-800">{platform.name}</h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المتابعون:</span>
                  <span className="font-semibold">{platform.followers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">التفاعل:</span>
                  <span className="font-semibold">{platform.engagement}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">التغيير:</span>
                  <span className={`flex items-center gap-1 font-semibold ${
                    platform.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {platform.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {platform.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

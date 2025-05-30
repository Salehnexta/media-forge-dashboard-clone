
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, MessageSquare } from "lucide-react";

const topPosts = [
  {
    title: "نصائح التسويق الرقمي لعام 2024",
    views: "12.5k",
    likes: "892",
    comments: "156",
    trend: "+15%"
  },
  {
    title: "كيفية زيادة المبيعات عبر وسائل التواصل",
    views: "9.8k",
    likes: "674",
    comments: "89",
    trend: "+8%"
  },
  {
    title: "استراتيجيات المحتوى الفعال",
    views: "8.2k",
    likes: "523",
    comments: "67",
    trend: "+12%"
  }
];

export const ContentPerformance = () => {
  return (
    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          أداء المحتوى
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={index} className="p-4 bg-white/30 rounded-lg border border-white/20">
              <h4 className="font-semibold text-gray-800 mb-2">{post.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
                <span className="text-green-600 font-semibold">{post.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ageData = [
  { name: "18-24", value: 25, color: "#3b82f6" },
  { name: "25-34", value: 35, color: "#10b981" },
  { name: "35-44", value: 25, color: "#f59e0b" },
  { name: "45+", value: 15, color: "#8b5cf6" }
];

const genderData = [
  { name: "ذكور", value: 45, color: "#3b82f6" },
  { name: "إناث", value: 55, color: "#ec4899" }
];

export const AudienceDemographics = () => {
  return (
    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          ديموغرافية الجمهور
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-center">توزيع الأعمار</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-center">توزيع الجنس</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

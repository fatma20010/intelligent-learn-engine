
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, Video, Search } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    { label: "Total Courses", value: 12, icon: Book, color: "from-blue-500 to-cyan-500" },
    { label: "Hours Created", value: 48, icon: Clock, color: "from-purple-500 to-pink-500" },
    { label: "AI Generations", value: 156, icon: Video, color: "from-green-500 to-teal-500" },
    { label: "Active Learners", value: 2341, icon: Search, color: "from-orange-500 to-red-500" }
  ];

  const recentCourses = [
    {
      title: "Blockchain Fundamentals",
      progress: 85,
      duration: "2.5 hours",
      status: "ready",
      type: "Video content"
    },
    {
      title: "Crypto Investing 101",
      progress: 100,
      duration: "3.2 hours",
      status: "Ready",
      type: "Video Content"
    },
    {
      title: "DeFi & The Future of Finance",
      progress: 60,
      duration: "1.8 hours",
      status: "Ready",
      type: "Text Content"
    }
  ];

  return (
    <div className="space-y-6 mt-4 px-2 sm:mt-6 sm:px-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      {/* Recent Activity */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Course Activity</CardTitle>
          <CardDescription className="text-gray-300">
            Track your AI-generated course progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{course.title}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {course.type}
                    </Badge>
                    <span className="text-sm text-gray-400">{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Progress</p>
                    <Progress value={course.progress} className="w-24 mt-1" />
                  </div>
                  <Badge 
                    className={
                      course.status.toLowerCase() === 'ready'
                        ? 'bg-green-500 text-white' 
                        : course.status === 'Processing' 
                        ? 'bg-blue-500 text-white'
                        : 'bg-orange-500 text-white'
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

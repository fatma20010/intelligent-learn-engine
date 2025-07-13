import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, Clock, Book } from "lucide-react";
import { Link } from "react-router-dom";

export const CourseGrid = () => {
  const courses = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      description: "Understand the basics of blockchain technology, its structure, and real-world applications.",
      duration: "2.5 hours",
      modules: 8,
      progress: 85,
      thumbnail: "https://www.supplychaininfo.eu/wp-content/uploads/2019/01/blockchain-mooc.jpg", // Blockchain network visual
      tags: ["Blockchain", "Beginner", "Technology"],
      avatar: "Dr. Alice Nakamoto",
      status: "Ready",
    },
    {
      id: 2,
      title: "Crypto Investing 101",
      description: "Learn how to invest in cryptocurrencies safely and effectively, including wallets and exchanges.",
      duration: "3.0 hours",
      modules: 10,
      progress: 60,
      thumbnail: "https://variety.com/wp-content/uploads/2021/12/Bitcoin-Cryptocurrency-Placeholder.jpg?w=1000&h=563&crop=1", // Crypto coins
      tags: ["Crypto", "Investing", "Security"],
      avatar: "Peter Smith",
      status: "Ready",
    },
    {
      id: 3,
      title: "Gold Investment Strategies",
      description: "Explore the fundamentals and advanced strategies for investing in gold as a precious metal.",
      duration: "2.2 hours",
      modules: 7,
      progress: 40,
      thumbnail: "https://s44696.pcdn.co/wp-content/uploads/2025/04/Gold-outperformance-April-2025.jpg", // Gold bars
      tags: ["Gold", "Metals", "Wealth"],
      avatar: "Ms. Aurelia Goldsmith",
      status: "Ready",
    },
    {
      id: 4,
      title: "Silver Markets & Analysis",
      description: "Dive into the silver market, price drivers, and how to analyze silver as an investment.",
      duration: "1.8 hours",
      modules: 6,
      progress: 20,
      thumbnail: "https://mtr-cdn.com/images/Silver.width-648.jpg", // Silver coins
      tags: ["Silver", "Markets", "Analysis"],
      avatar: "Dr. Sterling Argent",
      status: "Ready",
    },
    {
      id: 5,
      title: "DeFi & The Future of Finance",
      description: "Discover decentralized finance (DeFi), smart contracts, and the future of financial systems.",
      duration: "2.7 hours",
      modules: 9,
      progress: 0,
      thumbnail: "https://www.brookings.edu/wp-content/uploads/2023/05/shutterstock_2002007354.jpg?quality=75&w=1500", // DeFi app visual
      tags: ["DeFi", "Smart Contracts", "Crypto"],
      avatar: "Prof. Vitalik Hayes",
      status: "Ready",
    },
    {
      id: 6,
      title: "Portfolio Diversification with Metals & Crypto",
      description: "Learn how to build a resilient investment portfolio using both precious metals and cryptocurrencies.",
      duration: "3.5 hours",
      modules: 12,
      progress: 10,
      thumbnail: "https://simpleswap.io/learn/_next/image?url=https%3A%2F%2Fweblearn-api.simpleswap.io%2Flearn-web-media%2Flearn-web-media%2FWeb_icon_05e86d9ef6.png&w=3840&q=100", // Portfolio visual
      tags: ["Portfolio", "Diversification", "Wealth"],
      avatar: "Dr. Morgan Silverstone",
      status: "Ready",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Courses</h2>
          <p className="text-gray-300 mt-2">AI-enhanced learning experiences</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                {course.status === 'Ready' ? (
                  <Badge className="bg-green-500 text-white">{course.status}</Badge>
                ) : (
                <Badge 
                  className={
                      course.status === 'Processing'
                      ? 'bg-blue-500 text-white'
                      : 'bg-orange-500 text-white'
                  }
                >
                  {course.status}
                </Badge>
                )}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-white">{course.title}</CardTitle>
              <CardDescription className="text-gray-300">
                {course.description}
              </CardDescription>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Book className="w-4 h-4" />
                  <span>{course.modules} modules</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-300 border-gray-600 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{course.avatar}</span>
                  </div>
                  {course.status === 'Ready' ? (
                    <Link to={`/course/${course.id}`}>
                      <Button size="sm">Continue</Button>
                    </Link>
                  ) : (
                    <Button size="sm" disabled>
                      Generating...
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

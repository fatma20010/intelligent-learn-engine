import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Video, Image, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ContentUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [processingType, setProcessingType] = useState("");
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-400" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-5 h-5 text-blue-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-5 h-5 text-green-400" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Course Creation Started",
      description: "Your AI-powered course is being generated. This may take a few minutes.",
    });
  };

  // Find the first PDF file as the main course document
  const mainPdf = uploadedFiles.find(f => f.name.toLowerCase().endsWith('.pdf'));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Create AI-Powered Course</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Upload your educational content and let our AI transform it into an engaging, 
          interactive course with photorealistic avatars and immersive environments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Upload Content</CardTitle>
            <CardDescription className="text-gray-300">
              Upload PDFs, videos, images, or text files to create your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, MP4, AVI, JPG, PNG, TXT files
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf,.mp4,.avi,.mov,.jpg,.jpeg,.png,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button type="button" variant="outline" className="cursor-pointer">
                  Select Files
                </Button>
              </Label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-white font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${file === mainPdf ? 'bg-blue-900/40 border border-blue-400' : 'bg-white/5'}`}>
                    {getFileIcon(file.name)}
                    <span className="text-gray-300 flex-1">{file.name}</span>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                    {file === mainPdf && (
                      <span className="ml-2 text-xs text-blue-400 font-semibold">Main PDF</span>
                    )}
                  </div>
                ))}
                {mainPdf && (
                  <div className="text-xs text-blue-300 mt-2">The first PDF uploaded will be used for AI summarization and video script generation.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Course Details</CardTitle>
            <CardDescription className="text-gray-300">
              Provide information about your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="course-title" className="text-white">Course Title</Label>
              <Input
                id="course-title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Enter course title"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="course-description" className="text-white">Description</Label>
              <Textarea
                id="course-description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Describe your course content and learning objectives"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">AI Configuration</CardTitle>
            <CardDescription className="text-gray-300">
              Customize your AI-powered course experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="avatar-select" className="text-white">Avatar Presenter</Label>
              <Select onValueChange={setSelectedAvatar}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Choose an AI avatar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Dr. Sarah Chen - Tech Expert</SelectItem>
                  <SelectItem value="james">Prof. James Wilson - Physicist</SelectItem>
                  <SelectItem value="maria">Dr. Maria Rodriguez - Historian</SelectItem>
                  <SelectItem value="david">David Kim - Data Scientist</SelectItem>
                  <SelectItem value="custom">Upload Custom Avatar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="processing-type" className="text-white">Processing Type</Label>
              <Select onValueChange={setProcessingType}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select processing approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Processing</SelectItem>
                  <SelectItem value="enhanced">Enhanced with 3D Environments</SelectItem>
                  <SelectItem value="immersive">Full Immersive Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Processing Estimate */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 text-gray-300">
              <Clock className="w-5 h-5" />
              <div>
                <p className="font-medium">Estimated Processing Time</p>
                <p className="text-sm text-gray-400">
                  {uploadedFiles.length > 0 
                    ? `${Math.ceil(uploadedFiles.length * 2.5)} - ${Math.ceil(uploadedFiles.length * 4)} minutes`
                    : "Upload files to see estimate"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
            disabled={uploadedFiles.length === 0 || !courseTitle}
          >
            Generate AI Course
          </Button>
        </div>
      </form>
    </div>
  );
};

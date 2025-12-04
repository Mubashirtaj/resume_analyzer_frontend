"use client";

import React, { useState } from "react";
import { Upload, Search, Briefcase, MapPin, DollarSign, Clock, Building2, ExternalLink, Moon, Sun, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

interface Job {
  title: string;
  company: string;
  location: string;
  link: string;
  posted: string;
  type: string;
  salary: string;
  experience: string;
  highlights: string[];
  description: string;
  source: string;
}

interface JobSearchData {
  count: number;
  jobs: Job[];
}

export default function JobFinderPage() {
  const [isDark, setIsDark] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [country, setCountry] = useState("");
  const [page, setPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<JobSearchData | null>(null);


  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // Handle form submission
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!cvFile) {
    alert("Please upload your CV");
    return;
  }

  if (!country) {
    alert("Please enter a country");
    return;
  }

  setIsLoading(true);

  try {
    if (!page) {
        return null
    }
    const formData = new FormData();
    formData.append("resume", cvFile);
    formData.append("country", country);
    formData.append("page", page.toString());

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/jobs`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data: JobSearchData = response.data;
    setJobData(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    alert("Failed to fetch jobs. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={`dark:bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-colors duration-300 ${isDark ? "dark" : ""} overflow-y-auto h-[calc(100vh-0px)]`}>
      {/* Theme Toggle */}
 

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Briefcase className="w-12 h-12 text-indigo-600 dark:text-indigo-600" />
            AI Job Finder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Upload your CV and discover jobs tailored to your skills
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-12 shadow-2xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Find Your Dream Job</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Upload your CV, select country, and let AI find the best matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CV Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Upload Your CV *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="cvUpload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cvUpload"
                    className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <div className="text-center">
                      {cvFile ? (
                        <>
                          <FileText className="w-12 h-12 mx-auto mb-3 text-indigo-600 dark:text-indigo-600" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {cvFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Click to change file
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PDF, DOC, DOCX (MAX. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Country and Page */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Country *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="e.g., United States, Pakistan, UK"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Jobs Number
                  </label>
                  <Input
                    type="number"
                    min="10"
                    placeholder="10"
                    value={page || ""}
                    onChange={(e) => setPage(parseInt(e.target.value) || 10)}
                    className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Searching Jobs...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Find Jobs
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Job Results */}
        {jobData && jobData.jobs.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Found {jobData.count} Jobs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Best matches for your profile in {country}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {jobData.jobs.map((job, index) => (
                <Card
                  key={index}
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 dark:text-white">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {job.type}
                          </Badge>
                          {job.salary !== "Not specified" && (
                            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {job.salary}
                            </Badge>
                          )}
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            Posted: {job.posted}
                          </Badge>
                        </div>
                      </div>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4"
                      >
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Key Highlights */}
                    {job.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Key Requirements:
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {job.highlights.slice(0, 6).map((highlight, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                            >
                              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                        {job.highlights.length > 6 && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            +{job.highlights.length - 6} more requirements
                          </p>
                        )}
                      </div>
                    )}

                    {/* Description Preview */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {job.description}
                      </p>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                      >
                        Read full description →
                      </a>
                    </div>

                    {/* Source */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Source: {job.source}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {jobData && jobData.jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or upload a different CV
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
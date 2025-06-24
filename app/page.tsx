"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Upload, Download, Zap, Bot, CheckCircle, Loader2, FileCode, FolderOpen, GitBranch } from "lucide-react"

const progressSteps = [
  { id: 1, label: "Processing TIBCO BW Project", icon: Bot },
  { id: 2, label: "Converting to Java/Spring Boot", icon: Zap },
  { id: 3, label: "Publishing to Target Git Repository", icon: GitBranch },
  { id: 4, label: "Preparing Download Package", icon: FileCode },
]

export default function TibcoConverter() {
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [configFile, setConfigFile] = useState<File | null>(null)
  const [workDir, setWorkDir] = useState("")
  const [targetGit, setTargetGit] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showOutput, setShowOutput] = useState(false)
  const { toast } = useToast()

  const handleProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".zip")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a ZIP file containing your TIBCO BW project.",
          variant: "destructive",
        })
        return
      }
      setProjectFile(file)
    }
  }

  const handleConfigFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setConfigFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectFile || !configFile || !workDir.trim() || !targetGit.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setCurrentStep(0)
    setShowOutput(false)
    setDownloadUrl(null)

    try {
      // Simulate the conversion process with progress steps
      for (let i = 0; i < progressSteps.length; i++) {
        setCurrentStep(i + 1)
        await new Promise((resolve) => setTimeout(resolve, 2500))
      }

      // Prepare multipart form data
      const formData = new FormData()
      formData.append("file", projectFile)
      formData.append("work_dir", workDir)
      formData.append("file_name", configFile)
      formData.append("target_git", targetGit)

      // Call the backend API
      const response = await fetch("http://localhost:8080/usb-service-ics-tibco-to-java-converter/v1/files", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Handle successful response - create download URL from response blob
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setShowOutput(true)

        toast({
          title: "Conversion Successful! 🎉",
          description:
            "Your TIBCO BW project has been successfully converted to Java/Spring Boot and published to the target Git repository.",
        })
      } else {
        throw new Error(`API call failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error("Conversion error:", error)
      toast({
        title: "Conversion Failed",
        description: "There was an error during the conversion process. Please check your inputs and try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setCurrentStep(0)
    }
  }

  const downloadConvertedCode = () => {
    if (downloadUrl) {
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${projectFile?.name.replace(".zip", "")}_converted_java_project.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        title: "Download Started",
        description: "Your converted Java/Spring Boot project is being downloaded.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#082474] to-slate-900 relative">
      {/* ABC Logo */}
      <div className="absolute top-6 left-6 z-10">
        <img src="/images/abc-logo.png" alt="ABC Logo" className="w-20 h-16 object-contain" />
      </div>
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/bot-logo-transparent.png" alt="AI Bot" className="w-12 h-12 object-contain" />
            <h1 className="text-4xl font-bold text-brand-skyBlue">TIBCO BW to Java/Spring Boot Converter</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your TIBCO BusinessWorks projects into modern Java/Spring Boot applications and publish them to
            your target Git repository.
          </p>
        </div>

        {/* Main Conversion Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border border-white/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-brand-navy flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-brand-lightBlue animate-pulse" />
              TIBCO BW Project Converter
            </CardTitle>
            <CardDescription className="text-base">
              Upload your TIBCO BW project and configuration to begin the automated conversion and publishing process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project File Upload */}
              <div className="space-y-2">
                <Label htmlFor="project-file" className="text-sm font-semibold text-brand-navy">
                  TIBCO BW Project File (ZIP) *
                </Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="project-file"
                    type="file"
                    accept=".zip"
                    onChange={handleProjectFileUpload}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-lightBlue file:text-white hover:file:bg-brand-blue"
                    disabled={isProcessing}
                    required
                  />
                </div>
                {projectFile && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Project: {projectFile.name}
                  </p>
                )}
              </div>

              {/* Work Directory */}
              <div className="space-y-2">
                <Label htmlFor="work-dir" className="text-sm font-semibold text-brand-navy">
                  Work Directory *
                </Label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="work-dir"
                    type="text"
                    placeholder="e.g., CreditCardProvisioning Service"
                    value={workDir}
                    onChange={(e) => setWorkDir(e.target.value)}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Specify the actual code directory inside the ZIP file</p>
              </div>

              {/* Configuration File */}
              <div className="space-y-2">
                <Label htmlFor="config-file" className="text-sm font-semibold text-brand-navy">
                  Configuration File *
                </Label>
                <div className="relative">
                  <FileCode className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="config-file"
                    type="file"
                    onChange={handleConfigFileUpload}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-lightBlue file:text-white hover:file:bg-brand-blue"
                    disabled={isProcessing}
                    required
                  />
                </div>
                {configFile && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Config: {configFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Upload the configuration file for the backend conversion service
                </p>
              </div>

              {/* Target Git Repository */}
              <div className="space-y-2">
                <Label htmlFor="target-git" className="text-sm font-semibold text-brand-navy">
                  Target Git Repository *
                </Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="target-git"
                    type="text"
                    placeholder="e.g., https://github.com/company/java-projects"
                    value={targetGit}
                    onChange={(e) => setTargetGit(e.target.value)}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Specify the target Git repository for the converted Java source code
                </p>
              </div>

              {/* Progress Section - Shows during conversion */}
              {isProcessing && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-brand-lightBlue/20">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-brand-navy mb-4">Converting & Publishing Project</h3>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                      <div
                        className="bg-gradient-to-r from-brand-blue to-brand-lightBlue h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(currentStep / progressSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {progressSteps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = currentStep === step.id
                      const isCompleted = currentStep > step.id

                      return (
                        <div
                          key={step.id}
                          className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                            isActive
                              ? "bg-brand-lightBlue/10 border-2 border-brand-lightBlue/30 shadow-md"
                              : isCompleted
                                ? "bg-green-50 border-2 border-green-200"
                                : "bg-gray-50 border-2 border-gray-200"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive
                                ? "bg-brand-lightBlue text-white animate-progress-pulse"
                                : isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-500"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isActive ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span
                            className={`font-medium ${
                              isActive ? "text-brand-lightBlue" : isCompleted ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Ready state when all fields are filled */}
              {!isProcessing && projectFile && configFile && workDir && targetGit && (
                <div className="p-8 bg-green-50 rounded-lg border-2 border-green-200 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 font-medium">Ready to Convert & Publish</p>
                  <p className="text-sm text-green-600 mt-2">
                    All required fields are completed. Click the button below to start the conversion process.
                  </p>
                </div>
              )}

              {/* Empty state when fields are missing */}
              {!isProcessing && (!projectFile || !configFile || !workDir || !targetGit) && (
                <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Complete All Required Fields</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Fill in all required fields to enable the conversion process
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={isProcessing || !projectFile || !configFile || !workDir.trim() || !targetGit.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-brand-blue to-brand-lightBlue hover:from-brand-navy hover:to-brand-blue text-white shadow-lg transition-all duration-300 animate-glow-pulse disabled:animate-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting & Publishing...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    Generate & Publish Code
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Success & Download Section */}
        {showOutput && downloadUrl && (
          <Card className="max-w-4xl mx-auto mt-8 shadow-xl border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-brand-navy flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Conversion Completed Successfully!
              </CardTitle>
              <CardDescription className="text-green-700">
                Your TIBCO BW project has been successfully converted to Java/Spring Boot and published to the target
                Git repository. The converted project is ready for download.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  onClick={downloadConvertedCode}
                  size="lg"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-5 h-5" />
                  Download Converted Project
                </Button>
                <div className="text-sm text-gray-600 text-center">
                  <p>✅ Project converted to Java/Spring Boot</p>
                  <p>✅ Code published to target Git repository</p>
                  <p>✅ Ready for deployment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <Bot className="w-4 h-4 text-white" />
            <span className="font-semibold">TIBCO BW Converter</span>
            <span>–</span>
            <span>Enterprise Grade Conversion Service</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            © 2025 ABC. Advanced TIBCO to Java/Spring Boot conversion platform.
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  )
}

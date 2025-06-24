"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Upload, Download, Zap, Bot, CheckCircle, Loader2, FileCode, Code } from "lucide-react"

const progressSteps = [
  { id: 1, label: "Analyzing TIBCO BW Source Code", icon: Bot },
  { id: 2, label: "Generating Spring Boot Code", icon: Zap },
  { id: 3, label: "Preparing Output for Download", icon: FileCode },
]

export default function TibcoConverter() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [generatedCode, setGeneratedCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showOutput, setShowOutput] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedFile) {
      toast({
        title: "Missing Source Code",
        description: "Please upload your TIBCO BW source code file.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setCurrentStep(0)
    setShowOutput(false)

    // Simulate the conversion process
    for (let i = 0; i < progressSteps.length; i++) {
      setCurrentStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    // Simulate API call result
    const success = Math.random() > 0.3 // 70% success rate for demo

    if (success) {
      // Generate mock Spring Boot code
      const mockSpringBootCode = `package com.abc.tibcoconverter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class ConvertedTibcoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConvertedTibcoApplication.class, args);
    }

    @GetMapping("/api/process")
    public ResponseEntity<String> processData(@RequestParam String input) {
        // Converted TIBCO BW logic
        String processedData = processBusinessLogic(input);
        return ResponseEntity.ok(processedData);
    }

    private String processBusinessLogic(String input) {
        // This method contains the converted TIBCO BW business logic
        return "Processed: " + input;
    }
}

// Additional configuration classes and services would be generated here
// based on your TIBCO BW project structure and components.`

      setGeneratedCode(mockSpringBootCode)
      setShowOutput(true)
      toast({
        title: "Conversion Successful!",
        description: "Your TIBCO BW code has been successfully converted to Spring Boot.",
      })
    } else {
      toast({
        title: "Conversion Failed",
        description: "There was an error during the conversion process. Please check your source code and try again.",
        variant: "destructive",
      })
    }

    setIsProcessing(false)
    setCurrentStep(0)
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/java" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ConvertedTibcoApplication.java"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
    toast({
      title: "Code Copied!",
      description: "The generated Spring Boot code has been copied to your clipboard.",
    })
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
            <h1 className="text-4xl font-bold text-brand-skyBlue">TIBCO to Spring Boot Converter</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your TIBCO BusinessWorks source code into modern Spring Boot applications with the power of
            AI-driven code generation.
          </p>
        </div>

        {/* Main Conversion Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border border-white/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-brand-navy flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-brand-lightBlue animate-pulse" />
              AI-Powered Code Conversion
            </CardTitle>
            <CardDescription className="text-base">
              Upload your TIBCO BW files to begin the automated conversion process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-sm font-semibold text-brand-navy">
                  Upload TIBCO BW Files
                </Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".bw,.xml,.java,.properties"
                    onChange={handleFileUpload}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-lightBlue file:text-white hover:file:bg-brand-blue"
                    disabled={isProcessing}
                  />
                </div>
                {uploadedFile && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Uploaded: {uploadedFile.name}
                  </p>
                )}
              </div>

              {/* Progress Section - Shows during conversion */}
              {isProcessing && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-brand-lightBlue/20">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-brand-navy mb-4">AI Conversion in Progress</h3>
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

              {/* Placeholder when not processing */}
              {!isProcessing && uploadedFile && (
                <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Ready to convert your TIBCO BW code</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click the button below to start the AI-powered conversion
                  </p>
                </div>
              )}

              {/* Empty state when no file uploaded */}
              {!isProcessing && !uploadedFile && (
                <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Upload your TIBCO BW files</p>
                  <p className="text-sm text-gray-500 mt-2">Supported formats: .bw, .xml, .java, .properties</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={isProcessing || !uploadedFile}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-brand-blue to-brand-lightBlue hover:from-brand-navy hover:to-brand-blue text-white shadow-lg transition-all duration-300 animate-glow-pulse disabled:animate-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting Code...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    Convert to Spring Boot
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Section */}
        {showOutput && (
          <Card className="max-w-4xl mx-auto mt-8 shadow-xl border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-brand-navy flex items-center gap-2">
                <Code className="w-5 h-5 text-green-600" />
                Generated Spring Boot Code
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadCode} variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  Copy Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedCode}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-gray-50 border-gray-200"
              />
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <Bot className="w-4 h-4 text-white" />
            <span className="font-semibold">MVP1</span>
            <span>–</span>
            <span>Powered by Azure OpenAI</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">© 2025 ABC. Advanced AI-driven code transformation platform.</p>
        </footer>
      </div>

      <Toaster />
    </div>
  )
}

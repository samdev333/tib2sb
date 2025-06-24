"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { GitBranch, Zap, Bot, CheckCircle, Loader2 } from "lucide-react"

const progressSteps = [
  { id: 1, label: "Analyzing TIBCO BW Project", icon: Bot },
  { id: 2, label: "Generating Spring Boot Code", icon: Zap },
  { id: 3, label: "Publishing to Target Repository", icon: GitBranch },
]

export default function TibcoConverter() {
  const [sourceRepo, setSourceRepo] = useState("")
  const [targetRepo, setTargetRepo] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sourceRepo || !targetRepo) {
      toast({
        title: "Missing Information",
        description: "Please provide both source and target GitLab repository URLs.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setCurrentStep(0)

    // Simulate the conversion process
    for (let i = 0; i < progressSteps.length; i++) {
      setCurrentStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    // Simulate API call result
    const success = Math.random() > 0.3 // 70% success rate for demo

    if (success) {
      toast({
        title: "Conversion Successful!",
        description: "Your TIBCO BW project has been successfully converted to Spring Boot and published.",
      })
    } else {
      toast({
        title: "Conversion Failed",
        description:
          "There was an error during the conversion process. Please check your repository URLs and try again.",
        variant: "destructive",
      })
    }

    setIsProcessing(false)
    setCurrentStep(0)
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
            Transform your TIBCO BusinessWorks projects into modern Spring Boot applications with the power of AI-driven
            code generation.
          </p>
        </div>

        {/* Main Conversion Card */}
        <Card className="max-w-2xl mx-auto shadow-2xl border border-white/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-brand-navy flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-white animate-pulse" />
              AI-Powered Code Conversion
            </CardTitle>
            <CardDescription className="text-base">
              Enter your GitLab repository URLs to begin the automated conversion process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Source Repository Input */}
              <div className="space-y-2">
                <Label htmlFor="source-repo" className="text-sm font-semibold text-brand-navy">
                  Source GitLab Repository (TIBCO BW)
                </Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                  <Input
                    id="source-repo"
                    type="url"
                    placeholder="https://gitlab.com/your-org/tibco-bw-project"
                    value={sourceRepo}
                    onChange={(e) => setSourceRepo(e.target.value)}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Target Repository Input */}
              <div className="space-y-2">
                <Label htmlFor="target-repo" className="text-sm font-semibold text-brand-navy">
                  Target GitLab Repository (Spring Boot Output)
                </Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                  <Input
                    id="target-repo"
                    type="url"
                    placeholder="https://gitlab.com/your-org/spring-boot-output"
                    value={targetRepo}
                    onChange={(e) => setTargetRepo(e.target.value)}
                    className="pl-11 h-12 border-2 focus:border-brand-lightBlue transition-colors"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-brand-blue to-brand-lightBlue hover:from-brand-navy hover:to-brand-blue text-white shadow-lg transition-all duration-300 animate-glow-pulse disabled:animate-none"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
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

        {/* Progress Animation */}
        {isProcessing && (
          <Card className="max-w-2xl mx-auto mt-8 shadow-xl border-2 border-brand-lightBlue/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">AI Conversion in Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                      className="bg-gradient-to-r from-brand-blue to-brand-lightBlue h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(currentStep / progressSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {progressSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === step.id
                    const isCompleted = currentStep > step.id

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                          isActive
                            ? "bg-brand-lightBlue/10 border-2 border-brand-lightBlue/30"
                            : isCompleted
                              ? "bg-blue-50 border-2 border-blue-200"
                              : "bg-gray-50 border-2 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-brand-lightBlue text-white animate-progress-pulse"
                              : isCompleted
                                ? "bg-blue-500 text-white"
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
                            isActive ? "text-brand-lightBlue" : isCompleted ? "text-blue-700" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
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

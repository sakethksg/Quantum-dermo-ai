"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Download,
  ExternalLink,
  Shield,
  Zap,
  Users,
  Settings,
  Brain,
  Database,
  AlertTriangle,
  CheckCircle,
  Play,
  Headphones
} from "lucide-react"

interface HelpArticle {
  id: string
  title: string
  category: string
  description: string
  type: "guide" | "faq" | "video" | "download"
  difficulty: "beginner" | "intermediate" | "advanced"
  readTime: string
}

interface SupportContact {
  type: "phone" | "email" | "chat"
  title: string
  contact: string
  availability: string
  description: string
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const helpArticles: HelpArticle[] = [
    {
      id: "1",
      title: "Getting Started with QuantumHealth",
      category: "Getting Started",
      description: "Complete overview of the QuantumHealth platform and its core features",
      type: "guide",
      difficulty: "beginner",
      readTime: "10 min"
    },
    {
      id: "2",
      title: "AI Prediction Models: How They Work",
      category: "AI & ML",
      description: "Understanding post-quantum cryptography and machine learning predictions",
      type: "guide",
      difficulty: "intermediate",
      readTime: "15 min"
    },
    {
      id: "3",
      title: "Patient Data Privacy & HIPAA Compliance",
      category: "Security",
      description: "Learn about data protection, encryption, and compliance features",
      type: "guide",
      difficulty: "beginner",
      readTime: "8 min"
    },
    {
      id: "4",
      title: "User Management and Permissions",
      category: "Administration",
      description: "How to manage users, roles, and access permissions",
      type: "guide",
      difficulty: "intermediate",
      readTime: "12 min"
    },
    {
      id: "5",
      title: "Troubleshooting Connection Issues",
      category: "Troubleshooting",
      description: "Common solutions for data source and network connectivity problems",
      type: "guide",
      difficulty: "beginner",
      readTime: "6 min"
    },
    {
      id: "6",
      title: "Platform Demo Walkthrough",
      category: "Getting Started",
      description: "Complete video demonstration of QuantumHealth features",
      type: "video",
      difficulty: "beginner",
      readTime: "25 min"
    },
    {
      id: "7",
      title: "API Documentation",
      category: "Developers",
      description: "Complete REST API reference and integration guide",
      type: "download",
      difficulty: "advanced",
      readTime: "45 min"
    },
    {
      id: "8",
      title: "Performance Optimization Guide",
      category: "Administration",
      description: "Best practices for optimizing system performance and monitoring",
      type: "guide",
      difficulty: "advanced",
      readTime: "20 min"
    }
  ]

  const supportContacts: SupportContact[] = [
    {
      type: "phone",
      title: "Technical Support",
      contact: "+1 (800) 555-HELP",
      availability: "24/7 Emergency Support",
      description: "Immediate assistance for critical system issues"
    },
    {
      type: "email",
      title: "General Support",
      contact: "support@quantumhealth.com",
      availability: "Response within 4 hours",
      description: "General questions, feature requests, and non-urgent issues"
    },
    {
      type: "chat",
      title: "Live Chat",
      contact: "Available in-app",
      availability: "Mon-Fri 8 AM - 8 PM EST",
      description: "Real-time assistance with platform questions"
    }
  ]

  const faqs = [
    {
      question: "How does the AI prediction system ensure accuracy?",
      answer: "Our quantum-enhanced machine learning models are trained on millions of anonymized medical records and continuously validated against clinical outcomes. The system achieves >95% accuracy for most common health predictions and includes confidence intervals for all results."
    },
    {
      question: "Is my patient data secure and HIPAA compliant?",
      answer: "Yes, QuantumHealth is fully HIPAA compliant with enterprise-grade security. All data is encrypted using post-quantum cryptography, stored in secure data centers, and access is logged and monitored. We undergo regular security audits and maintain SOC 2 Type II certification."
    },
    {
      question: "Can I integrate QuantumHealth with my existing EMR system?",
      answer: "QuantumHealth supports integration with most major EMR systems including Epic, Cerner, and Allscripts through standard HL7 FHIR APIs. Our integration team can assist with custom connections for specialized systems."
    },
    {
      question: "What happens if the system goes down during critical operations?",
      answer: "QuantumHealth maintains 99.9% uptime with automatic failover systems. In the rare event of an outage, cached predictions remain available, and emergency protocols ensure continuous access to critical patient data through redundant systems."
    },
    {
      question: "How do I add new users and assign permissions?",
      answer: "Navigate to User Management, click 'Add User', and follow the setup wizard. You can assign role-based permissions (Doctor, Nurse, Admin, etc.) or create custom permission sets. All new users receive automated onboarding materials."
    },
    {
      question: "Can I export data for research or reporting purposes?",
      answer: "Yes, authorized users can export anonymized data in various formats (CSV, JSON, FHIR) for research purposes. All exports are logged for audit purposes and comply with data governance policies."
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(helpArticles.map(article => article.category)))]

  const getTypeIcon = (type: HelpArticle["type"]) => {
    switch (type) {
      case "guide":
        return <Book className="h-4 w-4" />
      case "faq":
        return <HelpCircle className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: HelpArticle["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
    }
  }

  const getContactIcon = (type: SupportContact["type"]) => {
    switch (type) {
      case "phone":
        return <Phone className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      case "chat":
        return <MessageCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground mt-1">
              Documentation, guides, and support for QuantumHealth
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
            <Button size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Quick Access Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Need immediate help? Our 24/7 technical support is available at{" "}
            <strong>+1 (800) 555-HELP</strong> for critical system issues.
          </AlertDescription>
        </Alert>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documentation, guides, and FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Documentation Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Guides</CardTitle>
                <CardDescription>
                  Comprehensive guides and tutorials for using QuantumHealth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(article.type)}
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {article.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions and answers about QuantumHealth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Get Support</CardTitle>
                <CardDescription>
                  Multiple ways to get help when you need it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportContacts.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{contact.title}</h4>
                      <p className="text-sm font-mono text-blue-600 mb-1">
                        {contact.contact}
                      </p>
                      <p className="text-xs text-green-600 mb-1">
                        {contact.availability}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Center
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Release Notes
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Status
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
              </CardContent>
            </Card>

            {/* Feature Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Feature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Predictions
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security & Privacy
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Performance
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Information */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Emergency Support</strong><br />
                For critical system issues affecting patient care, call our emergency hotline immediately.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Training Resources */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Training & Certification</CardTitle>
            <CardDescription>
              Professional development and certification programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 border rounded-lg">
                <Headphones className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Online Training</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Self-paced courses on platform features and best practices
                </p>
                <Button variant="outline" size="sm">
                  Start Learning
                </Button>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <Video className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Live Webinars</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Interactive sessions with QuantumHealth experts
                </p>
                <Button variant="outline" size="sm">
                  View Schedule
                </Button>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Certification</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Become a certified QuantumHealth administrator
                </p>
                <Button variant="outline" size="sm">
                  Get Certified
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
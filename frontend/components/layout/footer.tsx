import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Heart, Zap, Lock } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { title: "Features", href: "/features" },
      { title: "Security", href: "/security" },
      { title: "API Documentation", href: "/docs" },
      { title: "Integrations", href: "/integrations" }
    ],
    company: [
      { title: "About", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" }
    ],
    legal: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "HIPAA Compliance", href: "/hipaa" },
      { title: "Cookie Policy", href: "/cookies" }
    ],
    support: [
      { title: "Help Center", href: "/help" },
      { title: "Community", href: "/community" },
      { title: "Status", href: "/status" },
      { title: "Training", href: "/training" }
    ]
  }

  const securityFeatures = [
    {
      icon: Shield,
      title: "Post-Quantum Encryption",
      description: "Future-proof security"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Data protection at rest and in transit"
    },
    {
      icon: Heart,
      title: "HIPAA Compliant",
      description: "Healthcare data standards"
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Continuous security assessment"
    }
  ]

  return (
    <footer className="bg-background border-t">
      {/* Security Features Banner */}
      <div className="bg-muted/30 py-6">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">QuantumHealth</h3>
                <p className="text-xs text-muted-foreground">AI Healthcare Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Advanced healthcare analytics powered by quantum-secure AI technology. 
              Providing predictive insights while maintaining the highest security standards.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">SOC 2 Compliant</Badge>
              <Badge variant="secondary">ISO 27001</Badge>
              <Badge variant="secondary">HIPAA Ready</Badge>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {currentYear} QuantumHealth Platform</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Version 1.0.0</span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Built with ❤️ for healthcare professionals</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Building2, Sparkles, Rocket, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'Forever free',
    description: 'Perfect for getting started with AI website building',
    features: [
      { icon: Search, text: 'Basic AI website generation (3/month)' },
      { icon: Zap, text: 'Limited AI edits (10/month)' },
      { icon: Building2, text: 'Single website hosting' },
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: 19,
    period: 'billed monthly',
    saveText: 'Save $38 annually',
    description: 'Unlock advanced features and increased limits',
    features: [
      { icon: Sparkles, text: 'Unlimited AI website generations' },
      { icon: Rocket, text: 'Advanced AI editing capabilities' },
      { icon: Building2, text: 'Up to 5 website hosting' },
    ],
    cta: 'Upgrade Now',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49,
    period: 'billed monthly',
    description: 'Custom solutions for large organizations',
    features: [
      { icon: Users, text: 'Unlimited team members' },
      { icon: Building2, text: 'Unlimited websites' },
      { icon: Sparkles, text: 'Custom AI model training' },
    ],
    cta: 'Contact Sales',
  }
]

const featureComparison = [
  {
    category: 'Core Features',
    features: [
      { name: 'Websites', free: '1', pro: '5', enterprise: 'Unlimited' },
      { name: 'AI Generations', free: '3/month', pro: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'AI Edits', free: '10/month', pro: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Storage', free: '1GB', pro: '10GB', enterprise: '100GB' },
    ]
  },
  {
    category: 'Advanced Features',
    features: [
      { name: 'Custom Domain', free: false, pro: true, enterprise: true },
      { name: 'Analytics Dashboard', free: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
      { name: 'Form Submissions', free: '10/month', pro: '100/month', enterprise: 'Unlimited' },
      { name: 'Team Members', free: '1', pro: '5', enterprise: 'Unlimited' },
    ]
  },
  {
    category: 'Support',
    features: [
      { name: 'Support Level', free: 'Community', pro: 'Priority Email', enterprise: '24/7 Phone' },
      { name: 'Custom Training', free: false, pro: false, enterprise: true },
      { name: 'SLA', free: false, pro: false, enterprise: true },
    ]
  }
]

export function PricingSectionComponent() {
  const [showComparison, setShowComparison] = React.useState(false)

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className={`h-full ${
                plan.popular ? 'relative border-2 border-purple-500 dark:border-purple-400' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.period}
                      {plan.saveText && (
                        <span className="text-purple-500 dark:text-purple-400 ml-2">
                          {plan.saveText}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <feature.icon className="h-5 w-5 text-purple-500" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.popular ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowComparison(!showComparison)}
            className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Show Detailed Comparison
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
              animate={{ rotate: showComparison ? 180 : 0 }}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </Button>
        </div>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-8"
            >
              <Card>
                {featureComparison.map((section, idx) => (
                  <div key={idx} className="border-b last:border-b-0">
                    <Table>
                      {idx === 0 && (
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Features</TableHead>
                            <TableHead className="text-center">Free</TableHead>
                            <TableHead className="text-center">Pro</TableHead>
                            <TableHead className="text-center">Enterprise</TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} className="bg-muted/50 font-semibold">
                            {section.category}
                          </TableCell>
                        </TableRow>
                        {section.features.map((feature, featureIdx) => (
                          <TableRow key={featureIdx}>
                            <TableCell className="font-medium">{feature.name}</TableCell>
                            <TableCell className="text-center">{feature.free}</TableCell>
                            <TableCell className="text-center">{feature.pro}</TableCell>
                            <TableCell className="text-center">{feature.enterprise}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
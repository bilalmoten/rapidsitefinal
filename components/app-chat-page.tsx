'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, ArrowLeft, Upload, Link as LinkIcon, Palette, Type, Image as ImageIcon, Mic, Download, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

type MoodBoard = {
  colorScheme: string[];
  font: string;
  logo: string | null;
  inspirationImages: string[];
  inspirationLinks: string[];
}

const industryOptions = [
  "E-commerce",
  "Portfolio",
  "Blog",
  "Corporate",
  "Educational",
  "Non-profit",
  "Restaurant",
  "Real Estate",
  "Technology",
  "Healthcare",
]

export function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hello! I'm your AI assistant. Let's create your dream website. To get started, could you tell me about your business and what kind of website you're looking for?", sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [moodBoard, setMoodBoard] = useState<MoodBoard>({
    colorScheme: ['#3B82F6', '#10B981', '#6366F1'],
    font: 'Inter',
    logo: null,
    inspirationImages: [],
    inspirationLinks: []
  })
  const [progress, setProgress] = useState(0)
  const [industry, setIndustry] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = { id: messages.length + 1, content: input, sender: 'user' }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = { 
        id: messages.length + 2, 
        content: "Thank you for sharing that information. I've updated our mood board with some initial ideas based on your input. What specific features or sections would you like on your website?", 
        sender: 'ai' 
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
      // Update mood board (this would be based on actual AI processing in a real scenario)
      setMoodBoard(prev => ({
        ...prev,
        colorScheme: [getRandomColor(), getRandomColor(), getRandomColor()],
        font: ['Inter', 'Roboto', 'Playfair Display', 'Montserrat'][Math.floor(Math.random() * 4)]
      }))
      setProgress(prev => Math.min(prev + 20, 100))
    }, 1500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (file.type.startsWith('image/')) {
          setMoodBoard(prev => ({
            ...prev,
            inspirationImages: [...prev.inspirationImages, result]
          }))
        } else {
          setMoodBoard(prev => ({
            ...prev,
            logo: result
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLinkAdd = () => {
    const link = prompt("Enter an inspiration link:")
    if (link) {
      setMoodBoard(prev => ({
        ...prev,
        inspirationLinks: [...prev.inspirationLinks, link]
      }))
    }
  }

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16)
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.onstart = () => {
        setIsListening(true)
      }
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + ' ' + transcript)
      }
      recognition.onend = () => {
        setIsListening(false)
      }
      recognition.start()
    } else {
      alert("Your browser doesn't support speech recognition. Please try a different browser.")
    }
  }

  const exportMoodBoard = () => {
    const moodBoardData = JSON.stringify(moodBoard, null, 2)
    const blob = new Blob([moodBoardData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mood-board.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">AI Website Builder Chat</h1>
          </div>
        </header>

        <main className="flex-1 overflow-hidden container mx-auto p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar>
                      <AvatarImage src={message.sender === 'ai' ? "/ai-avatar.png" : "/user-avatar.png"} alt={message.sender === 'ai' ? "AI" : "User"} />
                      <AvatarFallback>{message.sender === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                      <p>{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 resize-none"
              rows={3}
            />
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
              </Button>
              <Button type="button" variant="outline" onClick={handleVoiceInput}>
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
                <span className="sr-only">Voice input</span>
              </Button>
            </div>
          </form>
        </main>
      </div>

      <div className="w-1/3 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Website Builder Progress</h2>
        <Progress value={progress} className="mb-4" />
        <p className="mb-4">{progress}% Complete</p>

        <h2 className="text-xl font-bold mb-4">Industry</h2>
        <Select onValueChange={setIndustry} value={industry}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {industryOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <h2 className="text-xl font-bold mb-4">Mood Board</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Color Scheme</Label>
            <div className="flex space-x-2 mt-2">
              {moodBoard.colorScheme.map((color, index) => (
                <div key={index} className="w-12 h-12 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div>
            <Label className="text-lg font-semibold">Font</Label>
            <p className="text-2xl mt-2" style={{ fontFamily: moodBoard.font }}>
              {moodBoard.font}
            </p>
          </div>
          {moodBoard.logo && (
            <div>
              <Label className="text-lg font-semibold">Logo</Label>
              <img src={moodBoard.logo} alt="Uploaded Logo" className="mt-2 max-w-full h-auto" />
            </div>
          )}
          {moodBoard.inspirationImages.length > 0 && (
            <div>
              <Label className="text-lg font-semibold">Inspiration Images</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {moodBoard.inspirationImages.map((img, index) => (
                  <img key={index} src={img} alt={`Inspiration ${index + 1}`} className="w-full h-auto" />
                ))}
              </div>
            </div>
          )}
          {moodBoard.inspirationLinks.length > 0 && (
            <div>
              <Label className="text-lg font-semibold">Inspiration Links</Label>
              <ul className="list-disc list-inside mt-2">
                {moodBoard.inspirationLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <Button onClick={() => fileInputRef.current?.click()} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo or Inspiration
          </Button>
          <Button onClick={handleLinkAdd} className="w-full">
            <LinkIcon className="h-4 w-4 mr-2" />
            Add Inspiration Link
          </Button>
          <Button onClick={exportMoodBoard} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Mood Board
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  )
}
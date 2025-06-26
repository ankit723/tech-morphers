"use client"

import { useState, FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

const GetStartedForm = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [projectVision, setProjectVision] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setService('');
    setBudget('');
    setPhone('');
    setCompanyName('');
    setProjectVision('');
    setError(null);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = {
        name,
        email,
        phone,
        service,
        budget,
        companyName,
        projectVision
    };

    try {
        const response = await fetch('/api/get-started', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            setSubmitted(true)
            resetForm();
            setTimeout(() => setSubmitted(false), 7000);
        } else {
            setError(result.error || 'An unexpected error occurred.');
        }
    } catch (err) {
        setError('Failed to connect to the server. Please try again.');
        console.error(err);
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center bg-card dark:bg-gray-800 rounded-lg shadow-xl"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-semibold text-foreground dark:text-white mb-3">
          Thank You!
        </h2>
        <p className="text-lg text-muted-foreground dark:text-gray-300 mb-8">
          Your project details have been received. We&apos;ll be in touch shortly.
        </p>
        <Button 
          onClick={() => setSubmitted(false)} 
          className="bg-primary hover:bg-primary/90 dark:bg-blue-500 dark:hover:bg-blue-600 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Submit Another Inquiry
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-lg">
        <div className="bg-gradient-to-br from-primary via-purple-600 to-pink-600 dark:from-blue-700 dark:via-indigo-600 dark:to-purple-600 text-white p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-1 md:space-y-6 rounded-l-lg">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Ready to Innovate?
          </h2>
          <p className="text-md md:text-lg opacity-90">
            Tell us about your vision. We specialize in transforming ideas into market-leading digital products.
          </p>
          <ul className="text-sm md:text-base list-disc list-inside space-y-2 opacity-80">
            <li>Bespoke Web & Mobile Applications</li>
            <li>AI-Powered SaaS Solutions</li>
            <li>Strategic MVP Development</li>
            <li>Complimentary Project Consultation</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8 rounded-r-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="gs-name" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Full Name <span className="text-red-500">*</span></Label>
              <Input id="gs-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ada Lovelace"  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading} autoComplete='name'/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gs-email" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Email Address <span className="text-red-500">*</span></Label>
              <Input id="gs-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ada@example.com" className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading} autoComplete='email'/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
             <div className="space-y-1.5">
              <Label htmlFor="gs-phone" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Phone Number</Label>
              <Input id="gs-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +91 9876543210" className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading} required autoComplete='tel'/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gs-companyName" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Company Name (Optional)</Label>
              <Input id="gs-companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Awesome Corp." className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading} autoComplete='name'/>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="gs-service" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Service of Interest <span className="text-red-500">*</span></Label>
              <Input id="gs-service" required value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g., AI Product Development" className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading}/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gs-budget" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Estimated Budget (Optional)</Label>
              <Input id="gs-budget" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., ₹10L - ₹25L" className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400" disabled={loading} required/>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gs-desc" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Project Vision <span className="text-red-500">*</span></Label>
            <Textarea
              id="gs-desc"
              value={projectVision} onChange={(e) => setProjectVision(e.target.value)}
              placeholder="Briefly describe your project, goals, and any specific requirements..."
              rows={5}
              required
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-700 dark:text-red-400">
                <AlertTriangle className="mr-2 h-5 w-5 shrink-0" />
                {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700 text-white text-base md:text-lg py-3 md:py-3.5 rounded-lg shadow-md hover:shadow-lg font-semibold transition-all duration-300 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-indigo-400"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Inquiry...
              </>
            ) : (
              "Launch Your Project"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

export default GetStartedForm


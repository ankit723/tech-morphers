"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, FormEvent } from "react";

export default function TalkToUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form data submitted:", formData);
    // You would typically send this data to a backend or an email service
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name" className="">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email" className="">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone" className="">
          Phone Number <span className="text-gray-500">(Optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(123) 456-7890"
          value={formData.phone}
          onChange={handleChange}
          className=""
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message" className="">
          Your Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us about your project or inquiry..."
          value={formData.message}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md"
      >
        Send Message
      </Button>
    </form>
  );
} 
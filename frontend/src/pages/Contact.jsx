import React from 'react';
import { Button } from "@/components/ui/button";
import { FaMapLocationDot, FaEnvelope, FaClock } from "react-icons/fa6";
import { toast } from "sonner";

export default function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent successfully!");
    };

    return (
        <div className="">
            {/* Header */}
            <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Get in Touch
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Have questions about our products, shipping, or just want to say hello? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Contact Information */}
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Contact Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Fill out the form and our team will get back to you within 24 hours.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Email */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <FaEnvelope className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">codeovik@gmail.com</p>
                                <p className="text-gray-600 dark:text-gray-400">support@ovikn.com</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <FaMapLocationDot className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Location</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Dhaka, Bangladesh
                                </p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <FaClock className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Working Hours</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Mon - Fri: 9:00 AM - 10:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Sat - Sun: 10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-box border border-box-secondary rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                                <input id="firstName" type="text" required className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6 bg-transparent" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                                <input id="lastName" type="text" required className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6 bg-transparent" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input id="email" type="email" required className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6 bg-transparent" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-medium">Message</label>
                            <textarea id="message" required rows={4} className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6 bg-transparent resize-none" placeholder="How can we help you?" />
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { FaReact, FaNodeJs, FaGoogle, FaShippingFast, FaCode } from "react-icons/fa";
import { SiMongodb, SiExpress, SiCloudinary, SiPayoneer, SiJsonwebtokens } from "react-icons/si";
import { MdEmail } from "react-icons/md";

export default function About() {
    return (
        <div className="py-12 space-y-24">
            {/* Hero Section */}
            <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-block p-2 px-4 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                    Beyond Standard E-commerce
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Built with Code, <br className="hidden md:block" />
                    <span className="text-primary">Not Just Configured.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Ovikn is a next-generation dropshipping platform. Unlike traditional stores built on Shopify or WooCommerce, 
                    this is a fully custom-engineered solution powered by the MERN stack, designed for speed, flexibility, and control.
                </p>
            </section>

            {/* Tech Stack Grid */}
            <section>
                <h2 className="text-3xl font-bold mb-12 text-center">The Technology Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Core Stack */}
                    <div className="bg-box border border-box-secondary p-6 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <FaCode size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Custom MERN Architecture</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Built from scratch using MongoDB, Express.js, React, and Node.js. No CMS bloat—just pure, efficient code.
                        </p>
                        <div className="flex gap-3 mt-4 text-2xl text-gray-400">
                            <SiMongodb title="MongoDB" className="hover:text-green-500 transition-colors"/>
                            <SiExpress title="Express" className="hover:text-gray-500 transition-colors"/>
                            <FaReact title="React" className="hover:text-blue-400 transition-colors"/>
                            <FaNodeJs title="Node.js" className="hover:text-green-600 transition-colors"/>
                        </div>
                    </div>

                    {/* Card 2: Auth & Security */}
                    <div className="bg-box border border-box-secondary p-6 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform">
                            <SiJsonwebtokens size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Advanced Authentication</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Hybrid security system featuring Google Official OAuth integration alongside a custom secure Email/Password authentication flow.
                        </p>
                        <div className="flex gap-3 mt-4 text-2xl text-gray-400">
                            <FaGoogle title="Google OAuth" className="hover:text-red-500 transition-colors"/>
                        </div>
                    </div>

                    {/* Card 3: Infrastructure */}
                    <div className="bg-box border border-box-secondary p-6 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <SiCloudinary size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Cloud Infrastructure</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Leveraging Cloudinary for optimized media delivery, Google SMTP for reliable email notifications, and MongoDB Atlas (Free Tier) for database management.
                        </p>
                        <div className="flex gap-3 mt-4 text-2xl text-gray-400">
                            <MdEmail title="SMTP" className="hover:text-yellow-500 transition-colors"/>
                        </div>
                    </div>

                    {/* Card 4: Business Logic */}
                    <div className="bg-box border border-box-secondary p-6 rounded-2xl hover:border-primary/50 transition-colors group md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-12 w-12 shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <FaShippingFast size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Global Commerce Engine</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl">
                                A complete dropshipping ecosystem integrated with <span className="font-semibold text-primary">Payoneer</span> for seamless global payments and <span className="font-semibold text-primary">AliExpress</span> for worldwide shipping logistics.
                            </p>
                        </div>
                        <div className="flex gap-4 text-3xl text-gray-400 ml-auto">
                            <SiPayoneer title="Payoneer" className="hover:text-orange-500 transition-colors"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Profile Section */}
            <section className="relative overflow-hidden bg-box border border-box-secondary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-lg">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative shrink-0">
                    <div className="w-48 h-48 rounded-full p-1 border-2 border-dashed border-primary/30">
                        <img 
                            src="https://codeovik.web.app/ovik.jpg" 
                            alt="Ovik - Developer" 
                            className="w-full h-full rounded-full object-cover border-4 border-box shadow-xl" 
                        />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-box" title="Available for work"></div>
                </div>

                <div className="text-center md:text-left space-y-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Developer</h2>
                        <p className="text-primary font-medium">The mind behind Ovikn</p>
                    </div>
                    
                    <div className="space-y-3 text-gray-600 dark:text-gray-300 max-w-xl">
                        <p>
                            Hi, I'm <span className="font-bold text-gray-900 dark:text-white">Ovik</span>.
                        </p>
                        <p>
                            I am a passionate <span className="font-semibold">MERN Stack Developer</span> and Freelancer. 
                            Currently studying in <span className="font-semibold">Class 9 (Batch of 2025)</span>, I balance my academic life with my love for coding and building complex web applications.
                        </p>
                        <p>
                            This website, <span className="font-semibold">Ovikn</span>, is a testament to my skills in Full Stack Development and SEO. It represents a journey of learning, building, and innovating beyond the constraints of pre-made tools.
                        </p>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200 dark:border-gray-700">MERN Stack</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200 dark:border-gray-700">Freelancer</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200 dark:border-gray-700">Student</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
// import hero_1 from "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_1.png"
// import hero_2 from "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_2.png"
// import hero_3 from "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_3.png"
// import hero_4 from "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_4.png"
import { Button } from "@/components/ui/button"
import { FaShoppingBag } from "react-icons/fa";

const caroselData = [
    { title: "Get the skin you want to feel", description: "Blend beauty in you", image: "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_1.png", bgColor: "bg-yellow-200" },
    { title: "Unleash your inner glow", description: "Radiate confidence", image: "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_2.png", bgColor: "bg-red-300" },
    { title: "Discover your perfect match", description: "Beauty redefined", image: "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_3.png", bgColor: "bg-red-300" },
    { title: "Embrace natural elegance", description: "Simply stunning", image: "https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/hero_4.png", bgColor: "bg-red-100" },
];

export default function Hero() {
    return (
        <>
            <Swiper
                slidesPerView={1}
                breakpoints={{
                    768: {
                        slidesPerView: 1.3,
                    },
                }}
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={1000} // 1 second animation
                modules={[Autoplay]}
                className="mySwiper w-full h-auto mt-10 cursor-grab rounded-lg"
            >
                {[...caroselData, ...caroselData].map((item, index) => (
                    <SwiperSlide key={index} className="">
                        <div className="lg:relative">
                            <div
                                className={`${item.bgColor} rounded-lg aspect-6/5 lg:aspect-5/3 w-full`}>
                                <img src={item.image} alt="" className="w-full h-full lg:w-auto lg:aspect-8/7 object-cover object-top" />
                            </div>
                            <div className="lg:absolute lg:z-50 lg:top-0 lg:right-5 lg:w-[50%] h-full flex flex-col justify-center lg:text-black items-center">
                                <p className="text-3xl text-center font-light mb-3 mt-3">{item.description}</p>
                                <h3 className="text-6xl/19 lg:text-5xl xl:text-7xl font-semibold text-center">{item.title}</h3>
                                <div className="mt-10 mb-5 text-center">
                                    {/* <Link to="/products" className="bg-black dark:bg-white dark:text-black text-white hover:bg-box-tertiary text-xl transition-all w-max py-4 px-8 font-bold font-medium rounded-full cursor-pointer no-swiping" >Shop Now</Link> */}
                                    <Button variant="secondary" size='lg'>
                                        <FaShoppingBag /> Shop Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

"use client";

import React from 'react';

export const SlickStyles = () => (
    <style jsx global>{`
    .slick-slide {
      padding: 0 4px;
    }
    .slick-list {
      margin: 0 -4px;
    }
    .slick-dots li button:before {
      font-size: 8px;
    }
    .slick-dots li.slick-active button:before {
      color: #6d28d9;
    }
    .slick-prev, .slick-next {
      z-index: 10;
      width: 24px;
      height: 24px;
    }
    .slick-prev:before, .slick-next:before {
      color: #4b5563;
      font-size: 24px;
    }
    .slick-prev {
      left: -10px;
    }
    .slick-next {
      right: -10px;
    }
  `}</style>
);

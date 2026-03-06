import React from 'react';

export const SlickStyles: React.FC = () => {
  return (
    <style>{`
      /* Basic Slick Slider Styles */
      .slick-slider {
        position: relative;
        display: block;
        box-sizing: border-box;
        user-select: none;
        touch-action: pan-y;
        -webkit-tap-highlight-color: transparent;
      }
      .slick-list {
        position: relative;
        overflow: hidden;
        display: block;
        margin: 0;
        padding: 0;
      }
      .slick-list:focus {
        outline: none;
      }
      .slick-list.dragging {
        cursor: pointer;
        cursor: hand;
      }
      .slick-slider .slick-track,
      .slick-slider .slick-list {
        transform: translate3d(0, 0, 0);
      }
      .slick-track {
        position: relative;
        left: 0;
        top: 0;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .slick-track:before,
      .slick-track:after {
        content: "";
        display: table;
      }
      .slick-track:after {
        clear: both;
      }
      .slick-loading .slick-track {
        visibility: hidden;
      }
      .slick-slide {
        float: left;
        height: 100%;
        min-height: 1px;
        display: none;
      }
      [dir="rtl"] .slick-slide {
        float: right;
      }
      .slick-slide img {
        display: block;
      }
      .slick-slide.slick-loading img {
        display: none;
      }
      .slick-slide.dragging img {
        pointer-events: none;
      }
      .slick-initialized .slick-slide {
        display: block;
      }
      .slick-loading .slick-slide {
        visibility: hidden;
      }
      .slick-vertical .slick-slide {
        display: block;
        height: auto;
        border: 1px solid transparent;
      }
      .slick-arrow.slick-hidden {
        display: none;
      }
      
      /* Dots Styles */
      .slick-dots { 
        display: flex !important; 
        justify-content: center; 
        gap: 8px; 
        margin-top: 10px; 
        position: absolute; 
        bottom: -25px; 
        width: 100%; 
        list-style: none; 
        padding: 0; 
      }
      .slick-dots li { 
        width: 8px; 
        height: 8px; 
      }
      .slick-dots li button { 
        font-size: 0; 
        width: 8px; 
        height: 8px; 
        border-radius: 50%; 
        background: #e5e7eb; 
        border: none; 
        padding: 0; 
        cursor: pointer; 
        transition: all 0.3s; 
      }
      .slick-dots li.slick-active button { 
        background: #7151ff; 
        width: 24px; 
        border-radius: 4px; 
      }
    `}</style>
  );
};
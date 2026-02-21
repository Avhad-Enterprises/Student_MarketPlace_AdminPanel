
import React from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, ...props }) => {
    return <img src={src} alt={alt} {...props} />;
};

export default ImageWithFallback;

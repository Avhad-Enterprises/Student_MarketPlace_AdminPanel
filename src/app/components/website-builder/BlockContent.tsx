import React from 'react';
import { Image as ImageIcon, Type, FileText, MousePointer, Box, BarChart3, Star } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  name: string;
  icon: any;
  isVisible: boolean;
  content: any;
}

interface BlockContentProps {
  block: Block;
}

export const BlockContent: React.FC<BlockContentProps> = ({ block }) => {
  const blockStyle = (block.content.style as any) || {};
  
  // Build inline styles from block settings
  const inlineStyle: React.CSSProperties = {
    color: blockStyle.textColor,
    fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : undefined,
    textAlign: blockStyle.textAlign as any || 'left',
    backgroundColor: blockStyle.backgroundColor,
    borderRadius: blockStyle.borderRadius ? `${blockStyle.borderRadius}px` : undefined,
    paddingTop: blockStyle.paddingY ? `${blockStyle.paddingY}px` : undefined,
    paddingBottom: blockStyle.paddingY ? `${blockStyle.paddingY}px` : undefined,
    paddingLeft: blockStyle.paddingX ? `${blockStyle.paddingX}px` : undefined,
    paddingRight: blockStyle.paddingX ? `${blockStyle.paddingX}px` : undefined,
    boxShadow: blockStyle.shadow === 'soft' ? '0 1px 3px rgba(0,0,0,0.1)' :
               blockStyle.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
               blockStyle.shadow === 'strong' ? '0 10px 15px rgba(0,0,0,0.2)' :
               undefined
  };

  switch (block.type) {
    case 'heading':
      const HeadingTag = (block.content.level || 'h2') as keyof JSX.IntrinsicElements;
      
      // Empty state for heading
      if (!block.content.text) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Type size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add content in the settings panel →</p>
            </div>
          </div>
        );
      }
      
      return (
        <HeadingTag 
          className="font-bold px-4 py-3" 
          style={{
            ...inlineStyle,
            fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : 
                     block.content.level === 'h1' ? '32px' :
                     block.content.level === 'h3' ? '20px' :
                     block.content.level === 'h4' ? '18px' :
                     block.content.level === 'h5' ? '16px' :
                     block.content.level === 'h6' ? '14px' : '24px',
            color: blockStyle.textColor || '#253154'
          }}
        >
          {block.content.text}
        </HeadingTag>
      );
    
    case 'text':
      // Empty state for text
      if (!block.content.text) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add content in the settings panel →</p>
            </div>
          </div>
        );
      }
      
      return (
        <p 
          className="px-4 py-2" 
          style={{
            ...inlineStyle,
            color: blockStyle.textColor || '#374151',
            fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : '14px',
            lineHeight: '1.6'
          }}
        >
          {block.content.text}
        </p>
      );
    
    case 'button':
      // Empty state for button
      if (!block.content.text) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <MousePointer size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add content in the settings panel →</p>
            </div>
          </div>
        );
      }
      
      return (
        <div 
          className="px-4 py-3" 
          style={{ textAlign: blockStyle.textAlign || 'left' }}
        >
          <button 
            className="px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: blockStyle.backgroundColor || '#0e042f',
              color: blockStyle.textColor || '#ffffff',
              borderRadius: blockStyle.borderRadius ? `${blockStyle.borderRadius}px` : '8px',
              fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : '14px',
              boxShadow: blockStyle.shadow === 'soft' ? '0 1px 3px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'strong' ? '0 10px 15px rgba(0,0,0,0.2)' :
                        undefined
            }}
          >
            {block.content.text}
          </button>
        </div>
      );
    
    case 'image':
      if (!block.content.src) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add an image in the settings panel →</p>
            </div>
          </div>
        );
      }
      return (
        <div className="px-4 py-3" style={{ textAlign: blockStyle.textAlign || 'left' }}>
          <img 
            src={block.content.src} 
            alt={block.content.alt || ''} 
            className="max-w-full"
            style={{
              borderRadius: blockStyle.borderRadius ? `${blockStyle.borderRadius}px` : undefined,
              boxShadow: blockStyle.shadow === 'soft' ? '0 1px 3px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'strong' ? '0 10px 15px rgba(0,0,0,0.2)' :
                        undefined,
              margin: blockStyle.textAlign === 'center' ? '0 auto' : 
                     blockStyle.textAlign === 'right' ? '0 0 0 auto' : undefined
            }}
          />
          {block.content.caption && (
            <p className="text-xs text-gray-500 mt-2" style={{ textAlign: blockStyle.textAlign || 'left' }}>
              {block.content.caption}
            </p>
          )}
        </div>
      );
    
    case 'list':
      return (
        <ul 
          className="flex gap-6 px-4 py-2" 
          style={{
            ...inlineStyle,
            justifyContent: blockStyle.textAlign === 'center' ? 'center' : 
                          blockStyle.textAlign === 'right' ? 'flex-end' : 'flex-start'
          }}
        >
          {block.content.items?.map((item: string, i: number) => (
            <li 
              key={i} 
              style={{
                color: blockStyle.textColor || '#374151',
                fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : '14px'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case 'card':
      // Empty state for card
      if (!block.content.title && !block.content.description) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Box size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add content in the settings panel →</p>
            </div>
          </div>
        );
      }
      
      return (
        <div 
          className="px-4 py-3"
          style={{ textAlign: blockStyle.textAlign || 'left' }}
        >
          <div 
            className="border border-gray-200 rounded-lg p-6"
            style={{
              backgroundColor: blockStyle.backgroundColor || '#ffffff',
              borderRadius: blockStyle.borderRadius ? `${blockStyle.borderRadius}px` : '8px',
              boxShadow: blockStyle.shadow === 'soft' ? '0 1px 3px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                        blockStyle.shadow === 'strong' ? '0 10px 15px rgba(0,0,0,0.2)' :
                        '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 
              className="font-semibold mb-2"
              style={{
                color: blockStyle.textColor || '#253154',
                fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : '18px'
              }}
            >
              {block.content.title}
            </h3>
            <p 
              className="text-gray-600"
              style={{
                fontSize: blockStyle.fontSize ? `${blockStyle.fontSize - 2}px` : '14px'
              }}
            >
              {block.content.description}
            </p>
          </div>
        </div>
      );

    case 'stat':
      // Empty state for stat
      if (!block.content.value && !block.content.label) {
        return (
          <div className="px-4 py-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <BarChart3 size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">This block is empty</p>
              <p className="text-xs text-gray-500">Click to add content in the settings panel →</p>
            </div>
          </div>
        );
      }
      
      return (
        <div 
          className="px-4 py-3"
          style={{ textAlign: blockStyle.textAlign || 'center' }}
        >
          <div 
            className="text-center"
            style={{
              backgroundColor: blockStyle.backgroundColor,
              borderRadius: blockStyle.borderRadius ? `${blockStyle.borderRadius}px` : undefined,
              padding: `${blockStyle.paddingY || 16}px ${blockStyle.paddingX || 16}px`
            }}
          >
            <div 
              className="font-bold mb-1"
              style={{
                color: blockStyle.textColor || '#0e042f',
                fontSize: blockStyle.fontSize ? `${blockStyle.fontSize + 8}px` : '36px'
              }}
            >
              {block.content.value}
            </div>
            <div 
              className="text-gray-600"
              style={{
                fontSize: blockStyle.fontSize ? `${blockStyle.fontSize}px` : '14px'
              }}
            >
              {block.content.label}
            </div>
          </div>
        </div>
      );

    case 'icon':
      return (
        <div 
          className="px-4 py-3" 
          style={{ textAlign: blockStyle.textAlign || 'center' }}
        >
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-lg"
            style={{
              backgroundColor: blockStyle.backgroundColor || '#f3f4f6',
              color: blockStyle.textColor || '#0e042f'
            }}
          >
            <Star size={blockStyle.fontSize || 32} />
          </div>
        </div>
      );

    case 'divider':
      return (
        <div 
          className="px-4 py-3"
          style={inlineStyle}
        >
          <hr 
            className="border-gray-300" 
            style={{
              borderColor: blockStyle.backgroundColor || '#e5e7eb'
            }}
          />
        </div>
      );
    
    default:
      return (
        <div className="px-4 py-3 text-gray-500 text-sm italic">
          [{block.type} block]
        </div>
      );
  }
};

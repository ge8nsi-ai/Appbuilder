import React from 'react'
import { Check, Users, DollarSign, Clock, Star } from 'lucide-react'
import { cn, formatPrice } from '../utils/index.js'

const ConceptCard = ({ 
  concept, 
  isSelected, 
  onSelect,
  index 
}) => {
  return (
    <div
      className={cn(
        'card cursor-pointer transition-all duration-300 hover:scale-105',
        {
          'ring-2 ring-whop-500 bg-whop-50': isSelected,
          'hover:shadow-xl': !isSelected
        }
      )}
      onClick={() => onSelect(index)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {concept.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {concept.description}
          </p>
        </div>
        {isSelected && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-6 h-6 bg-whop-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{concept.targetAudience}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-semibold text-green-600">
              {formatPrice(concept.pricePoint)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{concept.estimatedDuration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-2" />
            <span className="capitalize">{concept.difficulty}</span>
          </div>
          
          {concept.tags && concept.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {concept.tags.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-whop-100 text-whop-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConceptCard
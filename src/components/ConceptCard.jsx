import React from 'react'
import { Check, Users, DollarSign, Clock, Star, ArrowRight, Sparkles } from 'lucide-react'
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
        'concept-card group relative overflow-hidden',
        {
          'selected': isSelected
        }
      )}
      onClick={() => onSelect(index)}
    >
      {/* Background gradient overlay */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500',
        {
          'opacity-10 from-blue-500 to-indigo-500': isSelected,
          'group-hover:opacity-5 from-blue-400 to-indigo-400': !isSelected
        }
      )}></div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
            <Check className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {/* Floating sparkles for selected card */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {concept.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {concept.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Audience</p>
              <p className="text-sm font-medium text-slate-700 truncate max-w-24">
                {concept.targetAudience}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Price</p>
              <p className="text-sm font-bold text-green-600">
                {formatPrice(concept.pricePoint)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Duration</p>
              <p className="text-sm font-medium text-slate-700">
                {concept.estimatedDuration}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Level</p>
              <p className="text-sm font-medium text-slate-700 capitalize">
                {concept.difficulty}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {concept.tags && concept.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {concept.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 text-xs font-medium rounded-full border border-slate-200"
              >
                {tag}
              </span>
            ))}
            {concept.tags.length > 3 && (
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                +{concept.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="text-sm font-medium">
              {isSelected ? 'Selected' : 'Click to select'}
            </span>
          </div>
          <ArrowRight className={cn(
            'h-4 w-4 transition-all duration-300',
            {
              'text-blue-500 translate-x-1': isSelected,
              'text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1': !isSelected
            }
          )} />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>
    </div>
  )
}

export default ConceptCard
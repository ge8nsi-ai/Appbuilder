import React, { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Clock, Users } from 'lucide-react'
import { cn } from '../utils/index.js'

const CoursePreview = ({ courseContent }) => {
  const [expandedChapters, setExpandedChapters] = useState(new Set())

  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  if (!courseContent) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {courseContent.title}
        </h2>
        <p className="text-gray-600">
          {courseContent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center justify-center p-4 bg-whop-50 rounded-lg">
          <BookOpen className="h-5 w-5 text-whop-600 mr-2" />
          <span className="text-sm font-medium text-whop-700">
            {courseContent.chapters?.length || 0} Chapters
          </span>
        </div>
        <div className="flex items-center justify-center p-4 bg-whop-50 rounded-lg">
          <Clock className="h-5 w-5 text-whop-600 mr-2" />
          <span className="text-sm font-medium text-whop-700">
            {courseContent.chapters?.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0) || 0} Lessons
          </span>
        </div>
        <div className="flex items-center justify-center p-4 bg-whop-50 rounded-lg">
          <Users className="h-5 w-5 text-whop-600 mr-2" />
          <span className="text-sm font-medium text-whop-700">
            Self-Paced
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {courseContent.chapters?.map((chapter, chapterIndex) => {
          const isExpanded = expandedChapters.has(chapter.id)
          const lessonCount = chapter.lessons?.length || 0

          return (
            <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-3">
                    {chapterIndex + 1}
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {chapter.title}
                    </h3>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <div className="space-y-3">
                    {chapter.lessons?.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 w-8">
                          {lessonIndex + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </h4>
                          {lesson.type && (
                            <span className="inline-block px-2 py-1 bg-whop-100 text-whop-700 text-xs rounded-full mt-1">
                              {lesson.type}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CoursePreview
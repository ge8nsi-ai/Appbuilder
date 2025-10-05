import React from 'react'
import { Download, FileText, Mail, Video, Copy, Check } from 'lucide-react'
import { downloadFile, copyToClipboard } from '../utils/index.js'
import { useState } from 'react'

const LaunchAssets = ({ launchData }) => {
  const [copiedItems, setCopiedItems] = useState(new Set())

  const handleDownload = (content, filename) => {
    downloadFile(content, filename)
  }

  const handleCopy = async (content, itemId) => {
    try {
      await copyToClipboard(content)
      setCopiedItems(prev => new Set([...prev, itemId]))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  if (!launchData) return null

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Launch Assets Ready!
        </h2>
        <p className="text-gray-600">
          Download your marketing assets and launch your course
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VSL Script */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Video className="h-6 w-6 text-whop-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Video Sales Letter Script
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Complete VSL script for your course launch
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleDownload(launchData.vslScript, 'vsl-script.txt')}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download VSL Script
            </button>
            <button
              onClick={() => handleCopy(launchData.vslScript, 'vsl')}
              className="w-full btn-secondary flex items-center justify-center"
            >
              {copiedItems.has('vsl') ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Sequence */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-whop-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Email Nurture Sequence
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            {launchData.emailSequence?.length || 0} email sequence for course promotion
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                const emails = launchData.emailSequence?.map(email => 
                  `Subject: ${email.subject}\n\n${email.body}`
                ).join('\n\n---\n\n') || ''
                handleDownload(emails, 'email-sequence.txt')
              }}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Email Sequence
            </button>
            <button
              onClick={() => {
                const emails = launchData.emailSequence?.map(email => 
                  `Subject: ${email.subject}\n\n${email.body}`
                ).join('\n\n---\n\n') || ''
                handleCopy(emails, 'emails')
              }}
              className="w-full btn-secondary flex items-center justify-center"
            >
              {copiedItems.has('emails') ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Course Links */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-whop-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Course & Product Links
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={launchData.courseUrl || '#'}
                readOnly
                className="flex-1 input-field rounded-r-none"
              />
              <button
                onClick={() => handleCopy(launchData.courseUrl || '#', 'course')}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                {copiedItems.has('course') ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={launchData.productUrl || '#'}
                readOnly
                className="flex-1 input-field rounded-r-none"
              />
              <button
                onClick={() => handleCopy(launchData.productUrl || '#', 'product')}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                {copiedItems.has('product') ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaunchAssets
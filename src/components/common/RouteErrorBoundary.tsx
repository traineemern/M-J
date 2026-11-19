import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react'
import { siteData } from '@/data/site'

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError()

  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected application error occurred.'

  const isChunkError =
    errorMessage.includes('dynamically imported module') ||
    errorMessage.includes('Failed to fetch')

  return (
    <div className="min-h-screen bg-water-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-water-200 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-water-100 text-water-700 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-water-900 font-condensed uppercase tracking-tight">
          {isChunkError ? 'Module Updating' : 'Something Went Wrong'}
        </h1>

        <p className="mt-3 text-sm text-water-800 leading-relaxed">
          {isChunkError
            ? 'A component module is updating. Click below to reload the page with the latest version.'
            : 'We encountered an unexpected error while loading this page. Please reload or return home.'}
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left text-xs font-mono text-red-900 max-h-48 overflow-auto">
            <p className="font-bold mb-1">{errorMessage}</p>
            {error instanceof Error && error.stack && (
              <pre className="text-[10px] text-red-700 whitespace-pre-wrap">{error.stack}</pre>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-700 text-white font-condensed font-bold uppercase tracking-wider text-sm transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-water-100 hover:bg-water-200 text-water-900 font-condensed font-bold uppercase tracking-wider text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-water-100 flex items-center justify-center gap-2 text-xs text-water-700">
          <Phone className="w-3.5 h-3.5 text-water-700" />
          <span>Need immediate help? Call {siteData.phone}</span>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorBoundary

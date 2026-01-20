'use client'

import { CheckCircle2, Circle, AlertCircle, FileText, Shield } from 'lucide-react'
import { WKB_DOCUMENT_CATEGORIES } from '@/lib/mock-data'

interface WkbProgressProps {
  uploadedDocuments: number
  requiredDocuments: number
  verifiedDocuments: number
  categories: Array<{
    id: string
    uploaded: boolean
    verified: boolean
  }>
}

export function WkbProgress({
  uploadedDocuments,
  requiredDocuments,
  verifiedDocuments,
  categories,
}: WkbProgressProps) {
  const progress = Math.round((uploadedDocuments / requiredDocuments) * 100)
  const verifiedProgress = Math.round((verifiedDocuments / requiredDocuments) * 100)

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            Wkb Consumentendossier
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Wettelijk verplichte documentatie voor oplevering
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-700">{progress}%</div>
          <div className="text-sm text-slate-500">Compleet</div>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Geüpload</span>
            <span className="font-medium">{uploadedDocuments}/{requiredDocuments}</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Geverifieerd op blockchain</span>
            <span className="font-medium">{verifiedDocuments}/{requiredDocuments}</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-verified-600 to-verified-400 rounded-full transition-all duration-500"
              style={{ width: `${verifiedProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category checklist */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Vereiste categorieën</h4>
        <div className="grid grid-cols-2 gap-2">
          {WKB_DOCUMENT_CATEGORIES.filter(c => c.required).map(category => {
            const status = categories.find(c => c.id === category.id)
            const isUploaded = status?.uploaded ?? false
            const isVerified = status?.verified ?? false
            
            return (
              <div 
                key={category.id}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm
                  ${isVerified ? 'bg-verified-50 text-verified-700' : 
                    isUploaded ? 'bg-success-50 text-success-700' : 
                    'bg-slate-50 text-slate-500'}`}
              >
                {isVerified ? (
                  <Shield className="w-4 h-4 text-verified-500" />
                ) : isUploaded ? (
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
                <span className="truncate">{category.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function WkbStatusBanner({ 
  kwaliteitsborger,
  startmelding,
  progress,
}: { 
  kwaliteitsborger: string
  startmelding: Date
  progress: number
}) {
  const isComplete = progress === 100
  
  return (
    <div className={`rounded-xl p-4 ${isComplete ? 'bg-success-50 border border-success-200' : 'bg-primary-50 border border-primary-200'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${isComplete ? 'bg-success-100' : 'bg-primary-100'}`}>
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-success-600" />
          ) : (
            <FileText className="w-6 h-6 text-primary-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className={`font-semibold ${isComplete ? 'text-success-700' : 'text-primary-700'}`}>
            {isComplete ? 'Wkb Dossier Compleet' : 'Wkb Dossier in opbouw'}
          </h4>
          
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Kwaliteitsborger</span>
              <p className={`font-medium ${isComplete ? 'text-success-700' : 'text-primary-700'}`}>
                {kwaliteitsborger}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Startmelding</span>
              <p className={`font-medium ${isComplete ? 'text-success-700' : 'text-primary-700'}`}>
                {startmelding.toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${isComplete ? 'text-success-600' : 'text-primary-600'}`}>
            {progress}%
          </div>
        </div>
      </div>
    </div>
  )
}

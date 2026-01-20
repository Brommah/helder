'use client'

import { Shield, CheckCircle2, Clock, ExternalLink } from 'lucide-react'
import { formatHash } from '@/lib/blockchain-mock'

interface VerifiedBadgeProps {
  verified: boolean
  hash?: string
  timestamp?: Date
  size?: 'sm' | 'md' | 'lg'
  showHash?: boolean
  className?: string
}

export function VerifiedBadge({
  verified,
  hash,
  timestamp,
  size = 'md',
  showHash = false,
  className = '',
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (!verified) {
    return (
      <span className={`inline-flex items-center ${sizeClasses[size]} 
        bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium ${className}`}>
        <Clock className={iconSizes[size]} />
        <span>In afwachting</span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]}
      bg-gradient-to-r from-verified-100 to-purple-50
      border border-verified-400/30 rounded-lg
      text-verified-600 font-medium ${className}`}>
      <Shield className={`${iconSizes[size]} text-verified-500`} />
      <span className="flex items-center gap-1">
        Geverifieerd
        <CheckCircle2 className={`${iconSizes[size]} text-success-500`} />
      </span>
      {showHash && hash && (
        <code className="ml-1 px-1.5 py-0.5 bg-verified-100 rounded text-xs font-mono">
          {formatHash(hash, 6)}
        </code>
      )}
    </span>
  )
}

interface BlockchainInfoProps {
  hash: string
  network?: string
  timestamp?: Date
  blockNumber?: number
}

export function BlockchainInfo({
  hash,
  network = 'Cere Network',
  timestamp,
  blockNumber,
}: BlockchainInfoProps) {
  return (
    <div className="p-4 bg-gradient-to-br from-verified-50 to-purple-50 rounded-xl border border-verified-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-verified-100 rounded-lg">
          <Shield className="w-5 h-5 text-verified-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-verified-700">Blockchain Verificatie</h4>
          <p className="text-sm text-slate-600 mt-1">
            Dit document is cryptografisch beveiligd op {network}
          </p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Hash</span>
              <code className="font-mono text-verified-600 bg-white px-2 py-0.5 rounded">
                {formatHash(hash, 8)}
              </code>
            </div>
            
            {blockNumber && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Block</span>
                <span className="text-slate-700">#{blockNumber.toLocaleString()}</span>
              </div>
            )}
            
            {timestamp && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Timestamp</span>
                <span className="text-slate-700">
                  {timestamp.toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
          
          <button className="mt-3 flex items-center gap-1 text-sm text-verified-600 hover:text-verified-700">
            <span>Bekijk op explorer</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CereVaultBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 
      bg-gradient-to-r from-primary-900 to-primary-800 
      rounded-lg text-white text-sm font-medium ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 17L12 22L22 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 12L12 17L22 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span>Cere Data Vault</span>
    </div>
  )
}

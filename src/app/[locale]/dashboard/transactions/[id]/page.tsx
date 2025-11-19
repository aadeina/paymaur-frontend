'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Download, CheckCircle, Clock, XCircle, Share2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { transactionsService } from '@/lib/api/services/transactions.service'
import { formatCurrency, formatDate, copyToClipboard } from '@/lib/utils'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'

export default function TransactionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const transactionId = params.id as string

  const { data: transaction, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, transactionId],
    queryFn: () => transactionsService.getDetails(transactionId),
  })

  const handleDownloadReceipt = async () => {
    try {
      const blob = await transactionsService.getReceipt(transactionId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${transactionId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Receipt downloaded successfully')
    } catch (error) {
      toast.error('Failed to download receipt')
    }
  }

  const handleCopyReference = async () => {
    if (transaction?.reference) {
      const success = await copyToClipboard(transaction.reference)
      if (success) {
        toast.success('Reference copied to clipboard')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">Transaction not found</p>
        <Button className="mt-4" onClick={() => router.push('/dashboard/transactions')}>
          Back to Transactions
        </Button>
      </div>
    )
  }

  const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' },
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' },
    failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' },
    cancelled: { icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900' },
  }

  const status = statusConfig[transaction.status]
  const StatusIcon = status.icon
  const isIncoming = transaction.type === 'cash_in'

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Transaction Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{transaction.description}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(transaction.createdAt, 'long')}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.bg}`}>
              <StatusIcon className={`h-5 w-5 ${status.color}`} />
              <span className={`font-medium ${status.color}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Amount */}
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-2">Amount</p>
              <p className={`text-5xl font-bold ${
                isIncoming ? 'text-green-500' : 'text-red-500'
              }`}>
                {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>

            <Separator />

            {/* Transaction Details */}
            <div className="space-y-4">
              <DetailRow label="Transaction Type" value={transaction.type.replace('_', ' ').toUpperCase()} />
              <DetailRow label="Reference" value={transaction.reference || 'N/A'}
                onCopy={transaction.reference ? handleCopyReference : undefined} />
              <DetailRow label="Transaction Fee" value={formatCurrency(transaction.fee)} />
              <DetailRow
                label="Total Amount"
                value={formatCurrency(transaction.amount + transaction.fee)}
                highlight
              />

              {transaction.sender && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Sender</p>
                    <div className="space-y-1">
                      <DetailRow label="Name" value={transaction.sender.name} />
                      <DetailRow label="Phone" value={transaction.sender.phone} />
                    </div>
                  </div>
                </>
              )}

              {transaction.recipient && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Recipient</p>
                    <div className="space-y-1">
                      <DetailRow label="Name" value={transaction.recipient.name} />
                      <DetailRow label="Phone" value={transaction.recipient.phone} />
                    </div>
                  </div>
                </>
              )}

              {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Additional Information</p>
                    <div className="space-y-1">
                      {Object.entries(transaction.metadata).map(([key, value]) => (
                        <DetailRow key={key} label={key} value={String(value)} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleDownloadReceipt}>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
  onCopy
}: {
  label: string
  value: string
  highlight?: boolean
  onCopy?: () => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${highlight ? 'text-lg font-semibold' : ''}`}>
          {value}
        </span>
        {onCopy && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}>
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

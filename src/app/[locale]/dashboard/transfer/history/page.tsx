'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTransfer } from '@/hooks/use-transfer'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function TransactionIcon({ type }: { type: 'sent' | 'received' }) {
  if (type === 'sent') {
    return <ArrowUpRight className="h-5 w-5 text-red-500" />
  }
  return <ArrowDownLeft className="h-5 w-5 text-green-500" />
}

function StatusIcon({ status }: { status: Transaction['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <XCircle className="h-4 w-4 text-gray-500" />
  }
}

export default function TransferHistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received'>('all')
  const { useTransferHistory } = useTransfer()

  const { data: allTransfers, isLoading: loadingAll } = useTransferHistory({ limit: 50 })
  const { data: sentTransfers, isLoading: loadingSent } = useTransferHistory({ type: 'sent', limit: 50 })
  const { data: receivedTransfers, isLoading: loadingReceived } = useTransferHistory({ type: 'received', limit: 50 })

  const renderTransactionList = (transactions: Transaction[] | undefined, isLoading: boolean, type: 'all' | 'sent' | 'received') => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
              <div className="h-12 w-12 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-6 bg-muted rounded w-24" />
            </div>
          ))}
        </div>
      )
    }

    if (!transactions || transactions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">No transfers yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            {type === 'sent' ? "You haven't sent any money yet" :
             type === 'received' ? "You haven't received any money yet" :
             "Your transfer history will appear here"}
          </p>
          {type !== 'received' && (
            <Button className="mt-4" onClick={() => router.push('/dashboard/transfer')}>
              Send Money Now
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isSent = transaction.type === 'transfer' && transaction.sender
          const isReceived = transaction.type === 'cash_in'

          return (
            <button
              key={transaction.id}
              onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors text-left"
            >
              {/* Icon */}
              <div className="flex-shrink-0 h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                <TransactionIcon type={isSent ? 'sent' : 'received'} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <StatusIcon status={transaction.status} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </p>
                  {transaction.reference && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground font-mono">
                        {transaction.reference}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`font-semibold text-lg ${
                  isReceived ? 'text-green-500' : 'text-red-500'
                }`}>
                  {isReceived ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.fee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Fee: {formatCurrency(transaction.fee)}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transfer History</h1>
          <p className="text-muted-foreground mt-1">
            View all your sent and received transfers
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Transfers</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="all" className="mt-0">
              {renderTransactionList(allTransfers?.data, loadingAll, 'all')}
            </TabsContent>
            <TabsContent value="sent" className="mt-0">
              {renderTransactionList(sentTransfers?.data, loadingSent, 'sent')}
            </TabsContent>
            <TabsContent value="received" className="mt-0">
              {renderTransactionList(receivedTransfers?.data, loadingReceived, 'received')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

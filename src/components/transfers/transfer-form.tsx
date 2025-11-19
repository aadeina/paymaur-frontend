'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search, CheckCircle, ArrowRight } from 'lucide-react'
import { transferSchema, type TransferFormData } from '@/lib/validations/transfer'
import { useTransfer } from '@/hooks/use-transfer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransferRecipient } from '@/types'
import { formatCurrency, formatPhoneNumber } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TransferFormProps {
  onSuccess?: () => void
}

interface TransferResult {
  id: string
  amount: string | number
  fee?: string | number
  receiverPhone?: string
  receiverName?: string
  reference?: string
}

export function TransferForm({ onSuccess }: TransferFormProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<TransferRecipient | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [amount, setAmount] = useState<number>(0)
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)
  const { sendMoney, isSending, useFeeCalculation, recentRecipients } = useTransfer()
  const { data: feeData } = useFeeCalculation(amount)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  })

  // Update amount state for fee calculation
  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    setAmount(numValue)
    setValue('amount', numValue)
  }

  const handleSelectRecipient = (recipient: TransferRecipient) => {
    setSelectedRecipient(recipient)
    setValue('recipientPhone', recipient.phone)
    setShowSearch(false)
  }

  const onSubmit = (data: TransferFormData) => {
    sendMoney(data, {
      onSuccess: (result: any) => {
        // Extract transfer details from backend response
        const transfer = result?.transfer || result
        setTransferResult({
          id: transfer?.id || '',
          amount: transfer?.amount || data.amount,
          fee: transfer?.fee || feeData?.fee || 0,
          receiverPhone: transfer?.receiver_info?.phone || data.recipientPhone,
          receiverName: transfer?.receiver_info?.username || selectedRecipient?.name || data.recipientPhone,
          reference: transfer?.reference || transfer?.id,
        })
        onSuccess?.()
      },
    })
  }

  const handleNewTransfer = () => {
    setTransferResult(null)
    setSelectedRecipient(null)
    setAmount(0)
    setValue('recipientPhone', '')
    setValue('amount', 0)
    setValue('note', '')
    setValue('pin', '')
  }

  // Calculate total amount, ensuring values are numbers (backend may return strings)
  const totalAmount = feeData
    ? (parseFloat(String(feeData.total)) || parseFloat(String(feeData.amount)) + parseFloat(String(feeData.fee)) || amount)
    : amount

  // Show success card after transfer
  if (transferResult) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
                Transfer Successful!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Your money has been sent successfully
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount Sent</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(parseFloat(String(transferResult.amount)) || 0)}
                </span>
              </div>
              {transferResult.fee && parseFloat(String(transferResult.fee)) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction Fee</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(String(transferResult.fee)) || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">Recipient</span>
                <div className="text-right">
                  <p className="font-medium">{transferResult.receiverName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPhoneNumber(transferResult.receiverPhone || '')}
                  </p>
                </div>
              </div>
              {transferResult.reference && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <span className="text-xs font-mono">{transferResult.reference}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleNewTransfer}
              >
                New Transfer
              </Button>
              <Button
                className="flex-1"
                onClick={() => window.location.href = '/dashboard/transactions'}
              >
                View Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recent Recipients */}
      {!showSearch && recentRecipients && recentRecipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Recipients</CardTitle>
            <CardDescription>Select a recent recipient or search for new one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recentRecipients.slice(0, 3).map((recipient) => (
                <button
                  key={recipient.id}
                  onClick={() => handleSelectRecipient(recipient)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <Avatar>
                    <AvatarImage src={recipient.avatar} />
                    <AvatarFallback>
                      {(recipient.name || recipient.phone || '?').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{recipient.name || recipient.phone || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{formatPhoneNumber(recipient.phone)}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => setShowSearch(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search for another recipient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Money</CardTitle>
          <CardDescription>Transfer money to another PayMaur user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Recipient Phone Number</Label>
              {selectedRecipient ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-accent">
                  <Avatar>
                    <AvatarImage src={selectedRecipient.avatar} />
                    <AvatarFallback>
                      {(selectedRecipient.name || selectedRecipient.phone || '?').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{selectedRecipient.name || selectedRecipient.phone || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhoneNumber(selectedRecipient.phone)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRecipient(null)
                      setValue('recipientPhone', '')
                      setShowSearch(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    placeholder="22 12 34 56"
                    {...register('recipientPhone')}
                    disabled={isSending}
                    className={errors.recipientPhone ? 'border-destructive' : ''}
                  />
                  {errors.recipientPhone && (
                    <p className="text-sm text-destructive">{errors.recipientPhone.message}</p>
                  )}
                </>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                {...register('amount', {
                  valueAsNumber: true,
                  onChange: (e) => handleAmountChange(e.target.value),
                })}
                disabled={isSending}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            {/* Fee Display */}
            {feeData && amount > 0 && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer Amount</span>
                  <span className="font-medium">{formatCurrency(parseFloat(String(feeData.amount)) || amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Fee</span>
                  <span className="font-medium">{formatCurrency(parseFloat(String(feeData.fee)) || 0)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">{formatCurrency(parseFloat(String(feeData.total)) || totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                type="text"
                placeholder="What's this for?"
                {...register('note')}
                disabled={isSending}
                maxLength={200}
              />
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">Enter PIN to Confirm</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                maxLength={6}
                {...register('pin')}
                disabled={isSending}
                className={errors.pin ? 'border-destructive' : ''}
              />
              {errors.pin && (
                <p className="text-sm text-destructive">{errors.pin.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Transfer...
                </>
              ) : (
                `Send ${amount > 0 ? formatCurrency(totalAmount) : 'Money'}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

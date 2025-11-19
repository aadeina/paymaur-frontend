'use client'

import { useState } from 'react'
import { CreditCard, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

export function LimitSettings() {
  const [limits, setLimits] = useState({
    dailyTransferLimit: 100000,
    singleTransferLimit: 50000,
  })

  const [editMode, setEditMode] = useState({
    daily: false,
    single: false,
  })

  const handleSave = (type: 'daily' | 'single') => {
    setEditMode({ ...editMode, [type]: false })
    // In real app, save to API
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Limits</CardTitle>
        <CardDescription>
          Manage your daily and per-transaction limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Limit */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label>Daily Transfer Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum amount you can transfer per day
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode({ ...editMode, daily: !editMode.daily })}
            >
              {editMode.daily ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {editMode.daily ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={limits.dailyTransferLimit}
                onChange={(e) => setLimits({ ...limits, dailyTransferLimit: Number(e.target.value) })}
                className="flex-1"
              />
              <Button onClick={() => handleSave('daily')}>Save</Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{formatCurrency(limits.dailyTransferLimit)}</p>
              <p className="text-sm text-muted-foreground mt-1">Current daily limit</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Single Transaction Limit */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label>Single Transfer Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum amount per single transfer
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode({ ...editMode, single: !editMode.single })}
            >
              {editMode.single ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {editMode.single ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={limits.singleTransferLimit}
                onChange={(e) => setLimits({ ...limits, singleTransferLimit: Number(e.target.value) })}
                className="flex-1"
              />
              <Button onClick={() => handleSave('single')}>Save</Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{formatCurrency(limits.singleTransferLimit)}</p>
              <p className="text-sm text-muted-foreground mt-1">Current single transfer limit</p>
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Changes to limits may require additional verification and will take effect within 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

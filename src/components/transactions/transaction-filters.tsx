'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionFilters as Filters } from '@/types'

interface TransactionFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClear: () => void
}

export function TransactionFilters({ filters, onFiltersChange, onClear }: TransactionFiltersProps) {
  const handleTypeChange = (type: string) => {
    onFiltersChange({ ...filters, type: type === 'all' ? undefined : type })
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status === 'all' ? undefined : status })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined })
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined })
  }

  const hasActiveFilters = filters.type || filters.status || filters.search || filters.startDate || filters.endDate

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search transactions..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={!filters.type || filters.type === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('all')}
            >
              All
            </Button>
            <Button
              variant={filters.type === 'transfer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('transfer')}
            >
              Transfer
            </Button>
            <Button
              variant={filters.type === 'bill_payment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('bill_payment')}
            >
              Bill Payment
            </Button>
            <Button
              variant={filters.type === 'cash_in' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('cash_in')}
            >
              Cash In
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={!filters.status || filters.status === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('all')}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filters.status === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filters.status === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('failed')}
            >
              Failed
            </Button>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="startDate" className="text-sm text-muted-foreground">From</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm text-muted-foreground">To</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

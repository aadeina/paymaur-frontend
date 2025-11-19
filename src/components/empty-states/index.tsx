import {
  Receipt,
  Users,
  Bell,
  Search,
  FileText,
  CreditCard,
  History,
  Inbox,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function NoTransactionsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Receipt}
      title="No Transactions Yet"
      description="You haven't made any transactions yet. Start by sending money or making a payment."
      action={
        onAction
          ? {
              label: 'Send Money',
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoRecipientsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No Recipients Found"
      description="You haven't sent money to anyone yet. Add a recipient to get started."
      action={
        onAction
          ? {
              label: 'Add Recipient',
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={Bell}
      title="No Notifications"
      description="You're all caught up! No new notifications at the moment."
    />
  )
}

export function NoSearchResultsEmpty() {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description="We couldn't find anything matching your search. Try different keywords."
    />
  )
}

export function NoHistoryEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={History}
      title="No Transaction History"
      description="Your transaction history will appear here once you start using PayMaur."
      action={
        onAction
          ? {
              label: 'Make a Transaction',
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoBillsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No Bills to Pay"
      description="You don't have any pending bills. Your bill payments will appear here."
      action={
        onAction
          ? {
              label: 'Pay a Bill',
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoCardsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={CreditCard}
      title="No Cards Added"
      description="You haven't linked any cards yet. Add a card to start making payments."
      action={
        onAction
          ? {
              label: 'Add Card',
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoDataEmpty() {
  return (
    <EmptyState
      icon={Inbox}
      title="No Data Available"
      description="There's no data to display at the moment. Check back later."
    />
  )
}

import { Metadata } from 'next'
import { TransferForm } from '@/components/transfers/transfer-form'

export const metadata: Metadata = {
  title: 'Send Money - PayMaur',
  description: 'Transfer money to another PayMaur user',
}

export default function TransferPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Send Money</h1>
        <p className="text-muted-foreground mt-1">
          Transfer money instantly to any PayMaur user
        </p>
      </div>

      <TransferForm />
    </div>
  )
}

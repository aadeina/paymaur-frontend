import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}

export function BalanceCardSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-primary/80 to-primary/60">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24 bg-white/20" />
          <Skeleton className="h-10 w-48 bg-white/20" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-4 w-32 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

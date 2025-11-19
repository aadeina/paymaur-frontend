'use client'

import { useState } from 'react'
import { Eye, Users, History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    showBalance: true,
    showTransactionHistory: true,
    allowContactsSearch: true,
    publicProfile: false,
  })

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>
          Control what information is visible to others
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="showBalance">Show Balance</Label>
              <p className="text-sm text-muted-foreground">
                Display your balance on the dashboard
              </p>
            </div>
          </div>
          <Switch
            id="showBalance"
            checked={privacy.showBalance}
            onCheckedChange={() => handleToggle('showBalance')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="showTransactionHistory">Show Transaction History</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your transaction history
              </p>
            </div>
          </div>
          <Switch
            id="showTransactionHistory"
            checked={privacy.showTransactionHistory}
            onCheckedChange={() => handleToggle('showTransactionHistory')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="allowContactsSearch">Allow Contact Search</Label>
              <p className="text-sm text-muted-foreground">
                Let others find you by phone number
              </p>
            </div>
          </div>
          <Switch
            id="allowContactsSearch"
            checked={privacy.allowContactsSearch}
            onCheckedChange={() => handleToggle('allowContactsSearch')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="publicProfile">Public Profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to everyone
            </p>
          </div>
          <Switch
            id="publicProfile"
            checked={privacy.publicProfile}
            onCheckedChange={() => handleToggle('publicProfile')}
          />
        </div>
      </CardContent>
    </Card>
  )
}

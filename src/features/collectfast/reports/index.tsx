import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Reports() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>View analytics and reports for your receivables</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Reports content will be added here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


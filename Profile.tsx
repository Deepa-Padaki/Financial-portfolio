import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function Profile() {
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button>
                <Camera className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Mail className="text-muted-foreground mt-3 h-4 w-4" />
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Phone className="text-muted-foreground mt-3 h-4 w-4" />
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <MapPin className="text-muted-foreground mt-3 h-4 w-4" />
                <Input id="location" defaultValue="San Francisco, CA" />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Your email is verified</p>
              </div>
              <Badge>Verified</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phone Verification</p>
                <p className="text-sm text-muted-foreground">Your phone number is verified</p>
              </div>
              <Badge>Verified</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Identity Verification</p>
                <p className="text-sm text-muted-foreground">Complete KYC verification</p>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Subscription Plan</p>
                <p className="text-sm text-muted-foreground">Current plan: Free</p>
              </div>
              <Button variant="outline" size="sm">Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience Level</span>
              <span className="font-medium">Intermediate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Tolerance</span>
              <span className="font-medium">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Investment Goals</span>
              <span className="font-medium">Long-term Growth</span>
            </div>
            <Button variant="outline" className="w-full">Update Investment Profile</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

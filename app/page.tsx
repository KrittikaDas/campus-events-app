"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Clock, MapPin } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to Campus Events</h2>
            <p className="mt-2 text-sm text-gray-600">Discover and manage campus events, workshops, and activities</p>
          </div>

          <div className="space-y-4">
            <Link href="/login" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  For Students & Faculty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Join workshops, club meetings, hackathons, and more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Discover upcoming events and manage your RSVPs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Browse Events
            </CardTitle>
            <CardDescription>Discover upcoming campus activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/events">
              <Button className="w-full">View All Events</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Create Event
            </CardTitle>
            <CardDescription>Organize your own campus event</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create-event">
              <Button className="w-full" variant="outline">
                Create Event
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              My RSVPs
            </CardTitle>
            <CardDescription>View events you've joined</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/my-rsvps">
              <Button className="w-full" variant="outline">
                My Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

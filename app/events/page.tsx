"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number | null
  createdBy: string
  createdByName: string
  attendees: string[]
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { user } = useAuth()

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("campus-events") || "[]")

    // Filter to show only upcoming events
    const now = new Date()
    const upcomingEvents = storedEvents.filter((event: Event) => {
      const eventDateTime = new Date(`${event.date}T${event.time}`)
      return eventDateTime > now
    })

    setEvents(upcomingEvents)
    setFilteredEvents(upcomingEvents)
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, categoryFilter])

  const handleRSVP = (eventId: string) => {
    if (!user) return

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const isAlreadyAttending = event.attendees.includes(user.id)
        const updatedAttendees = isAlreadyAttending
          ? event.attendees.filter((id) => id !== user.id)
          : [...event.attendees, user.id]

        return { ...event, attendees: updatedAttendees }
      }
      return event
    })

    setEvents(updatedEvents)
    localStorage.setItem("campus-events", JSON.stringify(updatedEvents))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      workshop: "bg-blue-100 text-blue-800",
      "club-meeting": "bg-green-100 text-green-800",
      hackathon: "bg-purple-100 text-purple-800",
      seminar: "bg-orange-100 text-orange-800",
      social: "bg-pink-100 text-pink-800",
      sports: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.other
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600">Please log in to view events.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
        <p className="text-gray-600">Discover and join upcoming campus activities</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="club-meeting">Club Meeting</SelectItem>
            <SelectItem value="hackathon">Hackathon</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="social">Social Event</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {events.length === 0
              ? "No upcoming events at the moment. Check back later!"
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isAttending = event.attendees.includes(user.id)
            const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees

            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category.replace("-", " ")}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees.length}
                      {event.maxAttendees && `/${event.maxAttendees}`}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">Organized by {event.createdByName}</div>

                  <Button
                    onClick={() => handleRSVP(event.id)}
                    disabled={!isAttending && isFull}
                    variant={isAttending ? "outline" : "default"}
                    className="w-full"
                  >
                    {isAttending ? "Cancel RSVP" : isFull ? "Event Full" : "RSVP"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

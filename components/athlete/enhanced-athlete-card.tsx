import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Sword, MapPin, Video, Clock } from "lucide-react"
import Link from "next/link"

interface EnhancedAthleteCardProps {
  athlete: {
    id: string
    firstName: string
    lastName: string
    age: number
    gender: string
    weapon: string
    skillLevel: string
    avatar: string
    videosCount: number
    region: string
    club: string
    coach: string
    ranking: string
    recentActivity: string
  }
}

export function EnhancedAthleteCard({ athlete }: EnhancedAthleteCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        {/* Header with Avatar */}
        <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={athlete.avatar || "https://placehold.co/80x80?text=Athlete"}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {athlete.firstName} {athlete.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{athlete.club}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {athlete.ranking}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{athlete.age} years</span>
            </div>
            <div className="flex items-center gap-2">
              <Sword className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{athlete.weapon}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{athlete.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span>{athlete.videosCount} videos</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Active {athlete.recentActivity}</span>
            </div>
            <Badge variant="secondary" className="capitalize text-xs">
              {athlete.skillLevel}
            </Badge>
          </div>

          <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
            <Link href={`/athletes/${athlete.id}`}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Sword } from "lucide-react"
import Link from "next/link"

interface AthleteCardProps {
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
  }
}

export function AthleteCard({ athlete }: AthleteCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img
              src={athlete.avatar || "https://placehold.co/64x64?text=Athlete"}
              alt={`${athlete.firstName} ${athlete.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {athlete.firstName} {athlete.lastName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{athlete.age} years</span>
              <span>•</span>
              <span className="capitalize">{athlete.gender}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Sword className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize font-medium">{athlete.weapon}</span>
            <Badge variant="outline" className="text-xs">
              {athlete.skillLevel}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {athlete.videosCount} videos • {athlete.region}
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href={`/athletes/${athlete.id}`}>
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

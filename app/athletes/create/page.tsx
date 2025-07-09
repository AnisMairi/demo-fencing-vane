"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, UserPlus, Upload, X, Camera } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CreateAthletePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    
    // Fencing Information
    weapon: "",
    skillLevel: "",
    club: "",
    coach: "",
    region: "",
    
    // Additional Information
    emergencyContact: "",
    emergencyPhone: "",
    medicalNotes: "",
    notes: "",
  })

  // Tutor information for minors
  const [tutorInfo, setTutorInfo] = useState({
    tutorFirstName: "",
    tutorLastName: "",
    tutorEmail: "",
    tutorPhone: "",
    tutorRelationship: "",
    tutorAddress: "",
    tutorOccupation: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setAvatarFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0
    
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) return 0
    
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return Math.max(0, age) // Ensure age is not negative
  }

  // Check if athlete is a minor (under 18)
  const isMinor = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) < 18 : false

  const handleTutorInputChange = (field: string, value: string) => {
    setTutorInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically make an API call to save the athlete
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // If there's an avatar file, you would upload it here
      if (avatarFile) {
        // Simulate avatar upload
        console.log("Uploading avatar:", avatarFile.name)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Log tutor information if athlete is a minor
      if (isMinor) {
        console.log("Tutor information:", tutorInfo)
      }
      
      toast({
        title: "Success!",
        description: "Athlete has been added successfully.",
      })
      
      // Redirect back to athletes list
      router.push("/athletes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add athlete. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/athletes">
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Athlete</h1>
              <p className="text-muted-foreground">
                Enter the athlete's information to add them to the platform
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-base font-medium">Profile Photo</Label>
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                      <AvatarImage src={avatarPreview} alt="Profile preview" />
                      <AvatarFallback className="text-lg">
                        {formData.firstName && formData.lastName 
                          ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
                          : <Camera className="h-8 w-8" />
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeAvatar}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {avatarPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="athlete@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fencing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Fencing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weapon">Weapon *</Label>
                    <Select value={formData.weapon} onValueChange={(value) => handleInputChange("weapon", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weapon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foil">Foil</SelectItem>
                        <SelectItem value="sabre">Sabre</SelectItem>
                        <SelectItem value="épée">Épée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Skill Level *</Label>
                    <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange("skillLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="club">Club</Label>
                    <Input
                      id="club"
                      value={formData.club}
                      onChange={(e) => handleInputChange("club", e.target.value)}
                      placeholder="Enter club name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coach">Coach</Label>
                    <Input
                      id="coach"
                      value={formData.coach}
                      onChange={(e) => handleInputChange("coach", e.target.value)}
                      placeholder="Enter coach name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="lyon">Lyon</SelectItem>
                      <SelectItem value="marseille">Marseille</SelectItem>
                      <SelectItem value="toulouse">Toulouse</SelectItem>
                      <SelectItem value="bordeaux">Bordeaux</SelectItem>
                      <SelectItem value="nice">Nice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Parent or guardian name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tutor Information - Only show for minors */}
            {isMinor && (
              <Card className="border-orange-800 ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <UserPlus className="h-5 w-5" />
                    Legal Guardian/Tutor Information
                    <span className="text-sm font-normal text-orange-600">
                      (Required for athletes under 18)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorFirstName">Guardian First Name *</Label>
                      <Input
                        id="tutorFirstName"
                        value={tutorInfo.tutorFirstName}
                        onChange={(e) => handleTutorInputChange("tutorFirstName", e.target.value)}
                        placeholder="Enter guardian's first name"
                        required={isMinor}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorLastName">Guardian Last Name *</Label>
                      <Input
                        id="tutorLastName"
                        value={tutorInfo.tutorLastName}
                        onChange={(e) => handleTutorInputChange("tutorLastName", e.target.value)}
                        placeholder="Enter guardian's last name"
                        required={isMinor}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorEmail">Guardian Email *</Label>
                      <Input
                        id="tutorEmail"
                        type="email"
                        value={tutorInfo.tutorEmail}
                        onChange={(e) => handleTutorInputChange("tutorEmail", e.target.value)}
                        placeholder="guardian@example.com"
                        required={isMinor}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorPhone">Guardian Phone *</Label>
                      <Input
                        id="tutorPhone"
                        type="tel"
                        value={tutorInfo.tutorPhone}
                        onChange={(e) => handleTutorInputChange("tutorPhone", e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        required={isMinor}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorRelationship">Relationship to Athlete *</Label>
                      <Select 
                        value={tutorInfo.tutorRelationship} 
                        onValueChange={(value) => handleTutorInputChange("tutorRelationship", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="legal-guardian">Legal Guardian</SelectItem>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="uncle-aunt">Uncle/Aunt</SelectItem>
                          <SelectItem value="sibling">Sibling (18+)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorOccupation">Guardian Occupation</Label>
                      <Input
                        id="tutorOccupation"
                        value={tutorInfo.tutorOccupation}
                        onChange={(e) => handleTutorInputChange("tutorOccupation", e.target.value)}
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tutorAddress">Guardian Address</Label>
                    <Textarea
                      id="tutorAddress"
                      value={tutorInfo.tutorAddress}
                      onChange={(e) => handleTutorInputChange("tutorAddress", e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                    placeholder="Any medical conditions, allergies, or special requirements..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional information about the athlete..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/athletes">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding Athlete..." : "Add Athlete"}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  )
} 
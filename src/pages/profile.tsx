'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getUserProfile, updateUserProfile, deleteRecipe } from '@/lib/api'
import { User as ImportedUser, SavedRecipe } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Add proper type for textarea event
type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;

// Add these type definitions
interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  dietaryPreferences: Record<string, boolean>;
  cookingExperience: string;
  favoriteIngredients: string[];
  cuisinePreferences: string[];
  savedRecipes: SavedRecipe[];
}

// Update the User interface to match UserProfileData
interface User extends UserProfileData {
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) throw new Error('User not logged in')
      const data = await getUserProfile() as unknown as UserProfileData
      setUser({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setSavedRecipes(data.savedRecipes || [])
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      toast.error('Failed to load user profile')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await updateUserProfile(user)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe(id)
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id))
      toast.success('Recipe deleted successfully!')
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      toast.error('Failed to delete recipe')
    }
  }

  const handleDietaryPreferenceChange = (preference: string) => {
    if (!user) return
    setUser(prevUser => {
      if (!prevUser) return null
      return {
        ...prevUser,
        dietaryPreferences: {
          ...prevUser.dietaryPreferences,
          [preference]: !prevUser.dietaryPreferences[preference as keyof typeof prevUser.dietaryPreferences],
        },
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation
  };

  // Add type for Select value
  const handleSelect = (value: string) => {
    // Implementation
  };

  if (!user) return <div>Loading...</div>

  return (
    <div className="bg-gradient-to-b from-[#F9F5F2] to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-16 pb-12">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="mb-8 text-[#1A2530] hover:bg-[#1A2530] hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A2530] mb-2">Your Profile</h1>
        </header>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dietary Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(user.dietaryPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={() => handleDietaryPreferenceChange(key)}
                  />
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cooking Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cookingExperience">Cooking Experience</Label>
                <Select
                  value={user.cookingExperience}
                  onValueChange={(value: string) => setUser({ ...user, cookingExperience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="favoriteIngredients">Favorite Ingredients</Label>
                <Textarea
                  id="favoriteIngredients"
                  value={user.favoriteIngredients.join(', ')}
                  onChange={(e) => setUser({ ...user, favoriteIngredients: e.target.value.split(',').map(item => item.trim()) })}
                  placeholder="Enter your favorite ingredients, separated by commas"
                />
              </div>
              <div>
                <Label htmlFor="cuisinePreferences">Cuisine Preferences</Label>
                <Textarea
                  id="cuisinePreferences"
                  value={user.cuisinePreferences.join(', ')}
                  onChange={(e) => setUser({ ...user, cuisinePreferences: e.target.value.split(',').map(item => item.trim()) })}
                  placeholder="Enter your preferred cuisines, separated by commas"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              {savedRecipes.length > 0 ? (
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {savedRecipes.map((recipe, index) => (
                    <div key={recipe.id}>
                      <div className="flex items-center justify-between py-2">
                        <a href={`/recipe/${recipe.id}`} className="text-blue-600 hover:underline">
                          {recipe.title}
                        </a>
                        <Button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < savedRecipes.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">No saved recipes yet.</p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}
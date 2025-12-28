"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { User, Heart, Activity, Droplets, AlertCircle, CheckCircle } from "lucide-react"

// Form validation schema based on API requirements
const patientDataSchema = z.object({
  age: z.number().min(0).max(120),
  gender: z.number().min(0).max(1), // 0 = Female, 1 = Male
  bmi: z.number().min(10).max(60),
  blood_pressure_systolic: z.number().min(70).max(250),
  blood_pressure_diastolic: z.number().min(40).max(150),
  cholesterol: z.number().min(100).max(400),
  glucose: z.number().min(50).max(300),
  smoking: z.number().min(0).max(1), // 0 = No, 1 = Yes
  family_history: z.number().min(0).max(1), // 0 = No, 1 = Yes
  symptoms_severity: z.number().min(1).max(10),
  // Additional risk factors
  alcohol_consumption: z.number().min(0).max(2), // 0 = None, 1 = Moderate, 2 = Heavy
  exercise_frequency: z.number().min(0).max(3), // 0 = None, 1 = Low, 2 = Moderate, 3 = High
  diabetes_history: z.number().min(0).max(1), // 0 = No, 1 = Yes
  heart_disease_history: z.number().min(0).max(1), // 0 = No, 1 = Yes
  medication_usage: z.number().min(0).max(2), // 0 = None, 1 = Few, 2 = Multiple
  stress_level: z.number().min(1).max(5), // 1 = Very Low, 5 = Very High
})

type PatientData = z.infer<typeof patientDataSchema>

interface PatientDataFormProps {
  onSubmit: (data: PatientData) => void
  isLoading?: boolean
  defaultValues?: Partial<PatientData>
}

export function PatientDataForm({ 
  onSubmit, 
  isLoading = false,
  defaultValues 
}: PatientDataFormProps) {

  const form = useForm<PatientData>({
    resolver: zodResolver(patientDataSchema),
    defaultValues: {
      age: 30,
      gender: 1,
      bmi: 22.0,
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      cholesterol: 180,
      glucose: 90,
      smoking: 0,
      family_history: 0,
      symptoms_severity: 1,
      alcohol_consumption: 0,
      exercise_frequency: 2,
      diabetes_history: 0,
      heart_disease_history: 0,
      medication_usage: 0,
      stress_level: 2,
      ...defaultValues
    }
  })

  // Calculate form completion progress
  const watchedFields = form.watch()
  const completedFields = Object.values(watchedFields).filter(value => 
    value !== undefined && value !== null
  ).length
  const totalFields = Object.keys(patientDataSchema.shape).length
  const progress = Math.round((completedFields / totalFields) * 100)

  const handleSubmit = (data: PatientData) => {
    console.log('Form submitted with data:', data)
    console.log('Form errors:', form.formState.errors)
    onSubmit(data)
  }

  const getRiskCategory = (values: Partial<PatientData>) => {
    const { 
      age = 0, 
      bmi = 0, 
      blood_pressure_systolic = 0, 
      smoking = 0, 
      family_history = 0,
      alcohol_consumption = 0,
      exercise_frequency = 0,
      diabetes_history = 0,
      heart_disease_history = 0,
      medication_usage = 0,
      stress_level = 1
    } = values
    
    let riskScore = 0
    
    // Age risk factor
    if (age > 65) riskScore += 3
    else if (age > 50) riskScore += 2
    else if (age > 35) riskScore += 1
    
    // BMI risk factor
    if (bmi > 35) riskScore += 3
    else if (bmi > 30) riskScore += 2
    else if (bmi > 25) riskScore += 1
    
    // Blood pressure risk factor
    if (blood_pressure_systolic > 160) riskScore += 3
    else if (blood_pressure_systolic > 140) riskScore += 2
    else if (blood_pressure_systolic > 130) riskScore += 1
    
    // Lifestyle risk factors
    if (smoking === 1) riskScore += 3
    if (alcohol_consumption === 2) riskScore += 2
    else if (alcohol_consumption === 1) riskScore += 1
    
    if (exercise_frequency === 0) riskScore += 2
    else if (exercise_frequency === 1) riskScore += 1
    
    // Medical history risk factors
    if (family_history === 1) riskScore += 2
    if (diabetes_history === 1) riskScore += 2
    if (heart_disease_history === 1) riskScore += 3
    
    // Medication and stress risk factors
    if (medication_usage === 2) riskScore += 2
    else if (medication_usage === 1) riskScore += 1
    
    if (stress_level >= 4) riskScore += 2
    else if (stress_level === 3) riskScore += 1

    // Risk classification
    if (riskScore >= 10) return { level: "Critical", color: "destructive" }
    if (riskScore >= 7) return { level: "High", color: "destructive" }
    if (riskScore >= 4) return { level: "Medium", color: "secondary" }
    if (riskScore >= 2) return { level: "Low-Medium", color: "outline" }
    return { level: "Low", color: "default" }
  }

  const currentRisk = getRiskCategory(watchedFields)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Clinical Data</span>
            </CardTitle>
            <CardDescription>
              Enter patient health information for AI-powered risk assessment
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={currentRisk.color as "default" | "secondary" | "destructive" | "outline"}>
              {currentRisk.level} Risk
            </Badge>
            <div className="text-right">
              <div className="text-sm font-medium">{progress}% Complete</div>
              <Progress value={progress} className="w-24 h-2" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Demographics Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold">Demographics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Patient&apos;s age in years</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Female</SelectItem>
                          <SelectItem value="1">Male</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Biological gender</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI (kg/m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="22.0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Body Mass Index</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Heart className="h-4 w-4 text-red-500" />
                <h3 className="text-lg font-semibold">Vital Signs</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="blood_pressure_systolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="120" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Upper blood pressure reading</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_pressure_diastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="80" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Lower blood pressure reading</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Laboratory Values Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Droplets className="h-4 w-4 text-blue-500" />
                <h3 className="text-lg font-semibold">Laboratory Values</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="180" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Total cholesterol level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="90" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Blood glucose level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Risk Factors Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <h3 className="text-lg font-semibold">Risk Factors & Lifestyle</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="smoking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking Status</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Non-smoker</SelectItem>
                          <SelectItem value="1">Current smoker</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Current smoking status</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcohol_consumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Consumption</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select consumption" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">Moderate (1-2 drinks/week)</SelectItem>
                          <SelectItem value="2">Heavy (3+ drinks/week)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Weekly alcohol consumption</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exercise_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Frequency</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sedentary (No exercise)</SelectItem>
                          <SelectItem value="1">Low (1-2 times/week)</SelectItem>
                          <SelectItem value="2">Moderate (3-4 times/week)</SelectItem>
                          <SelectItem value="3">High (5+ times/week)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Weekly exercise frequency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stress_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level (1-5)</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Very Low</SelectItem>
                          <SelectItem value="2">Low</SelectItem>
                          <SelectItem value="3">Moderate</SelectItem>
                          <SelectItem value="4">High</SelectItem>
                          <SelectItem value="5">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Daily stress level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symptoms_severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms Severity (1-10)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          max="10"
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Current symptom severity</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medication_usage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Usage</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select usage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No medications</SelectItem>
                          <SelectItem value="1">1-3 medications</SelectItem>
                          <SelectItem value="2">4+ medications</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Current medication count</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical History Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Activity className="h-4 w-4 text-green-500" />
                <h3 className="text-lg font-semibold">Medical History</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="family_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family History</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select history" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No family history</SelectItem>
                          <SelectItem value="1">Positive family history</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Family history of serious diseases</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diabetes_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diabetes History</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select history" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No diabetes</SelectItem>
                          <SelectItem value="1">Diabetes present</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Personal diabetes history</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heart_disease_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Disease History</FormLabel>
                      <Select 
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select history" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No heart disease</SelectItem>
                          <SelectItem value="1">Heart disease present</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Personal heart disease history</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Validation Alert */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please correct the errors above before submitting the form.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>All fields validated and secure</span>
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Submit for Analysis</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export type { PatientData }
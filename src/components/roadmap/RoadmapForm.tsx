
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoadmapFormData } from '@/types/roadmap';

const FormSchema = z.object({
  role: z.string().min(2, { message: 'Role is required' }),
  studentType: z.enum(['student', 'working']),
  collegeTier: z.string().optional(),
  degree: z.string().optional(),
  knownSkills: z.string().optional(),
  learningPreference: z.enum(['video', 'text', 'project'])
});

interface RoadmapFormProps {
  onSubmit: (data: RoadmapFormData) => void;
  isGenerating?: boolean;
}

export function RoadmapForm({ onSubmit, isGenerating = false }: RoadmapFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: '',
      studentType: 'student',
      collegeTier: '',
      degree: '',
      knownSkills: '',
      learningPreference: 'video'
    }
  });

  const studentType = form.watch('studentType');

  const handleSubmit = (values: z.infer<typeof FormSchema>) => {
    // Ensure all required fields are present for RoadmapFormData
    const formData: RoadmapFormData = {
      role: values.role,
      studentType: values.studentType,
      collegeTier: values.collegeTier,
      degree: values.degree,
      knownSkills: values.knownSkills,
      learningPreference: values.learningPreference
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role or Skill</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Data Scientist, Frontend Developer, Machine Learning..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>You are a</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Student</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="working" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Working Professional</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {studentType === 'student' && (
          <>
            <FormField
              control={form.control}
              name="collegeTier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Tier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tier 1">Tier 1 (IITs, NITs, etc.)</SelectItem>
                      <SelectItem value="Tier 2">Tier 2</SelectItem>
                      <SelectItem value="Tier 3">Tier 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree/Course</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., B.Tech CSE, BCA, MCA..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="knownSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills You Already Know (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Python, React, SQL, Machine Learning basics..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Preferred Learning Style</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="video" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Video Courses</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="text" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Reading/Documentation</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="project" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Project-based Learning</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full glowing-purple" disabled={isGenerating}>
          {isGenerating ? 'Generating Roadmap...' : 'Generate AI Roadmap'}
        </Button>
      </form>
    </Form>
  );
}

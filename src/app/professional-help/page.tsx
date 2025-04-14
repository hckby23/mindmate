'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase, Psychiatrist } from '@/lib/supabase';
import { Calendar, Phone, Award } from 'lucide-react';

export default function ProfessionalHelpPage() {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch psychiatrists from Supabase
  useEffect(() => {
    const fetchPsychiatrists = async () => {
      try {
        const { data, error } = await supabase
          .from('psychiatrists')
          .select('*')
          .eq('location', 'Dehradun')
          .order('name');

        if (error) throw error;
        
        setPsychiatrists(data || []);
      } catch (error: unknown) {
        console.error('Error fetching psychiatrists:', error);
        setError('Failed to load psychiatrists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPsychiatrists();
  }, []);

  // If no psychiatrists are available in the database, use this sample data
  useEffect(() => {
    if (!loading && psychiatrists.length === 0 && !error) {
      // Sample data for demonstration
      setPsychiatrists([
        {
          id: '1',
          name: 'Dr. Ananya Sharma',
          license_id: 'PMHC-2023-DH-001',
          location: 'Dehradun',
          availability: 'Mon-Fri: 10:00 AM - 6:00 PM',
          contact: '+91 98765 43210'
        },
        {
          id: '2',
          name: 'Dr. Rajiv Mehta',
          license_id: 'PMHC-2022-DH-042',
          location: 'Dehradun',
          availability: 'Tue, Thu, Sat: 9:00 AM - 5:00 PM',
          contact: '+91 87654 32109'
        },
        {
          id: '3',
          name: 'Dr. Priya Gupta',
          license_id: 'PMHC-2021-DH-118',
          location: 'Dehradun',
          availability: 'Mon, Wed, Fri: 11:00 AM - 7:00 PM',
          contact: '+91 76543 21098'
        },
        {
          id: '4',
          name: 'Dr. Vikram Singh',
          license_id: 'PMHC-2020-DH-087',
          location: 'Dehradun',
          availability: 'Mon-Sat: 8:00 AM - 2:00 PM',
          contact: '+91 65432 10987'
        },
        {
          id: '5',
          name: 'Dr. Meera Patel',
          license_id: 'PMHC-2023-DH-029',
          location: 'Dehradun',
          availability: 'Wed-Sun: 12:00 PM - 8:00 PM',
          contact: '+91 54321 09876'
        }
      ]);
    }
  }, [loading, psychiatrists.length, error]);

  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Professional Help</h1>
          <p className="text-foreground/70 mb-8">
            Connect with licensed psychiatrists in Dehradun for professional mental health support.
          </p>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-pulse text-primary">Loading psychiatrists...</div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
              {error}
            </div>
          ) : (
            <div className="grid gap-6">
              {psychiatrists.map((psychiatrist) => (
                <div 
                  key={psychiatrist.id}
                  className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <h2 className="text-xl font-semibold mb-4 text-primary">{psychiatrist.name}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">License ID</p>
                        <p className="text-foreground/70">{psychiatrist.license_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Available Hours</p>
                        <p className="text-foreground/70">{psychiatrist.availability}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <a 
                          href={`tel:${psychiatrist.contact.replace(/\s+/g, '')}`}
                          className="text-primary hover:text-[var(--purple)] transition-colors"
                        >
                          {psychiatrist.contact}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full p-3 rounded-md bg-primary text-primary-foreground hover:bg-[var(--purple)] transition-colors">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

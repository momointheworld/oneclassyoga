'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Teacher {
  id: string;
  name: string;
  bio: string;
  styles: string[];
}

export default function EditTeacherProfilePage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams() as { slug: string };

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error('Fetch error:', error.message);
      } else {
        setTeacher(data);
      }

      setLoading(false);
    };

    fetchTeacher();
  }, [params.slug]);

  const handleSave = async () => {
    if (!teacher) return;

    const { error } = await supabase
      .from('teachers')
      .update({
        name: teacher.name,
        bio: teacher.bio,
        styles: teacher.styles,
      })
      .eq('id', teacher.id);

    if (error) {
      console.error('Update error:', error.message);
    } else {
      router.push(`/dashboard/teachers/${params.slug}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!teacher) return <p>Teacher not found.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">
        Edit {teacher.name}&#39;s Profile
      </h1>

      <div>
        <Label>Name</Label>
        <Input
          value={teacher.name}
          onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea
          value={teacher.bio}
          onChange={(e) => setTeacher({ ...teacher, bio: e.target.value })}
          rows={5}
        />
      </div>

      <div>
        <Label>Styles (comma-separated)</Label>
        <Input
          value={teacher.styles.join(', ')}
          onChange={(e) =>
            setTeacher({
              ...teacher,
              styles: e.target.value.split(',').map((s) => s.trim()),
            })
          }
        />
      </div>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
